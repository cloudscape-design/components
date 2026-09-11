// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import InputWrapper from '../input';
import RadioGroupWrapper from '../radio-group';
import SelectWrapper from '../select';

import testutilStyles from '../../../date-range-picker/test-classes/styles.selectors.js';

export default class DateRangePickerPresetsWrapper extends ComponentWrapper {
  static rootSelector: string = testutilStyles.root;

  /**
   * Returns the radio group containing the preset options.
   */
  findRelativeRangeRadioGroup(): RadioGroupWrapper | null {
    return this.findComponent(`.${testutilStyles['relative-range-radio-group']}`, RadioGroupWrapper);
  }

  /**
   * Returns the custom-range duration input.
   */
  findCustomRelativeRangeDuration(): InputWrapper | null {
    return this.findComponent(`.${testutilStyles['custom-range-duration-input']}`, InputWrapper);
  }

  /**
   * Returns the custom-range unit select.
   */
  findCustomRelativeRangeUnit(): SelectWrapper | null {
    return this.findComponent(`.${testutilStyles['custom-range-unit-select']}`, SelectWrapper);
  }
}
