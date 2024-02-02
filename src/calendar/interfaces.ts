// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface CalendarProps extends BaseComponentProps {
  /**
   * The current input value, in YYYY-MM-DD format.
   */
  value: string;

  /**
   * Defines whether a particular date is enabled in the calendar or not.
   * If you disable a date in the calendar, users can still enter this date using a keyboard.
   * We recommend that you also validate these constraints on the client-side and server-side
   * as you would for other form elements.
   * @param date
   */
  isDateEnabled?: CalendarProps.IsDateEnabledFunction;

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
   * Adds an `aria-label` to the calendar.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-labelledby` to the calendar.
   */
  ariaLabelledby?: string;

  /**
   * Adds `aria-describedby` to the calendar.
   */
  ariaDescribedby?: string;

  /**
   * Used as part of the `aria-label` for today's date in the calendar.
   * @deprecated Use `i18nStrings`
   */
  todayAriaLabel?: string;

  /**
   * Specifies an `aria-label` for the 'next month' button.
   * @deprecated Use `i18nStrings`
   */
  nextMonthAriaLabel?: string;

  /**
   * Specifies an `aria-label` for the 'previous month' button.
   * @deprecated Use `i18nStrings`
   */
  previousMonthAriaLabel?: string;

  /**
   * Called whenever a user changes the input value (by typing, pasting, or selecting a value).
   * The event `detail` contains the current value of the field.
   */
  onChange?: NonCancelableEventHandler<CalendarProps.ChangeDetail>;

  /**
   * An object containing all the necessary localized strings required by
   * the component.
   */
  i18nStrings?: CalendarProps.I18nStrings;
}

export namespace CalendarProps {
  export interface ChangeDetail {
    /**
     * The new value of this component.
     */
    value: string;
  }

  export interface IsDateEnabledFunction {
    (date: Date): boolean;
  }

  export interface I18nStrings {
    /**
     * Used as part of the `aria-label` for today's date in the calendar.
     * @i18n
     */
    todayAriaLabel?: string;

    /**
     * Specifies an `aria-label` for the 'next month' button.
     * @i18n
     */
    nextMonthAriaLabel?: string;

    /**
     * Specifies an `aria-label` for the 'previous month' button.
     * @i18n
     */
    previousMonthAriaLabel?: string;
  }
}
