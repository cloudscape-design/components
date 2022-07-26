// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { ExpandToViewport } from '../internal/components/dropdown/interfaces';
import { NonCancelableEventHandler } from '../internal/events';

export interface DatePickerProps extends BaseComponentProps, FormFieldValidationControlProps, ExpandToViewport {
  /**
   * The current input value, in YYYY-MM-DD format.
   */
  value: string;

  /**
   * Specifies the placeholder text rendered when the value is an empty string.
   */
  placeholder?: string;

  /**
   * Defines whether a particular date is enabled in the calendar or not.
   * If you disable a date in the calendar, users can still enter this date using a keyboard.
   * We recommend that you also validate these constraints on the client-side and server-side
   * as you would for other form elements.
   * @param date
   */
  isDateEnabled?: DatePickerProps.IsDateEnabledFunction;

  /**
   * Specifies the locale to use to render month names and determine the starting day of the week.
   * If you don't provide this, the locale is determined by the page and browser locales.
   * Supported values and formats are listed in the
   * [JavaScript Intl API specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation).
   */
  locale?: string;

  /**
   * Determines the starting day of the week. The values 0-6 map to Sunday-Saturday.
   * By default the starting day of the week is defined by the locale, but you can use this property to override it.
   */
  startOfWeek?: number;

  /**
   * Used as part of the `aria-label` for today's date in the calendar.
   */
  todayAriaLabel: string;

  /**
   * Specifies an `aria-label` for the 'next month' button.
   */
  nextMonthAriaLabel: string;

  /**
   * Specifies an `aria-label` for the 'previous month' button.
   */
  previousMonthAriaLabel: string;

  /**
   * Specifies a function that generates the `aria-label` for the 'open calendar' button. The `selectedDate` parameter is
   * a human-readable localised string representing the current value of the input.
   * (for example, ``selectedDate => 'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')``)
   */
  openCalendarAriaLabel?: DatePickerProps.OpenCalendarAriaLabel;

  /**
   * Specifies the name of the control used in HTML forms.
   */
  name?: string;

  /**
   * Specifies if the control is disabled, which prevents the
   * user from modifying the value and prevents the value from
   * being included in a form submission. A disabled control can't
   * receive focus.
   */
  disabled?: boolean;

  /**
   * Specifies if the control is read only, which prevents the
   * user from modifying the value but includes it in a form
   * submission. A read-only control can receive focus.
   *
   * Do not use read-only inputs outside of a form.
   */
  readOnly?: boolean;

  /**
   * Indicates whether the control should be focused as
   * soon as the page loads, which enables the user to
   * start typing without having to manually focus the control. Don't
   * use this option on pages where the control may be
   * scrolled out of the viewport.
   */
  autoFocus?: boolean;

  /**
   * Adds an `aria-label` to the native control.
   *
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;

  /**
   * Specifies whether to add `aria-required` to the native control.
   */
  ariaRequired?: boolean;

  /**
   * Called when input focus is moved to the UI control.
   */
  onFocus?: NonCancelableEventHandler<null>;

  /**
   * Called when input focus is removed from the UI control.
   */
  onBlur?: NonCancelableEventHandler<null>;

  /**
   * Called whenever a user changes the input value (by typing, pasting, or selecting a value).
   * The event `detail` contains the current value of the field.
   */
  onChange?: NonCancelableEventHandler<DatePickerProps.ChangeDetail>;

  variant?: 'embedded';
}

export namespace DatePickerProps {
  export interface ChangeDetail {
    /**
     * The new value of this date-picker.
     */
    value: string;
  }

  export interface IsDateEnabledFunction {
    (date: Date): boolean;
  }

  export interface OpenCalendarAriaLabel {
    (selectedDate: string | null): string;
  }

  export interface Ref {
    /**
     * Sets the browser focus on the UI control
     */
    focus(): void;
  }
}
