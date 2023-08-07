// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DrawerItem } from '../../app-layout/drawer/interfaces';
import debounce from '../debounce';

export type DrawerConfig = Omit<DrawerItem, 'content' | 'trigger'> & {
  orderPriority?: number;
  trigger: {
    iconSvg: string;
  };
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
};
export type DrawersRegistrationListener = (drawers: Array<DrawerConfig>) => void;

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
}
