// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import InputWrapper from '../input';
import DropdownWrapper from './dropdown.js';

import dropdownStyles from '../../../dropdown/styles.selectors.js';
import inputStyles from '../../../input/styles.selectors.js';
import testUtilStyles from '../../../internal/components/autosuggest-input/test-classes/styles.selectors.js';

export default class AutosuggestInputWrapper extends ComponentWrapper {
  static rootSelector = testUtilStyles.root;

  findInput(): InputWrapper {
    return this.findComponent(`.${inputStyles['input-container']}`, InputWrapper)!;
  }

  findDropdown(): DropdownWrapper {
    return this.findComponent(`.${dropdownStyles.root}`, DropdownWrapper)!;
  }

  findTokenTrigger(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles['token-trigger']);
  }

  findInlineTokens(): Array<ElementWrapper> {
    const tokenList = this.findByClassName(testUtilStyles['token-list']);
    if (!tokenList) {
      return [];
    }
    return tokenList.findAll('span[role]');
  }

  findInlineToken(index: number): ElementWrapper | null {
    return this.find(`.${testUtilStyles['token-list']} > li[data-token-index="${index}"] span[role]`);
  }

  findOverflowPill(): ElementWrapper | null {
    return this.find(
      `.${testUtilStyles['token-list']} .${testUtilStyles['token-overflow-pill']}:not([data-measure-pill])`
    );
  }

  findOverflowPanel(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles['overflow-panel']);
  }
}
