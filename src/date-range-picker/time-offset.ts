// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from './interfaces';
import { padLeftZeros } from '../internal/components/masked-input/utils/strings';
import { addMinutes } from 'date-fns';
import { formatTime, formatDate } from '../date-picker/calendar/utils/date';
import { warnOnce } from '../internal/logging';

/**
 * Returns the time offset of the browser.
 *
 * I.e. determines the `x` in `current offset = UTC + x`
 */
export function getBrowserTimezoneOffset() {
  return 0 - new Date().getTimezoneOffset();
}

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

  const offsetSuffix = formatOffset(timeOffsetInMinutes);

  const { startDate, endDate } = value;

  return {
    type: 'absolute',
    startDate: startDate + offsetSuffix,
    endDate: endDate + offsetSuffix,
  };
}

export function formatOffset(offsetInMinutes: number) {
  const hoursOffset = padLeftZeros(Math.floor(Math.abs(offsetInMinutes) / 60).toFixed(0), 2);
  const minuteOffset = padLeftZeros(Math.abs(offsetInMinutes % 60).toFixed(0), 2);

  const sign = offsetInMinutes < 0 ? '-' : '+';
  const offsetSuffix = `${sign}${hoursOffset}:${minuteOffset}`;

  return offsetSuffix;
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
    startDate: doShiftTimeOffset(value.startDate, timeOffsetInMinutes),
    endDate: doShiftTimeOffset(value.endDate, timeOffsetInMinutes),
  };
}

/**
 * Re-formats an ISO8601 date string so that it is expressed using the
 * target time offset. The returned date string still represents the
 * same instant in time, but contains no visible offset.
 *
 * Example:
 * ```
 * doShiftTimeOffset("2020-01-01T09:00:00+03:00", 2 * 60)
 * = "2020-01-01T08:00:00"
 * ```
 */
function doShiftTimeOffset(value: string, targetOffsetInMinutes: number) {
  const [valueWithoutOffset, offsetInMinutes] = splitOffset(value);

  const differenceBetweenValueAndTarget = targetOffsetInMinutes - offsetInMinutes;

  const date = new Date(valueWithoutOffset);
  const adjustedDate = addMinutes(date, differenceBetweenValueAndTarget);

  const formattedDate = formatDate(adjustedDate);
  const formattedTime = formatTime(adjustedDate);

  return `${formattedDate}T${formattedTime}`;
}

/**
 * Splits an ISO8601 date string into its timezone-independent part
 * and its time offset in minutes.
 */
function splitOffset(value: string) {
  const [datePart, timePart] = value.split('T');
  const [time, signCharacter, offsetPart] = timePart.split(/(-|\+)/);

  if (signCharacter && offsetPart) {
    const [offsetHours, offsetMinutes] = offsetPart.split(':');

    const offset = Number(offsetHours) * 60 + Number(offsetMinutes);

    const sign = signCharacter === '-' ? -1 : 1;

    return [`${datePart}T${time}`, offset * sign] as const;
  }

  const utcTimezoneIndicator = value.indexOf('Z');
  if (utcTimezoneIndicator !== -1) {
    return [value.substring(0, utcTimezoneIndicator), 0] as const;
  }

  return [value, getBrowserTimezoneOffset()] as const;
}
