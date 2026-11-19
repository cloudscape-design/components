// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import CalendarWrapper from '../calendar';
import BaseInputWrapper from '../input/base-input';
import DropdownWrapper from '../internal/dropdown';

import calendarStyles from '../../../calendar/styles.selectors.js';
import styles from '../../../date-picker/styles.selectors.js';

export default class DatePickerWrapper extends BaseInputWrapper {
  static rootSelector: string = styles.root;

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findCalendar(options = { expandToViewport: false }): CalendarWrapper | null {
    const wrapper = options.expandToViewport ? createWrapper() : this;
    return wrapper.findComponent(`.${calendarStyles.root}`, CalendarWrapper);
  }

  findCalendarDropdown(): ElementWrapper | null {
    const dropdown = new DropdownWrapper(this.getElement());
    return dropdown.findOpenDropdown();
  }

  findOpenCalendarButton(): ButtonWrapper {
    return this.findComponent(`.${styles['open-calendar-button']}`, ButtonWrapper)!;
  }

  /**
   * Sets the value of the component and calls the `onChange` handler.
   * The value needs to use the "YYYY/MM/DD" format,
   * but the subsequent `onChange` handler will contain the value in the "YYYY-MM-DD" format.
   *
   * @param value The value the input is set to, using the "YYYY/MM/DD" format.
   */
  @usesDom setInputValue(value: string): void {
    return super.setInputValue(value);
  }
}
