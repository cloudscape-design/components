// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseInputProps, InputProps } from '../input/interfaces.js';
import { BaseComponentProps } from '../internal/base-component/index.js';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context.js';
import { DateFormat, DateGranularity, EditableDateFormat } from '../internal/utils/date-time/interfaces.js';

export interface DateInputProps extends BaseInputProps, FormFieldValidationControlProps, BaseComponentProps {
  /**
   * The current input value, in YYYY-MM-DD format.
   */
  value: string;

  /**
   * Specifies the locale to use to render month names and determine the starting day of the week.
   * If you don't provide this, the locale is determined by the page and browser locales.
   * Supported values and formats are listed in the [JavaScript Intl API specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation).
   */
  locale?: string;

  /**
   * Specifies the granularity at which users will be able to select a date.
   * Defaults to `day`.
   **/
  granularity?: DateInputProps.Granularity;

  /**
   * The format as it is displayed. It can take the following values:
   * * `iso`: ISO 8601 format without time, e.g.: 2024-01-30 (or 2024-01).
   * * `long-localized`: a more human-readable, localized format, e.g.: January 30, 2024 (or January, 2024).
   * * `slashed`: similar to ISO 8601 but with '/' in place of '-'. e.g.: 2024/01/30 (or 2024/01).
   */
  format?: DateInputProps.Format;

  /**
   * Specifies the date format to use when the format is 'long-localized' and editing the date.
   * The format of the input as it is being interacted with. It can take the following values:
   * * `iso`: ISO 8601 format without time, e.g.: 2024-01-30 (or 2024-01).
   * * `slashed`: similar to ISO 8601 but with '/' in place of '-'. e.g.: 2024/01/30 (or 2024/01).
   */
  inputFormat?: DateInputProps.InputFormat;
}

export namespace DateInputProps {
  export type Ref = InputProps.Ref;

  export type Format = DateFormat;

  export type InputFormat = EditableDateFormat;

  export type Granularity = DateGranularity;
}
