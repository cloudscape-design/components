// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonDropdownWrapper from '../button-dropdown';
import SplitPanelWrapper from '../split-panel';

import testutilStyles from '../../../app-layout/test-classes/styles.selectors.js';
import splitPanelTestUtilStyles from '../../../split-panel/test-classes/styles.selectors.js';

export default class AppLayoutWrapper extends ComponentWrapper {
  static rootSelector = testutilStyles.root;

  findNavigation(): ElementWrapper {
    return this.findByClassName(testutilStyles.navigation)!;
  }

  findOpenNavigationPanel(): ElementWrapper | null {
    const navigation = this.findNavigation();
    if (!navigation) {
      throw new Error('App Layout does not have navigation content');
    }
    return navigation.matches(`:not(.${testutilStyles['drawer-closed']})`);
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

  findOpenToolsPanel(): ElementWrapper | null {
    const tools = this.findTools();
    if (!tools) {
      throw new Error('App Layout does not have tools content');
    }
    return tools.matches(`:not(.${testutilStyles['drawer-closed']})`);
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

  findDrawerTriggerWithBadgeById(id: string): ElementWrapper | null {
    const trigger = this.findDrawerTriggerById(id);
    if (!trigger) {
      throw new Error(`Drawer trigger "${id}" does not exist`);
    }
    return trigger.matches(`.${testutilStyles['drawers-trigger-with-badge']}`);
  }

  findDrawersOverflowTrigger(): ButtonDropdownWrapper | null {
    return this.findComponent(`.${testutilStyles['overflow-menu']}`, ButtonDropdownWrapper);
  }

  findActiveDrawerResizeHandle(): ElementWrapper | null {
    return this.findByClassName(testutilStyles['drawers-slider']);
  }

  findToolbar(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.toolbar);
  }

  findDrawerTriggerTooltip(): ElementWrapper | null {
    return createWrapper().findByClassName(testutilStyles['trigger-tooltip']);
  }
}
