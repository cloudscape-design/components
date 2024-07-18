// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import { InputWrapper } from '../index.js';
import DropdownWrapper from './dropdown.js';

import inputStyles from '../../../input/styles.selectors.js';
import styles from '../../../internal/components/autosuggest-input/styles.selectors.js';
import dropdownStyles from '../../../internal/components/dropdown/styles.selectors.js';

export default class AutosuggestInputWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findInput(): InputWrapper {
    return this.findComponent(`.${inputStyles['input-container']}`, InputWrapper)!;
  }

  findDropdown(): DropdownWrapper {
    return this.findComponent(`.${dropdownStyles.root}`, DropdownWrapper)!;
  }
}
