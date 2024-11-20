// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';
import { NonCancelableEventHandler } from '../../events';

export type DrawerVisibilityChange = (callback: (isVisible: boolean) => void) => void;

export interface MountContentContext {
  onVisibilityChange: DrawerVisibilityChange;
}

export interface DrawerStateChangeParams {
  isOpen: boolean;
  initiatedByUserAction?: boolean;
}

export interface DrawerConfig {
  id: string;
  type?: 'local' | 'global';
  ariaLabels: {
    content?: string;
    closeButton?: string;
    triggerButton?: string;
    resizeHandle?: string;
  };
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

export type DrawersRegistrationListener = (drawers: Array<DrawerConfig>) => void;

export type DrawersToggledListener = (drawerId: string, params?: OpenCloseDrawerParams) => void;

export interface OpenCloseDrawerParams {
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
}

export class DrawersController {
  private drawers: Array<DrawerConfig> = [];
  private drawersRegistrationListener: DrawersRegistrationListener | null = null;
  private drawerOpenedListener: DrawersToggledListener | null = null;
  private drawerClosedListener: DrawersToggledListener | null = null;

  scheduleUpdate = debounce(() => {
    this.drawersRegistrationListener?.(this.drawers);
  }, 0);

  registerDrawer = (config: DrawerConfig) => {
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
      console.warn('[AwsUi] [runtime drawers] multiple app layout instances detected');
    }
    this.drawersRegistrationListener = listener;
    this.scheduleUpdate();
    return () => {
      this.drawersRegistrationListener = null;
    };
  };

  clearRegisteredDrawers = () => {
    this.drawers = [];
  };

  onDrawerOpened = (listener: DrawersToggledListener) => {
    if (this.drawerOpenedListener !== null) {
      console.warn('[AwsUi] [runtime drawers] multiple app layout instances detected');
    }

    this.drawerOpenedListener = listener;

    return () => {
      this.drawerOpenedListener = null;
    };
  };

  onDrawerClosed = (listener: DrawersToggledListener) => {
    if (this.drawerClosedListener !== null) {
      console.warn('[AwsUi] [runtime drawers] multiple app layout instances detected');
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
    return internalApi as DrawersApiInternal;
  }
}
