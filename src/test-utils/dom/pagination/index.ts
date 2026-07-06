// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import InputWrapper from '../input';
import PopoverWrapper from '../popover';

import styles from '../../../pagination/styles.selectors.js';

export class PaginationButtonWrapper extends ComponentWrapper<HTMLButtonElement> {
  @usesDom
  isDisabled(): boolean {
    return this.element.disabled || this.element.getAttribute('aria-disabled') === 'true';
  }
}

export default class PaginationWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findCurrentPage(): PaginationButtonWrapper {
    return this.findComponent(`.${styles['button-current']}`, PaginationButtonWrapper)!;
  }

  findPageNumbers(): Array<PaginationButtonWrapper> {
    return this.findAllByClassName<HTMLButtonElement>(styles['page-number']).map(
      wrapper => new PaginationButtonWrapper(wrapper.getElement())
    );
  }

  /**
   * Returns a page number for a given index.
   *
   * @param index 1-based index of the page number to return.
   */
  findPageNumberByIndex(index: number): PaginationButtonWrapper | null {
    // we need to skip the "previous page" button
    const pageIndex = index + 1;
    return this.findComponent(`li:nth-child(${pageIndex}) .${styles.button}`, PaginationButtonWrapper);
  }

  findPreviousPageButton(): PaginationButtonWrapper {
    return this.findComponent(`li:first-child .${styles.button}`, PaginationButtonWrapper)!;
  }

  findNextPageButton(): PaginationButtonWrapper {
    return this.findComponent(`li:last-child .${styles.button}`, PaginationButtonWrapper)!;
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
  findJumpToPagePopover(): PopoverWrapper | null {
    return this.findComponent(`.${PopoverWrapper.rootSelector}`, PopoverWrapper);
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.classList.contains(styles['root-disabled']);
  }
}
