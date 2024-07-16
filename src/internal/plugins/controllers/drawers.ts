// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';
import { NonCancelableEventHandler } from '../../events';

export interface DrawerConfig {
  id: string;
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
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
}

export type UpdateDrawerConfig = Partial<Omit<DrawerConfig, 'onResize' | 'mountContent' | 'unmountContent'>>;

export type DrawersRegistrationListener = (drawers: Array<DrawerConfig>) => void;

export interface DrawersApiPublic {
  registerDrawer(config: DrawerConfig): void;
  updateDrawer(config: UpdateDrawerConfig): void;
}

export interface DrawersApiInternal {
  clearRegisteredDrawers(): void;
  onDrawersRegistered(listener: DrawersRegistrationListener): () => void;
}

export class DrawersController {
  private drawers: Array<DrawerConfig> = [];
  private drawersRegistrationListener: DrawersRegistrationListener | null = null;

  scheduleUpdate = debounce(() => {
    this.drawersRegistrationListener?.(this.drawers);
  }, 0);

  registerDrawer = (config: DrawerConfig) => {
    this.drawers = this.drawers.concat(config);
    this.scheduleUpdate();
  };

  updateDrawer = (config: UpdateDrawerConfig) => {
    const updateDrawerConfig = config as Partial<DrawerConfig>;
    if (updateDrawerConfig?.onResize || updateDrawerConfig?.mountContent || updateDrawerConfig?.unmountContent) {
      throw new Error('[AwsUi] [runtime drawers] cannot update drawer functions');
    }
    const drawerIndex = this.drawers.findIndex(({ id }) => id === config?.id);
    if (drawerIndex >= 0) {
      const drawers = this.drawers.slice();
      const oldDrawerConfig = drawers[drawerIndex];
      drawers[drawerIndex] = { ...oldDrawerConfig, ...config };
      this.drawers = drawers;
      this.scheduleUpdate();
    } else {
      throw new Error(`[AwsUi] [runtime drawers] drawer with id ${config.id} not found`);
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

  installPublic(api: Partial<DrawersApiPublic> = {}): DrawersApiPublic {
    api.registerDrawer ??= this.registerDrawer;
    api.updateDrawer ??= this.updateDrawer;
    return api as DrawersApiPublic;
  }

  installInternal(internalApi: Partial<DrawersApiInternal> = {}): DrawersApiInternal {
    internalApi.clearRegisteredDrawers ??= this.clearRegisteredDrawers;
    internalApi.onDrawersRegistered ??= this.onDrawersRegistered;
    return internalApi as DrawersApiInternal;
  }
}
