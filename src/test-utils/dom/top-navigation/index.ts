// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import ButtonDropdownWrapper from '../button-dropdown';
import LinkWrapper from '../link';

import buttonDropdownStyles from '../../../button-dropdown/styles.selectors.js';
import menuDropdownStyles from '../../../internal/components/menu-dropdown/styles.selectors.js';
import styles from '../../../top-navigation/styles.selectors.js';

export default class TopNavigationWrapper extends ComponentWrapper {
  static rootSelector = `${styles['top-navigation']}:not(.${styles.hidden})`;

  findIdentityLink(): ElementWrapper {
    return this.find(`.${styles.identity} a`)!;
  }

  findLogo(): ElementWrapper | null {
    return this.find(`.${styles.logo}`);
  }

  findTitle(): ElementWrapper | null {
    return this.find(`.${styles.title}`);
  }

  findSearch(): ElementWrapper | null {
    return this.find(`.${styles.search}`);
  }

  findUtilities(): Array<TopNavigationUtilityWrapper> {
    return this.findAll(`.${styles['utility-wrapper']}[data-utility-index]`).map(
      i => new TopNavigationUtilityWrapper(i.getElement())
    );
  }

  findUtility(index: number): TopNavigationUtilityWrapper | null {
    return this.findComponent(
      `.${styles['utility-wrapper']}[data-utility-index="${index - 1}"]`,
      TopNavigationUtilityWrapper
    );
  }

  findSearchButton(): ElementWrapper | null {
    return this.find(`.${styles['utility-wrapper']}[data-utility-special="search"] a`);
  }

  findOverflowMenuButton(): ButtonWrapper | null {
    return this.findComponent(`[data-utility-special="menu-trigger"] > button`, ButtonWrapper);
  }

  findOverflowMenu(): OverflowMenu | null {
    return createWrapper().findComponent(`.${styles['overflow-menu-drawer']}`, OverflowMenu);
  }
}

export class OverflowMenu extends ComponentWrapper {
  findDismissButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName(styles['overflow-menu-dismiss-button']);
  }

  findBackButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName(styles['overflow-menu-back-button']);
  }

  findTitle(): ElementWrapper | null {
    return this.findByClassName(styles['overflow-menu-header-text--title']);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles['overflow-menu-header-text--secondary']);
  }

  findUtility(index: number): ElementWrapper | null {
    return this.find(`[data-testid="__${index - 1}"]`);
  }

  findMenuDropdownItemById(id: string): ElementWrapper | null {
    return this.find(`[data-testid="${id}"]`);
  }
}

export class TopNavigationUtilityWrapper extends ComponentWrapper {
  findButtonLinkType(): LinkWrapper | null {
    return this.findComponent(`.${LinkWrapper.rootSelector}`, LinkWrapper);
  }

  findPrimaryButtonType(): ButtonWrapper | null {
    return this.findComponent(`.${ButtonWrapper.rootSelector}`, ButtonWrapper);
  }

  findMenuDropdownType(): TopNavigationMenuDropdownWrapper | null {
    return this.findComponent(`.${ButtonDropdownWrapper.rootSelector}`, TopNavigationMenuDropdownWrapper);
  }
}

export class TopNavigationMenuDropdownWrapper extends ButtonDropdownWrapper {
  findNativeButton(): ElementWrapper<HTMLButtonElement> {
    return this.find<HTMLButtonElement>(`.${menuDropdownStyles.button}`)!;
  }

  findTitle(): ElementWrapper | null {
    return this.findByClassName(buttonDropdownStyles.title);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(buttonDropdownStyles.description);
  }
}
