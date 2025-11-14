// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { escapeSelector } from '@cloudscape-design/test-utils-core/utils';

import RadioButtonWrapper from './radio-button';

import radioButtonStyles from '../../../internal/components/radio-button/test-classes/styles.selectors.js';
import styles from '../../../radio-group/test-classes/styles.selectors.js';

export default class RadioGroupWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findButtons(): Array<RadioButtonWrapper> {
    return this.findAllByClassName(radioButtonStyles.root).map(r => new RadioButtonWrapper(r.getElement()));
  }

  findInputByValue(value: string): ElementWrapper<HTMLInputElement> | null {
    const safeValue = escapeSelector(value);
    return this.find(`input[value="${safeValue}"]`);
  }
}
