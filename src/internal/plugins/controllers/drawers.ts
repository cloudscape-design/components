// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';
import { NonCancelableEventHandler } from '../../events';

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
  trigger: {
    iconSvg: string;
  };
  mountContent: (
    container: HTMLElement,
    onVisibilityChange?: (callback: (isVisible: boolean) => void) => () => void
  ) => void;
  unmountContent: (container: HTMLElement) => void;
  preserveInactiveContent?: boolean;
}

export type UpdateDrawerConfig = Pick<DrawerConfig, 'id' | 'badge' | 'resizable' | 'defaultSize'>;

export type DrawersRegistrationListener = (drawers: Array<DrawerConfig>) => void;

export type DrawersOpenedListener = (drawerId: string) => void;

export interface DrawersApiPublic {
  registerDrawer(config: DrawerConfig): void;
  updateDrawer(config: UpdateDrawerConfig): void;
  openDrawer(drawerId: string): void;
}

export interface DrawersApiInternal {
  clearRegisteredDrawers(): void;
  onDrawersRegistered(listener: DrawersRegistrationListener): () => void;
  onDrawerOpened(listener: DrawersOpenedListener): () => void;
}

export class DrawersController {
  private drawers: Array<DrawerConfig> = [];
  private drawersRegistrationListener: DrawersRegistrationListener | null = null;
  private drawerOpenedListener: DrawersOpenedListener | null = null;

  scheduleUpdate = debounce(() => {
    this.drawersRegistrationListener?.(this.drawers);
  }, 0);

  registerDrawer = (config: DrawerConfig) => {
    this.drawers = this.drawers.concat(config);
    this.scheduleUpdate();
  };

  updateDrawer = (config: UpdateDrawerConfig) => {
    const { id: drawerId, resizable, badge, defaultSize } = config;
    const drawerIndex = this.drawers.findIndex(({ id }) => id === drawerId);
    const oldDrawerConfig = this.drawers?.[drawerIndex];
    if (drawerIndex >= 0 && oldDrawerConfig) {
      const drawers = this.drawers.slice();
      const drawerConfig = { ...oldDrawerConfig };
      if (typeof resizable === 'boolean') {
        drawerConfig.resizable = resizable;
      }
      if (typeof badge === 'boolean') {
        drawerConfig.badge = badge;
      }
      if (typeof defaultSize === 'number') {
        drawerConfig.defaultSize = defaultSize;
      }

      drawers[drawerIndex] = drawerConfig;
      this.drawers = drawers;
      this.scheduleUpdate();
    } else {
      throw new Error(`[AwsUi] [runtime drawers] drawer with id ${drawerId} not found`);
    }
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

  onDrawerOpened = (listener: DrawersOpenedListener) => {
    if (this.drawerOpenedListener !== null) {
      console.warn('[AwsUi] [runtime drawers] multiple app layout instances detected');
    }

    this.drawerOpenedListener = listener;

    return () => {
      this.drawerOpenedListener = null;
    };
  };

  openDrawer = (drawerId: string) => {
    this.drawerOpenedListener?.(drawerId);
  };

  installPublic(api: Partial<DrawersApiPublic> = {}): DrawersApiPublic {
    api.registerDrawer ??= this.registerDrawer;
    api.updateDrawer ??= this.updateDrawer;
    api.openDrawer ??= this.openDrawer;
    return api as DrawersApiPublic;
  }

  installInternal(internalApi: Partial<DrawersApiInternal> = {}): DrawersApiInternal {
    internalApi.clearRegisteredDrawers ??= this.clearRegisteredDrawers;
    internalApi.onDrawersRegistered ??= this.onDrawersRegistered;
    internalApi.onDrawerOpened ??= this.onDrawerOpened;
    return internalApi as DrawersApiInternal;
  }
}
