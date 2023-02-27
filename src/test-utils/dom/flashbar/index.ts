// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
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
}
