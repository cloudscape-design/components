// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../pagination/styles.selectors.js';

export default class PaginationWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findCurrentPage(): ElementWrapper {
    return this.findByClassName(styles['button-current'])!;
  }

  findPageNumbers(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['page-number']);
  }

  /**
   * Returns a page number for a given index.
   *
   * @param index 1-based index of the page number to return.
   */
  findPageNumberByIndex(index: number): ElementWrapper | null {
    // we need to skip the "previous page" button
    const pageIndex = index + 1;
    return this.find(`li:nth-child(${pageIndex}) .${styles.button}`);
  }

  findPreviousPageButton(): ElementWrapper {
    return this.find(`li:first-child .${styles.button}`)!;
  }

  findNextPageButton(): ElementWrapper {
    return this.find(`li:last-child .${styles.button}`)!;
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.classList.contains(styles['root-disabled']);
  }
}
