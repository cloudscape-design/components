// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CalendarProps } from '../calendar/interfaces';
import { BaseInputProps, InputProps } from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';

export type DateInputFormat = 'iso' | 'default';

export type DateDisplayFormat = DateInputFormat | 'default';

export interface DateInputProps extends BaseInputProps, FormFieldValidationControlProps, BaseComponentProps {
  /**
   * The current input value, in YYYY-MM-DD format.
   */
  value: string;
  /**
   * The locale to be used for rendering month names and defining the
   * starting date of the week. If not provided, it will be determined
   * from the page and browser locales. Supported values and formats
   * are as-per the [JavaScript Intl API specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation).
   */
  locale?: string;
  /**
   * Specifies the granularity at which users will be able to enter a date.
   *
   * Defaults to 'day'.
   */
  granularity?: CalendarProps.Granularity;
  /**
   * The format of the date input as it is being interacted with. It can take the following values:
   * `iso`: ISO 8601 format without time, e.g.: 2024-01-30 (or 2024-01)
   * `default`: similar to ISO 8601 but with '/' in place of '-'. e.g.: 2024/01/30 (or 2024/01)
   *
   * @default 'default'
   */
  format?: DateInputFormat;
  /**
   * The format of the date displayed in the input. It can take the following values:
   * `iso`: ISO 8601 format without time, e.g.: 2024-01-30 (or 2024-01)
   * `long-localized`: a more human-readable, localized format, e.g.: January 30, 2024 (or January, 2024)
   * `default`: similar to ISO 8601 but with '-' in place of '/'. e.g.: 2024-01-30 (or 2024-01)
   *
   * @default 'default'
   */
  displayFormat?: DateDisplayFormat | 'long-localized';
}

export namespace DateInputProps {
  export type Ref = InputProps.Ref;
}
