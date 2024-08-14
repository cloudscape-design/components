// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { TrustedHTML } from 'trusted-types/lib';

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
    iconSvg: string | TrustedHTML;
  };
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
}

export type UpdateDrawerConfig = Pick<DrawerConfig, 'id' | 'badge' | 'resizable' | 'defaultSize'>;

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
