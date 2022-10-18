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
  timeOffset: { startDate?: number; endDate?: number }
): DateRangePickerProps.Value | null {
  if (!(value?.type === 'absolute')) {
    return value;
  }
  return {
    type: 'absolute',
    startDate: value.startDate + formatTimezoneOffset(value.startDate, timeOffset.startDate),
    endDate: value.endDate + formatTimezoneOffset(value.endDate, timeOffset.endDate),
  };
}

/**
 * Re-formats an absolute date range so that it is expressed using the
 * target time offset. The returned value still represents the same range
 * in time, but contains no visible offset.
 */
export function shiftTimeOffset(
  value: null | DateRangePickerProps.Value,
  timeOffset: { startDate?: number; endDate?: number }
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
    startDate: shiftTimezoneOffset(value.startDate, timeOffset.startDate),
    endDate: shiftTimezoneOffset(value.endDate, timeOffset.endDate),
  };
}

export function normalizeTimeOffset(
  value: null | DateRangePickerProps.Value,
  getTimeOffset?: DateRangePickerProps.GetTimeOffsetFunction,
  timeOffset?: number
) {
  if (value && value.type === 'absolute') {
    if (getTimeOffset) {
      return {
        startDate: getTimeOffset(parseDateUTC(value.startDate)),
        endDate: getTimeOffset(parseDateUTC(value.endDate)),
      };
    } else if (timeOffset !== undefined) {
      return { startDate: timeOffset, endDate: timeOffset };
    }
  }
  return { startDate: undefined, endDate: undefined };
}

function parseDateUTC(isoDateString: string): Date {
  const date = new Date(isoDateString);
  date.setMinutes(-1 * date.getTimezoneOffset());
  return date;
}
