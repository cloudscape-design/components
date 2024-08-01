// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import ButtonWrapper from '../button';
import InputWrapper from '../input';
import RadioGroupWrapper from '../radio-group';
import SegmentedControlWrapper from '../segmented-control';
import SelectWrapper from '../select';

import gridStyles from '../../../date-range-picker/calendar/grids/styles.selectors.js';
import relativeRangeStyles from '../../../date-range-picker/relative-range/styles.selectors.js';
import styles from '../../../date-range-picker/styles.selectors.js';

export class CalendarDateWrapper extends ComponentWrapper {
  findDisabledReason(): ElementWrapper | null {
    return createWrapper().find(`.${gridStyles['disabled-reason-tooltip']}`);
  }
}

export default class DateRangePickerWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

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
    return this.findByClassName(styles.label)!;
  }
  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findDropdown(options = { expandToViewport: false }): DrpDropdownWrapper | null {
    const wrapper = options.expandToViewport ? createWrapper() : this;
    return wrapper.findComponent(`.${styles.dropdown}`, DrpDropdownWrapper);
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
    return this.findComponent(`.${styles['mode-switch']}`, SelectionModeSwitchWrapper)!;
  }

  findValidationError(): ElementWrapper<HTMLSpanElement> | null {
    return this.findByClassName(styles['validation-error']);
  }

  // -- Relative mode --

  findRelativeRangeRadioGroup(): RadioGroupWrapper | null {
    return this.findComponent(`.${relativeRangeStyles['relative-range-radio-group']}`, RadioGroupWrapper);
  }

  findCustomRelativeRangeDuration(): InputWrapper | null {
    return this.findComponent(`.${relativeRangeStyles['custom-range-duration-input']}`, InputWrapper);
  }

  findCustomRelativeRangeUnit(): SelectWrapper | null {
    return this.findComponent(`.${relativeRangeStyles['custom-range-unit-select']}`, SelectWrapper);
  }

  // -- Absolute mode --

  findHeader(): ElementWrapper {
    return this.findByClassName(styles['calendar-header'])!;
  }

  findPreviousMonthButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-prev-month-btn']}`, ButtonWrapper)!;
  }

  findNextMonthButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-next-month-btn']}`, ButtonWrapper)!;
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
    const gridClassName = grid === 'right' ? styles['second-grid'] : styles['first-grid'];
    return this.findComponent(
      `.${gridClassName} .${gridStyles.week}:nth-child(${row}) .${gridStyles.day}:nth-child(${column})`,
      CalendarDateWrapper
    )!;
  }

  findSelectedStartDate(): ElementWrapper | null {
    return this.findByClassName(gridStyles['start-date']);
  }

  findSelectedEndDate(): ElementWrapper | null {
    return this.findByClassName(gridStyles['end-date']);
  }

  findStartDateInput(): InputWrapper | null {
    return this.findComponent(`.${styles['start-date-input']}`, InputWrapper);
  }

  findStartTimeInput(): InputWrapper | null {
    return this.findComponent(`.${styles['start-time-input']}`, InputWrapper);
  }

  findEndDateInput(): InputWrapper | null {
    return this.findComponent(`.${styles['end-date-input']}`, InputWrapper);
  }

  findEndTimeInput(): InputWrapper | null {
    return this.findComponent(`.${styles['end-time-input']}`, InputWrapper);
  }

  // -- Footer --

  findClearButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['clear-button']}`, ButtonWrapper);
  }

  findCancelButton(): ButtonWrapper {
    return this.findComponent(`.${styles['cancel-button']}`, ButtonWrapper)!;
  }

  findApplyButton(): ButtonWrapper {
    return this.findComponent(`.${styles['apply-button']}`, ButtonWrapper)!;
  }
}
