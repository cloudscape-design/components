// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import FormFieldWrapper from '../form-field';
import RadioGroupWrapper from '../radio-group';
import RadioButtonWrapper from '../radio-group/radio-button';

import styles from '../../../collection-preferences/styles.selectors.js';

export default class PageSizePreferenceWrapper extends ComponentWrapper {
  static rootSelector = styles['page-size'];

  findTitle(): ElementWrapper {
    return this.findComponent(`.${styles['page-size-form-field']}`, FormFieldWrapper)!.findLabel()!;
  }
  findOptions(): Array<RadioButtonWrapper> {
    return this.findComponent(`.${styles['page-size-radio-group']}`, RadioGroupWrapper)!.findButtons();
  }
}
