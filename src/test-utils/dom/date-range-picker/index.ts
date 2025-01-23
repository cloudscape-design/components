// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import ButtonWrapper from '../button';
import InputWrapper from '../input';
import RadioGroupWrapper from '../radio-group';
import SegmentedControlWrapper from '../segmented-control';
import SelectWrapper from '../select';

import testutilStyles from '../../../date-range-picker/test-classes/styles.selectors.js';

export class CalendarDateWrapper extends ComponentWrapper {
  findDisabledReason(): ElementWrapper | null {
    return createWrapper().find(`.${testutilStyles['disabled-reason-tooltip']}`);
  }
}

export default class DateRangePickerWrapper extends ComponentWrapper {
  static rootSelector: string = testutilStyles.root;

  /**
   * Alias for `findTrigger`
   * @deprecated
   */
  findLabel(): ElementWrapper {
    return this.findTrigger();
  }
  /**
   * Returns the trigger element that can be used to open the picker dropdown.
   */
  findTrigger(): ElementWrapper {
    return this.findByClassName(testutilStyles.label)!;
  }
  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findDropdown(options = { expandToViewport: false }): DrpDropdownWrapper | null {
    const wrapper = options.expandToViewport ? createWrapper() : this;
    return wrapper.findComponent(`.${testutilStyles.dropdown}`, DrpDropdownWrapper);
  }

  @usesDom
  openDropdown(): void {
    act(() => {
      this.findTrigger().click();
    });
  }
}

export class SelectionModeSwitchWrapper extends ElementWrapper {
  /**
   * Returns the mode selector as a SegmentedControl wrapper.
   *
   * The mode selector is only rendered as a SegmentedControl on wide viewports. On narrow viewports, use `findModesAsSelect()` instead.
   */
  findModesAsSegments(): SegmentedControlWrapper {
    return new SegmentedControlWrapper(this.getElement());
  }

  /**
   * Returns the mode selector as a Select wrapper.
   * The mode selector is only rendered as a Select on narrow viewports. On wide viewports, use `findModesAsSegments()` instead.
   */
  findModesAsSelect(): SelectWrapper {
    return new SelectWrapper(this.getElement());
  }
}

export class DrpDropdownWrapper extends ComponentWrapper {
  findSelectionModeSwitch(): SelectionModeSwitchWrapper {
    return this.findComponent(`.${testutilStyles['mode-switch']}`, SelectionModeSwitchWrapper)!;
  }

  findValidationError(): ElementWrapper<HTMLSpanElement> | null {
    return this.findByClassName(testutilStyles['validation-error']);
  }

  // -- Relative mode --

  findRelativeRangeRadioGroup(): RadioGroupWrapper | null {
    return this.findComponent(`.${testutilStyles['relative-range-radio-group']}`, RadioGroupWrapper);
  }

  findCustomRelativeRangeDuration(): InputWrapper | null {
    return this.findComponent(`.${testutilStyles['custom-range-duration-input']}`, InputWrapper);
  }

  findCustomRelativeRangeUnit(): SelectWrapper | null {
    return this.findComponent(`.${testutilStyles['custom-range-unit-select']}`, SelectWrapper);
  }

  // -- Absolute mode --

  findHeader(): ElementWrapper {
    return this.findByClassName(testutilStyles['calendar-header'])!;
  }

  findPreviousButton(): ButtonWrapper {
    return this.findComponent(`.${testutilStyles['calendar-prev-page-btn']}`, ButtonWrapper)!;
  }

  findNextButton(): ButtonWrapper {
    return this.findComponent(`.${testutilStyles['calendar-next-page-btn']}`, ButtonWrapper)!;
  }

  /**
   * Alias for findPreviousButton for compatibility with previous versions.
   * @deprecated
   */
  findPreviousMonthButton(): ButtonWrapper {
    return this.findComponent(`.${testutilStyles['calendar-prev-month-btn']}`, ButtonWrapper)!;
  }

  /**
   * Alias for findNextButton for compatibility with previous versions.
   * @deprecated
   */
  findNextMonthButton(): ButtonWrapper {
    return this.findComponent(`.${testutilStyles['calendar-next-month-btn']}`, ButtonWrapper)!;
  }

  /**
   * Returns the day container that corresponds to the current day.
   */
  findCurrentDay(): CalendarDateWrapper {
    return this.findComponent(`.${testutilStyles.today}`, CalendarDateWrapper)!;
  }
  /**
   * Returns the month container that corresponds to the current month.
   */
  findCurrentMonth(): CalendarDateWrapper {
    return this.findComponent(`.${testutilStyles['this-month']}`, CalendarDateWrapper)!;
  }

  /**
   * Returns a day container on the calendar.
   *
   * @param grid the calendar grid. If only one calendar grid is visible (on small screens), use `'right'`.
   * @param row 1-based row index of the day.
   * @param column 1-based column index of the day.
   */
  findDateAt(
    grid: 'left' | 'right',
    row: 1 | 2 | 3 | 4 | 5 | 6,
    column: 1 | 2 | 3 | 4 | 5 | 6 | 7
  ): CalendarDateWrapper {
    const gridClassName = grid === 'right' ? testutilStyles['second-grid'] : testutilStyles['first-grid'];
    return this.findComponent(
      `.${gridClassName} .${testStyles['calendar-week']}[data-awsui-weekindex="${row}"] .${testStyles['calendar-date']}:nth-child(${column})`,
      // `.${gridClassName} .${testutilStyles.week}:nth-child(${row}) .${testutilStyles.day}:nth-child(${column})`,
      CalendarDateWrapper
    )!;
  }

  /**
   * Returns a month container on the calendar.
   *
   * @param grid the calendar grid. If only one calendar grid is visible (on small screens), use `'right'`.
   * @param row 1-based row index of the month.
   * @param column 1-based column index of the month.
   */
  findMonthAt(grid: 'left' | 'right', row: 1 | 2 | 3 | 4, column: 1 | 2 | 3): CalendarDateWrapper {
    const gridClassName = grid === 'right' ? testutilStyles['second-grid'] : testutilStyles['first-grid'];
    return this.findComponent(
      `.${gridClassName} .${testutilStyles.quarter}:nth-child(${row}) .${testutilStyles.month}:nth-child(${column})`,
      CalendarDateWrapper
    )!;
  }

  findSelectedStartDate(): ElementWrapper | null {
    return this.findByClassName(testutilStyles['start-date']);
  }

  findSelectedEndDate(): ElementWrapper | null {
    return this.findByClassName(testutilStyles['end-date']);
  }

  findStartDateInput(): InputWrapper | null {
    return this.findComponent(`.${testutilStyles['start-date-input']}`, InputWrapper);
  }

  findStartTimeInput(): InputWrapper | null {
    return this.findComponent(`.${testutilStyles['start-time-input']}`, InputWrapper);
  }

  findEndDateInput(): InputWrapper | null {
    return this.findComponent(`.${testutilStyles['end-date-input']}`, InputWrapper);
  }

  findEndTimeInput(): InputWrapper | null {
    return this.findComponent(`.${testutilStyles['end-time-input']}`, InputWrapper);
  }

  // -- Footer --

  findClearButton(): ButtonWrapper | null {
    return this.findComponent(`.${testutilStyles['clear-button']}`, ButtonWrapper);
  }

  findCancelButton(): ButtonWrapper {
    return this.findComponent(`.${testutilStyles['cancel-button']}`, ButtonWrapper)!;
  }

  findApplyButton(): ButtonWrapper {
    return this.findComponent(`.${testutilStyles['apply-button']}`, ButtonWrapper)!;
  }
}
