// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import InputWrapper from '../input';
import DropdownWrapper from './dropdown.js';

import dropdownStyles from '../../../dropdown/styles.selectors.js';
import inputStyles from '../../../input/styles.selectors.js';
import styles from '../../../internal/components/autosuggest-input/styles.selectors.js';

export default class AutosuggestInputWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findInput(): InputWrapper {
    return this.findComponent(`.${inputStyles['input-container']}`, InputWrapper)!;
  }

  findDropdown(): DropdownWrapper {
    return this.findComponent(`.${dropdownStyles.root}`, DropdownWrapper)!;
  }

  // ---------------------------------------------------------------------------
  // mode="tokens" helpers
  // ---------------------------------------------------------------------------

  /** Returns the token-trigger bordered row, or null when not in tokens mode. */
  findTokenTrigger(): ElementWrapper | null {
    return this.findByClassName(styles['token-trigger']);
  }

  /** Returns all visible inline token wrappers (excludes overflow-hidden tokens). */
  findTokens(): Array<ElementWrapper> {
    const tokenList = this.findByClassName(styles['token-list']);
    if (!tokenList) {
      return [];
    }
    return tokenList.findAll('span[role]');
  }

  /**
   * Returns a single visible token by 1-based index.
   * @param index 1-based position in the visible token list (1-based).
   */
  findToken(index: number): ElementWrapper | null {
    return this.find(`.${styles['token-list']} > span:nth-child(${index}) span[role]`);
  }

  /** Returns the overflow pill button (+N), or null if all tokens fit. */
  findOverflowPill(): ElementWrapper | null {
    // Exclude the off-screen measurement pill (aria-hidden="true", data-measure-pill)
    return this.find(`.${styles['token-overflow-pill']}:not([aria-hidden])`);
  }
}
