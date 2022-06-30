// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom, createWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../date-picker/styles.selectors.js';
import ButtonWrapper from '../button';
import BaseInputWrapper from '../input/base-input';
import DropdownWrapper from '../internal/dropdown';

export default class DatePickerWrapper extends BaseInputWrapper {
  static rootSelector: string = styles.root;

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findCalendar(options = { expandToViewport: false }): CalendarWrapper | null {
    const wrapper = options.expandToViewport ? createWrapper() : this;
    return wrapper.findComponent(`.${styles.calendar}`, CalendarWrapper);
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

export class CalendarWrapper extends ComponentWrapper {
  /**
   * Returns a day container on the calendar.
   *
   * @param row 1-based row index of the day.
   * @param column 1-based column index of the day.
   */
  findDateAt(row: number, column: number): ElementWrapper {
    return this.find(`.${styles['calendar-week']}:nth-child(${row}) .${styles['calendar-day']}:nth-child(${column})`)!;
  }

  findHeader(): ElementWrapper {
    return this.findByClassName(styles['calendar-header'])!;
  }

  findPreviousMonthButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-prev-month-btn']}`, ButtonWrapper)!;
  }

  findNextMonthButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-next-month-btn']}`, ButtonWrapper)!;
  }

  findSelectedDate(): ElementWrapper {
    return this.find(`.${styles['calendar-day-selected']}`)!;
  }
}
