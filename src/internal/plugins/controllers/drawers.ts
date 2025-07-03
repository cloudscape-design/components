// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';
import { NonCancelableEventHandler } from '../../events';
import { reportRuntimeApiWarning } from '../helpers/metrics';

type DrawerVisibilityChange = (callback: (isVisible: boolean) => void) => void;

export type DrawerPosition = 'side' | 'bottom';

interface MountContentContext {
  onVisibilityChange: DrawerVisibilityChange;
}

export interface DrawerStateChangeParams {
  isOpen: boolean;
  initiatedByUserAction?: boolean;
}

export interface DrawerPositionChangeParams {
  position: DrawerPosition;
}

export interface DrawerConfig {
  id: string;
  type?: 'local' | 'global';
  ariaLabels: {
    content?: string;
    closeButton?: string;
    triggerButton?: string;
    resizeHandle?: string;
    resizeHandleTooltipText?: string;
    expandedModeButton?: string;
  };
  isExpandable?: boolean;
  badge?: boolean;
  resizable?: boolean;
  defaultSize?: number;
  onResize?: NonCancelableEventHandler<{ size: number; id: string }>;
  orderPriority?: number;
  defaultActive?: boolean;
  trigger?: {
    iconSvg: string;
  };
  mountContent: (container: HTMLElement, mountContext: MountContentContext) => void;
  unmountContent: (container: HTMLElement) => void;
  preserveInactiveContent?: boolean;
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
  movable?: boolean;
  position?: DrawerPosition;
  onPositionChange?: NonCancelableEventHandler<DrawerPositionChangeParams>;
}

const updatableProperties = [
  'badge',
  'resizable',
  'defaultSize',
  'orderPriority',
  'defaultActive',
  'onResize',
] as const;

export type UpdateDrawerConfig = { id: DrawerConfig['id'] } & Partial<
  Pick<DrawerConfig, (typeof updatableProperties)[number]>
>;

type DrawersRegistrationListener = (drawers: Array<DrawerConfig>) => void;
type DrawersUpdateListener = (drawers: Array<DrawerConfig>) => void;

export type DrawersToggledListener = (drawerId: string, params?: OpenCloseDrawerParams) => void;

interface OpenCloseDrawerParams {
  initiatedByUserAction: boolean;
}

export interface DrawersApiPublic {
  registerDrawer(config: DrawerConfig): void;
  updateDrawer(config: UpdateDrawerConfig): void;
  openDrawer(drawerId: string, params?: OpenCloseDrawerParams): void;
  closeDrawer(drawerId: string, params?: OpenCloseDrawerParams): void;
}

export interface DrawersApiInternal {
  clearRegisteredDrawers(): void;
  onDrawersRegistered(listener: DrawersRegistrationListener): () => void;
  onDrawerOpened(listener: DrawersToggledListener): () => void;
  onDrawerClosed(listener: DrawersToggledListener): () => void;
  onDrawersUpdated(listener: DrawersUpdateListener): void;
  getDrawersState(): Array<DrawerConfig>;
}

export class DrawersController {
  private drawers: Array<DrawerConfig> = [];
  private drawersRegistrationListener: DrawersRegistrationListener | null = null;
  private drawerOpenedListener: DrawersToggledListener | null = null;
  private drawerClosedListener: DrawersToggledListener | null = null;
  private drawersUpdateListeners: Array<DrawersUpdateListener> = [];

  scheduleUpdate = debounce(() => {
    this.drawersRegistrationListener?.(this.drawers);
    this.drawersUpdateListeners.forEach(drawersUpdateListeners => {
      drawersUpdateListeners?.(this.drawers);
    });
  }, 0);

  registerDrawer = (config: DrawerConfig) => {
    if (this.drawers.find(drawer => drawer.id === config.id)) {
      reportRuntimeApiWarning('app-layout-drawers', `drawer with id "${config.id}" is already registered`);
    }
    this.drawers = this.drawers.concat(config);
    this.scheduleUpdate();
  };

  updateDrawer = ({ id: drawerId, ...rest }: UpdateDrawerConfig) => {
    const drawerIndex = this.drawers.findIndex(({ id }) => id === drawerId);
    const oldDrawerConfig = this.drawers?.[drawerIndex];
    if (!oldDrawerConfig) {
      throw new Error(`[AwsUi] [runtime drawers] drawer with id ${drawerId} not found`);
    }
    const drawers = this.drawers.slice();
    const updatedDrawer = { ...oldDrawerConfig };
    for (const key of updatableProperties) {
      if (key in rest) {
        updatedDrawer[key] = (rest as any)[key];
      }
    }
    drawers[drawerIndex] = updatedDrawer;
    this.drawers = drawers;
    this.scheduleUpdate();
  };

  onDrawersRegistered = (listener: DrawersRegistrationListener) => {
    if (this.drawersRegistrationListener !== null) {
      reportRuntimeApiWarning(
        'app-layout-drawers',
        'multiple app layout instances detected when calling onDrawersRegistered'
      );
    }
    this.drawersRegistrationListener = listener;
    this.scheduleUpdate();
    return () => {
      this.drawersRegistrationListener = null;
      this.drawersUpdateListeners = [];
    };
  };

  clearRegisteredDrawers = () => {
    this.drawers = [];
  };

  onDrawerOpened = (listener: DrawersToggledListener) => {
    if (this.drawerOpenedListener !== null) {
      reportRuntimeApiWarning(
        'app-layout-drawers',
        'multiple app layout instances detected when calling onDrawerOpened'
      );
    }

    this.drawerOpenedListener = listener;

    return () => {
      this.drawerOpenedListener = null;
    };
  };

  onDrawerClosed = (listener: DrawersToggledListener) => {
    if (this.drawerClosedListener !== null) {
      reportRuntimeApiWarning(
        'app-layout-drawers',
        'multiple app layout instances detected when calling onDrawerClosed'
      );
    }

    this.drawerClosedListener = listener;

    return () => {
      this.drawerClosedListener = null;
    };
  };

  openDrawer = (drawerId: string, params?: OpenCloseDrawerParams) => {
    this.drawerOpenedListener?.(drawerId, params);
  };

  closeDrawer = (drawerId: string, params?: OpenCloseDrawerParams) => {
    this.drawerClosedListener?.(drawerId, params);
  };

  onDrawersUpdated = (listener: DrawersUpdateListener) => {
    this.drawersUpdateListeners.push(listener);

    return () => {
      this.drawersUpdateListeners = this.drawersUpdateListeners.filter(item => item !== listener);
    };
  };

  getDrawersState = () => {
    return this.drawers;
  };

  installPublic(api: Partial<DrawersApiPublic> = {}): DrawersApiPublic {
    api.registerDrawer ??= this.registerDrawer;
    api.updateDrawer ??= this.updateDrawer;
    api.openDrawer ??= this.openDrawer;
    api.closeDrawer ??= this.closeDrawer;
    return api as DrawersApiPublic;
  }

  installInternal(internalApi: Partial<DrawersApiInternal> = {}): DrawersApiInternal {
    internalApi.clearRegisteredDrawers ??= this.clearRegisteredDrawers;
    internalApi.onDrawersRegistered ??= this.onDrawersRegistered;
    internalApi.onDrawerOpened ??= this.onDrawerOpened;
    internalApi.onDrawerClosed ??= this.onDrawerClosed;
    internalApi.onDrawersUpdated ??= this.onDrawersUpdated;
    internalApi.getDrawersState ??= this.getDrawersState;
    return internalApi as DrawersApiInternal;
  }
}
