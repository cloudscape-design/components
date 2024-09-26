// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonDropdownWrapper from '../button-dropdown';
import SplitPanelWrapper from '../split-panel';

import testutilStyles from '../../../app-layout/test-classes/styles.selectors.js';
import splitPanelTestUtilStyles from '../../../split-panel/test-classes/styles.selectors.js';

export default class AppLayoutWrapper extends ComponentWrapper {
  static rootSelector = testutilStyles.root;

  findNavigation(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.navigation)!;
  }

  findNavigationToggle(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['navigation-toggle'])!;
  }

  findNavigationClose(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['navigation-close'])!;
  }

  findContentRegion(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.content)!;
  }

  findNotifications(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.notifications);
  }

  findBreadcrumbs(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.breadcrumbs);
  }

  findTools(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.tools)!;
  }

  findToolsClose(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['tools-close'])!;
  }

  findToolsToggle(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['tools-toggle'])!;
  }

  findSplitPanel(): SplitPanelWrapper | null {
    return this.findComponent(`.${SplitPanelWrapper.rootSelector}`, SplitPanelWrapper);
  }

  findSplitPanelOpenButton(): ElementWrapper | null {
    return this.findByClassName(splitPanelTestUtilStyles['open-button']);
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

  // findToolbarTriggerButtonContainer(isMobile: boolean): ElementWrapper | null {
  //   const drawersTriggerContainerClassKey = `drawers-${isMobile ? 'mobile' : 'desktop'}-triggers-container`;
  //   return this.findByClassName(appLayoutToolbarStyles[drawersTriggerContainerClassKey]);
  //   //if not working try createWrapper().find(`.${}`);
  // }

  findToolbar(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.toolbar);
  }

  findDrawerTriggerWrapperWithTooltip(): ElementWrapper | null {
    return this.findByClassName(testutilStyles['trigger-wrapper-tooltip-visible']);
  }

  findDrawerTriggerTooltip(): ElementWrapper | null {
    // return this.findByClassName(testutilStyles['trigger-tooltip']);
    return createWrapper().findByClassName(testutilStyles['trigger-tooltip']);
  }
}
