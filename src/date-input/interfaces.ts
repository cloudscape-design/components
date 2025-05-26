// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CalendarProps } from '../calendar/interfaces';
import { BaseInputProps, InputProps } from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { DateFormat, EditableDateFormat } from '../internal/utils/date-time/date-types';

export interface DateInputProps
  extends BaseInputProps,
    FormFieldValidationControlProps,
    BaseComponentProps,
    Pick<CalendarProps, 'locale' | 'granularity'> {
  /**
   * The current input value, in YYYY-MM-DD format.
   */
  value: string;

  /**
   * The format as it is displayed. It can take the following values:
   * * `iso`: ISO 8601 format without time, e.g.: 2024-01-30 (or 2024-01)
   * * `long-localized`: a more human-readable, localized format, e.g.: January 30, 2024 (or January, 2024)
   * * `slashed`: similar to ISO 8601 but with '/' in place of '-'. e.g.: 2024/01/30 (or 2024/01)
   *
   * @default 'slashed'
   */
  format?: DateFormat;

  /**
   * Specifies the date format to use when the format is 'long-localized' and the user needs to edit the date.
   *
   * The format of the input as it is being interacted with. It can take the following values:
   * * `iso`: ISO 8601 format without time, e.g.: 2024-01-30 (or 2024-01)
   * * `slashed`: similar to ISO 8601 but with '/' in place of '-'. e.g.: 2024/01/30 (or 2024/01)
   *
   * @default 'slashed'.
   */
  inputFormat?: EditableDateFormat;
}

export namespace DateInputProps {
  export type Ref = InputProps.Ref;

  export type Format = DateFormat;

  export type InputFormat = EditableDateFormat;
}
