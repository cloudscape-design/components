// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import ButtonWrapper from '../button';
import styles from '../../../tabs/styles.selectors.js';

export default class TabsWrapper extends ComponentWrapper<HTMLButtonElement> {
  static rootSelector: string = styles.root;

  /**
   * Finds all tab headers and returns the clickable elements from their labels.
   */
  findTabLinks(): Array<ElementWrapper<HTMLAnchorElement | HTMLButtonElement>> {
    return this.findAllByClassName(styles['tabs-tab-link']);
  }

  /**
   * Finds the tab at the given position (1-based) and returns the clickable element from its tab label.
   *
   * @param index 1-based index of the clickable element to return
   */
  findTabLinkByIndex(index: number): ElementWrapper<HTMLAnchorElement | HTMLButtonElement> | null {
    return this.find(`.${styles['tabs-tab']}:nth-child(${index}) .${styles['tabs-tab-link']}`);
  }

  /**
   * Finds the tab header container at the given position (1-based) and returns the element.
   *
   * @param index 1-based index of the clickable element to return
   */
  findTabHeaderContentByIndex(index: number): ElementWrapper<HTMLAnchorElement | HTMLButtonElement> | null {
    return this.find(`.${styles['tabs-tab']}:nth-child(${index}) .${styles['tabs-tab-header-container']}`);
  }

  /**
   * Finds the tab with the given ID and returns the clickable element from its tab label.
   *
   * @param id ID of the clickable element to return
   */
  findTabLinkById(id: string): ElementWrapper<HTMLAnchorElement | HTMLButtonElement> | null {
    return this.find(`.${styles['tabs-tab-link']}[data-testid="${id}"]`);
  }

  /**
   * Finds the dimissible button by using the tab index
   *
   * @param index 1-based index of the clickable element to return
   */
  findDimissibleButtonByTabIndex(index: number): ButtonWrapper | null {
    return this.findComponent(
      `.${styles['tabs-tab']}:nth-child(${index}) .${styles['tabs-tab-dismiss']}`,
      ButtonWrapper
    );
  }

  /**
   * Finds the dimissible button by using the tab id
   *
   * @param id ID of the clickable element to return
   */
  findDimissibleButtonByTabId(id: string): ButtonWrapper | null {
    return this.findComponent(
      `.${styles['tabs-tab-link']}[data-testid="${id}"] ~ .${styles['tabs-tab-dismiss']}`,
      ButtonWrapper
    );
  }

  /**
   * Finds the tab action by using the tab id
   * @param id ID of the clickable element to return
   */
  findActionByTabId(id: string): ElementWrapper | null {
    return this.find(`.${styles['tabs-tab-link']}[data-testid="${id}"] ~ .${styles['tabs-tab-action']}`);
  }

  /**
   * Finds the tab action by using the tab index
   * @param index 1-based index of the clickable element to return
   */
  findActionByTabIndex(index: number): ElementWrapper | null {
    return this.find(`.${styles['tabs-tab']}:nth-child(${index}) .${styles['tabs-tab-action']}`);
  }

  /**
   * Finds the currently active tab and returns the clickable element from its tab label.
   */
  findActiveTab(): ElementWrapper<HTMLAnchorElement | HTMLButtonElement> | null {
    return this.find(`.${styles['tabs-tab-active']} .${styles['tabs-tab-link']}`);
  }

  /**
   * Finds the currently displayed tab content and returns it.
   */
  findTabContent(): ElementWrapper<HTMLDivElement> | null {
    return this.find(`.${styles['tabs-content-active']}`);
  }

  /**
   * Finds the dismissible button for the active tab
   */
  findActiveTabDimissibleButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['tabs-tab-active']} .${styles['tabs-tab-dismiss']}`, ButtonWrapper);
  }

  /**
   * Finds the tab action for the active tab
   */
  findActiveTabAction(): ElementWrapper | null {
    return this.find(`.${styles['tabs-tab-active']} .${styles['tabs-tab-action']}`);
  }
}
