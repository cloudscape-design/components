// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import FormFieldWrapper from '../form-field';
import RadioGroupWrapper from '../radio-group';
import RadioButtonWrapper from '../radio-group/radio-button';
import styles from '../../../collection-preferences/styles.selectors.js';

export default class StickyColumnsPreferenceWrapper extends ComponentWrapper {
  static rootSelector = styles['sticky-columns'];

  findTitle(stickyColumnsPreferencesSide: 'first' | 'last'): ElementWrapper {
    return this.findComponent(
      `.${styles[`sticky-columns-${stickyColumnsPreferencesSide}`]}`,
      FormFieldWrapper
    )!.findLabel()!;
  }
  findDescription(stickyColumnsPreferencesSide: 'first' | 'last'): ElementWrapper {
    return this.findComponent(
      `.${styles[`sticky-columns-${stickyColumnsPreferencesSide}`]}`,
      FormFieldWrapper
    )!.findDescription()!;
  }
  findRadioGroup(stickyColumnsPreferencesSide: 'first' | 'last'): RadioGroupWrapper {
    return this.find(`.${styles[`sticky-columns-${stickyColumnsPreferencesSide}`]}`)!.findRadioGroup()!;
  }
  findOptions(stickyColumnsPreferencesSide: 'first' | 'last'): Array<RadioButtonWrapper> {
    return this.find(`.${styles[`sticky-columns-${stickyColumnsPreferencesSide}`]}`)!
      .findRadioGroup()!
      .findButtons();
  }
}
