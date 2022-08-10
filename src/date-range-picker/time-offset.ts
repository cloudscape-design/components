// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from './interfaces';
import { warnOnce } from '../internal/logging';
import { formatTimezoneOffset, shiftTimezoneOffset } from '../internal/utils/date-time';

/**
 * Appends a time zone offset to an offset-less date string.
 */
export function setTimeOffset(
  value: DateRangePickerProps.Value | null,
  timeOffsetInMinutes: number
): DateRangePickerProps.Value | null {
  if (!(value?.type === 'absolute')) {
    return value;
  }

  const offsetSuffix = formatTimezoneOffset(timeOffsetInMinutes);

  const { startDate, endDate } = value;

  return {
    type: 'absolute',
    startDate: startDate + offsetSuffix,
    endDate: endDate + offsetSuffix,
  };
}

/**
 * Re-formats an absolute date range so that it is expressed using the
 * target time offset. The returned value still represents the same range
 * in time, but contains no visible offset.
 */
export function shiftTimeOffset(
  value: null | DateRangePickerProps.Value,
  timeOffsetInMinutes: number
): DateRangePickerProps.Value | null {
  if (!value || value.type !== 'absolute') {
    return value;
  }

  /*
    This regex matches an ISO date-time with
    - optional seconds;
    - optional milliseconds;
    - optional time offset or 'Z'.
  */
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{1,3})?(((\+|-)\d{2}(:\d{2})?)|Z)?$/;

  if (!dateTimeRegex.test(value.startDate) || !dateTimeRegex.test(value.endDate)) {
    warnOnce(
      'DateRangePicker',
      'You have provided a misformatted start or end date. The component will fall back to an empty value. ' +
        'Dates have to be ISO8601-formatted with an optional time zone offset.'
    );
    return null;
  }

  return {
    type: 'absolute',
    startDate: shiftTimezoneOffset(value.startDate, timeOffsetInMinutes),
    endDate: shiftTimezoneOffset(value.endDate, timeOffsetInMinutes),
  };
}
