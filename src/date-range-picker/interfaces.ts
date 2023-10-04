// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';
import { TimeInputProps } from '../time-input/interfaces';
import { ExpandToViewport } from '../internal/components/dropdown/interfaces';
import React from 'react';

export interface DateRangePickerBaseProps {
  /**
   * The current date range value. Can be either an absolute time range
   * or a relative time range.
   */
  value: null | DateRangePickerProps.Value;

  /**
   * A list of relative time ranges that are shown as suggestions.
   */
  relativeOptions: ReadonlyArray<DateRangePickerProps.RelativeOption>;

  /**
   * A function that defines whether a particular date should be enabled
   * in the calendar or not. Note that disabling a date in the calendar
   * still allows users to enter this date via keyboard. We therefore
   * recommend that you also validate these constraints client- and
   * server-side, in the same way as for other form elements.
   */
  isDateEnabled?: DateRangePickerProps.IsDateEnabledFunction;

  /**
   * The locale to be used for rendering month names and defining the
   * starting date of the week. If not provided, it will be determined
   * from the page and browser locales. Supported values and formats
   * are as-per the [JavaScript Intl API specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation).
   */
  locale?: string;

  /**
   * Starting day of the week. [0-6] maps to [Sunday-Saturday].
   * By default the starting day of the week is defined by the locale,
   * but you can override it using this property.
   */
  startOfWeek?: number;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: DateRangePickerProps.I18nStrings;

  /**
   * Hides time inputs and changes the input format to date-only, e.g. 2021-04-06.
   *
   * Do not use `dateOnly` flag conditionally. The component does not trigger the value update
   * when the flag changes which means the value format can become inconsistent.
   *
   * Default: `false`.
   */
  dateOnly?: boolean;

  /**
   * Determines the range selector mode as follows:
   * * `default` for combined absolute/relative range selector.
   * * `absolute-only` for absolute-only range selector.
   * * `relative-only` for relative-only range selector.
   *
   * By default, the range selector mode is `default`.
   */
  rangeSelectorMode?: DateRangePickerProps.RangeSelectorMode;

  /**
   * Specifies the format of the time input for absolute ranges.
   *
   * Use to restrict the granularity of time that the user can enter.
   *
   * Has no effect when `dateOnly` is true.
   */
  timeInputFormat?: TimeInputProps.Format;

  /**
   * Fired whenever a user changes the component's value.
   * The event `detail` contains the current value of the field.
   */
  onChange?: NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>;

  /**
   * The time offset from UTC in minutes that should be used to
   * display and produce values.
   *
   * Has no effect when `dateOnly` is true.
   *
   * Default: the user's current time offset as provided by the browser.
   *
   * @deprecated Use `getTimeOffset` instead.
   */
  timeOffset?: number;

  /**
   * A function that defines timezone offset from UTC in minutes for selected dates.
   * Use it to define time relative to the desired timezone.
   *
   * The function is called for the start date and the end date and takes a UTC date
   * corresponding the selected value as an argument.
   *
   * Has no effect when `dateOnly` is true.
   *
   * Default: the user's current time offset as provided by the browser.
   */
  getTimeOffset?: DateRangePickerProps.GetTimeOffsetFunction;
}
export interface DateRangePickerProps
  extends BaseComponentProps,
    FormFieldValidationControlProps,
    ExpandToViewport,
    DateRangePickerBaseProps {
  /**
   * Specifies the placeholder text that is rendered when the value is empty.
   */
  placeholder?: string;

  /**
   * Specifies that the component is disabled, preventing the user from
   * modifying the value. A disabled component cannot receive focus.
   */
  disabled?: boolean;

  /**
   * Specifies that the component is read-only, preventing the user from
   * modifying the value. A read-only component can receive focus.
   */
  readOnly?: boolean;

  /**
   * Fired when keyboard focus is set onto the UI control.
   */
  onFocus?: NonCancelableEventHandler<null>;

  /**
   * Fired when keyboard focus is removed from the UI control.
   */
  onBlur?: NonCancelableEventHandler<null>;

  /**
   * A function that defines whether a particular range is valid or not.
   *
   * Ensure that your function checks for missing fields in the value.
   */
  isValidRange: DateRangePickerProps.ValidationFunction;

  /**
   * Specifies whether the component should show a button that
   * allows the user to clear the selected value.
   */
  showClearButton?: boolean;

  /**
   * Specifies an additional control displayed in the dropdown, located below the range calendar.
   */
  customAbsoluteRangeControl?: DateRangePickerProps.AbsoluteRangeControl;
}

export namespace DateRangePickerProps {
  export type Value = AbsoluteValue | RelativeValue;
  export interface AbsoluteValue {
    /**
     * In ISO8601 format, e.g.: 2021-04-06T17:23:50+02:00 (or 2021-04-06 when `dateOnly` is true)
     */
    startDate: string;
    /**
     * In ISO8601 format, e.g.: 2021-04-06T17:23:50+02:00 (or 2021-04-06 when `dateOnly` is true)
     */
    endDate: string;
    type: 'absolute';
  }

