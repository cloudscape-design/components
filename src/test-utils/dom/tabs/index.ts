// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
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
   * Finds the tab with the given ID and returns the clickable element from its tab label.
   *
   * @param index ID of the clickable element to return
   */
  findTabLinkById(id: string): ElementWrapper<HTMLAnchorElement | HTMLButtonElement> | null {
    return this.find(`.${styles['tabs-tab-link']}[data-testid="${id}"]`);
  }

  /**
   * Finds the currently active tab and returns the clickable element from its tab label.
   */
  findActiveTab(): ElementWrapper<HTMLAnchorElement | HTMLButtonElement> | null {
    return this.find(`.${styles['tabs-tab-active']}`);
  }

  /**
   * Finds the currently displayed tab content and returns it.
   */
  findTabContent(): ElementWrapper<HTMLDivElement> | null {
    return this.find(`.${styles['tabs-content-active']}`);
  }
}
