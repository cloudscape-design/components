// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import AppLayoutWrapper from '../app-layout';
import ButtonWrapper from '../button';
import ButtonGroupWrapper from '../button-group';

import testutilStyles from '../../../app-layout/test-classes/styles.css.js';
import globalDrawerStyles from '../../../app-layout/visual-refresh-toolbar/drawer/styles.css.js';
import visualRefreshToolbarStyles from '../../../app-layout/visual-refresh-toolbar/skeleton/styles.css.js';

export class AppLayoutDrawerWrapper extends ComponentWrapper {
  @usesDom
  isActive(): boolean {
    return this.element.classList.contains(testutilStyles['active-drawer']);
  }

  @usesDom
  isDrawerInExpandedMode(): boolean {
    return this.element.classList.contains(globalDrawerStyles['drawer-expanded']);
  }
}

export default class AppLayoutRuntimeWrapper extends AppLayoutWrapper {
  findActiveDrawers(): Array<ElementWrapper> {
    return this.findAllByClassName(testutilStyles['active-drawer']);
  }

  findDrawerById(id: string): AppLayoutDrawerWrapper | null {
    const element = this.find(`[data-testid="awsui-app-layout-drawer-${id}"]`);
    return element ? new AppLayoutDrawerWrapper(element.getElement()) : null;
  }

  findGlobalDrawersTriggers(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(testutilStyles['drawers-trigger-global']);
  }

  findResizeHandleByActiveDrawerId(id: string): ElementWrapper | null {
    return this.find(
      `.${testutilStyles['active-drawer']}[data-testid="awsui-app-layout-drawer-${id}"] .${testutilStyles['drawers-slider']}`
    );
  }

  findCloseButtonByActiveDrawerId(id: string): ButtonWrapper | null {
    return this.findComponent(
      `.${testutilStyles['active-drawer']}[data-testid="awsui-app-layout-drawer-${id}"]`,
      ButtonGroupWrapper
    )!.findButtonById('close');
  }

  findExpandedModeButtonByActiveDrawerId(id: string): ButtonWrapper | null {
    return this.findComponent(
      `.${testutilStyles['active-drawer']}[data-testid="awsui-app-layout-drawer-${id}"]`,
      ButtonGroupWrapper
    )!.findButtonById('expand');
  }

  findLeaveExpandedModeButtonInAIDrawer(): ElementWrapper | null {
    return this.find(
      `.${testutilStyles['active-drawer']} .${testutilStyles['active-ai-drawer-leave-expanded-mode-custom-button']}`
    );
  }

  @usesDom
  isLayoutInDrawerExpandedMode(): boolean {
    return this.element.matches(`.${visualRefreshToolbarStyles['drawer-expanded-mode']}`);
  }

  findAiDrawerTrigger(): ElementWrapper | null {
    return this.find(`.${testutilStyles['ai-drawer-toggle']}`);
  }
}
