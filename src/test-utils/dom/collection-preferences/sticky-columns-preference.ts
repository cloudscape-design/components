// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import FormFieldWrapper from '../form-field';
import RadioGroupWrapper from '../radio-group';
import styles from '../../../collection-preferences/styles.selectors.js';

export default class StickyColumnsPreferenceWrapper extends ComponentWrapper {
  static firstRootSelector = styles['sticky-columns-first'];
  static lastRootSelector = styles['sticky-columns-last'];

  findTitle(): ElementWrapper {
    return this.findComponent(`.${styles[`sticky-columns-form-field`]}`, FormFieldWrapper)!.findLabel()!;
  }
  findDescription(): ElementWrapper {
    return this.findComponent(`.${styles[`sticky-columns-form-field`]}`, FormFieldWrapper)!.findDescription()!;
  }
  findRadioGroup(): RadioGroupWrapper {
    return this.findComponent(`.${styles[`sticky-columns-radio-group`]}`, RadioGroupWrapper)!;
  }
}
