// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import InputWrapper from '../input';
import PopoverWrapper from '../popover';

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

  /**
   * Returns the jump to page input field.
   */
  findJumpToPageInput(): InputWrapper | null {
    return this.findComponent(`.${styles['jump-to-page-input']}`, InputWrapper);
  }

  /**
   * Returns the jump to page submit button.
   */
  findJumpToPageButton(): ButtonWrapper | null {
    const jumpToPageContainer = this.findByClassName(styles['jump-to-page']);
    return jumpToPageContainer ? jumpToPageContainer.findComponent('button', ButtonWrapper) : null;
  }

  /**
   * Returns the error popover for jump to page.
   */
  findPopover(): PopoverWrapper | null {
    return this.findComponent(`.${PopoverWrapper.rootSelector}`, PopoverWrapper);
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.classList.contains(styles['root-disabled']);
  }
}
