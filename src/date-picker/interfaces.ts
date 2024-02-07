// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { ExpandToViewport } from '../internal/components/dropdown/interfaces';
import { NonCancelableEventHandler } from '../internal/events';
import { CalendarProps } from '../calendar/interfaces';

export interface DatePickerProps
  extends BaseComponentProps,
    FormFieldValidationControlProps,
    ExpandToViewport,
    CalendarProps {
  /**
   * Specifies the placeholder text rendered when the value is an empty string.
   */
  placeholder?: string;

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
