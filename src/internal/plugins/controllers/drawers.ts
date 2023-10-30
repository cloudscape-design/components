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

export type DrawersRegistrationListener = (drawers: Array<DrawerConfig>) => void;

export interface DrawersApiPublic {
  registerDrawer(config: DrawerConfig): void;
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
    return api as DrawersApiPublic;
  }

  installInternal(internalApi: Partial<DrawersApiInternal> = {}): DrawersApiInternal {
    internalApi.clearRegisteredDrawers ??= this.clearRegisteredDrawers;
    internalApi.onDrawersRegistered ??= this.onDrawersRegistered;
    return internalApi as DrawersApiInternal;
  }
}
