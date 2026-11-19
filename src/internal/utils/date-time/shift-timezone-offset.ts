// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { addMinutes } from 'date-fns';

import { joinDateTime } from '.';
import { formatDate } from './format-date';
import { formatTime } from './format-time';
import { parseTimezoneOffset } from './parse-timezone-offset';

/**
 * Re-formats an ISO8601 date string so that it is expressed using the
 * target timezone offset. The returned date string still represents the
 * same instant in time, but contains no visible offset.
 *
 * Example:
 * ```
 * shiftTimezoneOffset("2020-01-01T09:00:00+03:00", 2 * 60) === "2020-01-01T08:00:00"
 * ```
 */
export function shiftTimezoneOffset(dateString: string, targetTimezoneOffset?: number) {
  const [datePart, timeAndOffsetPart = ''] = dateString.split('T');
  const [timePart] = timeAndOffsetPart.split(/-|\+|Z/);
  const valueWithoutOffset = joinDateTime(datePart, timePart);
  const originalTimezoneOffset = parseTimezoneOffset(dateString);

  const date = new Date(valueWithoutOffset);
  targetTimezoneOffset = targetTimezoneOffset ?? 0 - date.getTimezoneOffset();
  const adjustedDate = addMinutes(date, targetTimezoneOffset - originalTimezoneOffset);

  return joinDateTime(formatDate(adjustedDate), formatTime(adjustedDate));
}