  export interface RelativeValue {
    /**
     * If provided, used to match this value
     * to a provided relative option.
     */
    key?: string;
    amount: number;
    unit: TimeUnit;
    type: 'relative';
  }
  export interface RelativeOption {
    /**
     * Used to uniquely identify this relative option.
     */
    key: string;
    amount: number;
    unit: TimeUnit;
    type: 'relative';
  }

  export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

  export type ValidationFunction = (value: Value | null) => ValidationResult;

  export type ValidationResult = ValidRangeResult | InvalidRangeResult;

  export interface ValidRangeResult {
    valid: true;
  }

  export interface InvalidRangeResult {
    valid: false;
    errorMessage: string;
  }

  export interface ChangeDetail {
    /**
     * The newly selected range of this date range picker.
     */
    value: null | Value;
  }

  export interface IsDateEnabledFunction {
    (date: Date): boolean;
  }

  export interface GetTimeOffsetFunction {
    (date: Date): number;
  }

  export interface DateTimeStrings {
    date: string;
    time: string;
  }

  export interface PendingAbsoluteValue {
    start: DateTimeStrings;
    end: DateTimeStrings;
  }

  export type AbsoluteRangeControl = (
    selectedRange: PendingAbsoluteValue,
    setSelectedRange: React.Dispatch<React.SetStateAction<PendingAbsoluteValue>>
  ) => React.ReactNode;

  export type RangeSelectorMode = 'default' | 'absolute-only' | 'relative-only';

  export interface Ref {
    /**
     * Sets the browser focus on the UI control
     */
    focus(): void;
  }

  export interface I18nStrings {
    /**
     * Adds `aria-label` to the trigger and dropdown.
     */
    ariaLabel?: string;

    /**
     * Adds `aria-labelledby` to the trigger and dropdown.
     */
    ariaLabelledby?: string;

    /**
     * Adds `aria-describedby` to the trigger and dropdown.
     */
    ariaDescribedby?: string;

    /**
     * Adds an `aria-label` to the mode selection group.
     */
    modeSelectionAriaLabel?: string;

    /**
     * Segment title of the relative range selection mode
     */
    relativeModeTitle?: string;

    /**
     * Segment title of the absolute range selection mode
     */
    absoluteModeTitle?: string;

    /**
     * Heading for the relative range selection area
     */
    relativeRangeSelectionHeading?: string;

    /**
     * Visible label of the Cancel button
     */
    cancelButtonLabel?: string;
    /**
     * Visible label of the Clear and dismiss button
     */
    clearButtonLabel?: string;
    /**
     * Visible label of the Apply button
     */
    applyButtonLabel?: string;

    /**
     * Formatting function for relative ranges.
     * This function must convert a relative range to a human-readable string.
     */
    formatRelativeRange?: (value: RelativeValue) => string;

    /**
     * Formatting function for time units.
     *
     * This function must return a localized form of the unit that fits the provided time value.
     */
    formatUnit?: (unit: TimeUnit, value: number) => string;

    /**
     * Visible label for the option for selecting
     * a custom relative range.
     */
    customRelativeRangeOptionLabel?: string;

    /**
     * Visible description for the option for selecting
     * a custom relative range.
     */
    customRelativeRangeOptionDescription?: string;

    /**
     * Visible label for the duration selector for
     * the custom relative range.
     */
    customRelativeRangeDurationLabel?: string;
    /**
     * Placeholder for the duration selector for
     * the custom relative range.
     */
    customRelativeRangeDurationPlaceholder?: string;
    /**
     * Visible label for the unit selector for the
     * custom relative range.
     */
    customRelativeRangeUnitLabel?: string;

    /**
     * Used as part of the aria label for today's date in the calendar.
     */
    todayAriaLabel?: string;

    /**
     * An aria label for the 'next month' button.
     */
    nextMonthAriaLabel?: string;

    /**
     * An aria label for the 'previous month' button.
     */
    previousMonthAriaLabel?: string;

    /**
     * Visible label for the Start Date input for the
     * absolute range.
     */
    startDateLabel?: string;
    /**
     * Visible label for the Start Time input for the
     * absolute range.
     */
    startTimeLabel?: string;
    /**
     * Visible label for the End Date input for the
     * absolute range.
     */
    endDateLabel?: string;
    /**
     * Visible label for the End Time input for the
     * absolute range.
     */
    endTimeLabel?: string;

    /**
     * Constraint text for the input fields for the
     * absolute range.
     */
    dateTimeConstraintText?: string;

    /**
     * Provides a text alternative for the error icon in the error alert.
     */
    errorIconAriaLabel?: string;

    /**
     * When the property is set, screen readers announce the selected range when the absolute range gets selected.
     */
    renderSelectedAbsoluteRangeAriaLive?: (startDate: string, endDate: string) => string;
  }
}

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RangeCalendarI18nStrings = Pick<
  DateRangePickerProps.I18nStrings,
  | 'todayAriaLabel'
  | 'nextMonthAriaLabel'
  | 'previousMonthAriaLabel'
  | 'startDateLabel'
  | 'startTimeLabel'
  | 'endDateLabel'
  | 'endTimeLabel'
  | 'dateTimeConstraintText'
  | 'renderSelectedAbsoluteRangeAriaLive'
>;

export interface Focusable {
  focus(): void;
}
