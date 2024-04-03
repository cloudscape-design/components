// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import SplitPanelWrapper from '../split-panel';
import testutilStyles from '../../../app-layout/test-classes/styles.selectors.js';
import ButtonDropdownWrapper from '../button-dropdown';

export default class AppLayoutWrapper extends ComponentWrapper {
  static rootSelector = testutilStyles.root;

  findNavigation(): ElementWrapper {
    return this.findByClassName(testutilStyles.navigation)!;
  }

  findNavigationToggle(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['navigation-toggle'])!;
  }

  findNavigationClose(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['navigation-close'])!;
  }

  findContentRegion(): ElementWrapper {
    return this.findByClassName(testutilStyles.content)!;
  }

  findNotifications(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.notifications);
  }

  findBreadcrumbs(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.breadcrumbs);
  }

  findTools(): ElementWrapper {
    return this.findByClassName(testutilStyles.tools)!;
  }

  findToolsClose(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['tools-close'])!;
  }

  findToolsToggle(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['tools-toggle'])!;
  }

  findSplitPanel(): SplitPanelWrapper | null {
    return this.findComponent(`.${SplitPanelWrapper.rootSelector}`, SplitPanelWrapper);
  }

  findActiveDrawer(): ElementWrapper | null {
    return this.findByClassName(testutilStyles['active-drawer']);
  }

  findActiveDrawerCloseButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['active-drawer-close-button']);
  }

  findDrawersTriggers(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(testutilStyles['drawers-trigger']);
  }

  findDrawerTriggerById(id: string): ElementWrapper<HTMLButtonElement> | null {
    return this.find(`.${testutilStyles['drawers-trigger']}[data-testid="awsui-app-layout-trigger-${id}"]`);
  }

  findDrawersOverflowTrigger(): ButtonDropdownWrapper | null {
    return this.findComponent(`.${testutilStyles['overflow-menu']}`, ButtonDropdownWrapper);
  }

  findActiveDrawerResizeHandle(): ElementWrapper | null {
    return this.findByClassName(testutilStyles['drawers-slider']);
  }
}
