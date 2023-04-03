// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import FormFieldWrapper from '../form-field';
import RadioGroupWrapper from '../radio-group';
import RadioButtonWrapper from '../radio-group/radio-button';
import styles from '../../../collection-preferences/styles.selectors.js';

export default class StickyColumnsPreferenceWrapper extends ComponentWrapper {
  static rootSelector = styles['sticky-columns'];

  findTitle(stickyColumnsPreferencesSide: 'start' | 'end'): ElementWrapper {
    return this.findComponent(
      `.${styles[`sticky-columns-${stickyColumnsPreferencesSide}-form-field`]}`,
      FormFieldWrapper
    )!.findLabel()!;
  }
  findDescription(stickyColumnsPreferencesSide: 'start' | 'end'): ElementWrapper {
    return this.findComponent(
      `.${styles[`sticky-columns-${stickyColumnsPreferencesSide}-form-field`]}`,
      FormFieldWrapper
    )!.findDescription()!;
  }
  findOptions(stickyColumnsPreferencesSide: 'start' | 'end'): Array<RadioButtonWrapper> {
    return this.findComponent(
      `.${styles[`sticky-columns-${stickyColumnsPreferencesSide}-radio-group`]}`,
      RadioGroupWrapper
    )!.findButtons();
  }
}
