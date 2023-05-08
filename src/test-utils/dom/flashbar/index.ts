// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../flashbar/styles.selectors.js';
import FlashWrapper from './flash';

export default class FlashbarWrapper extends ComponentWrapper {
  static rootSelector: string = styles.flashbar;

  /**
   * Returns the individual flashes of this flashbar.
   *
   * If the items are stacked, only the item at the top of the stack is returned.
   */
  findItems(): Array<FlashWrapper> {
    return this.findAllByClassName(styles['flash-list-item']).map(item => new FlashWrapper(item.getElement()));
  }

  /**
   * Returns the individual flashes of this flashbar given the item type.
   *
   * If the items are stacked, only the item at the top of the stack is returned.
   *
   * If an item is loading its type is considered as "info".
   */
  findItemsByType(type: 'success' | 'warning' | 'info' | 'error'): Array<FlashWrapper> {
    return this.findAll(`.${styles['flash-list-item']} .${styles[`flash-type-${type}`]}`).map(
      item => new FlashWrapper(item.getElement())
    );
  }

  /**
   * Returns the toggle button that expands and collapses stacked notifications.
   */
  findToggleButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName(styles['notification-bar'])?.find('button') ?? null;
  }
}
