// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { formatTimeOffsetLocalized } from './format-time-offset';
import { isIsoDateOnly, isIsoMonthOnly } from './is-iso-only';

export default function formatDateLocalized({
  date: isoDate,
  hideTimeOffset,
  isDateOnly,
  isMonthOnly,
  timeOffset,
  locale,
}: {
  date: string;
  hideTimeOffset?: boolean;
  isMonthOnly: boolean;
  isDateOnly: boolean;
  timeOffset?: number;
  locale?: string;
}) {
  // Check if the date is valid
  const dateObject = new Date(isoDate);
  if (isNaN(dateObject.getTime())) {
    // Preserve original behavior: throw RangeError for invalid dates
    throw new RangeError('Invalid time value');
  }

  // Detect if the ISO string has a timezone suffix (Z or +/-HH:MM)
  const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(isoDate);

  // For ISO datetime strings with timezone, or date-only/month-only formats, use UTC
  // For ISO datetime strings without timezone, or non-ISO strings, use local time
  const useUTC = hasTimezone || isIsoDateOnly(isoDate) || isIsoMonthOnly(isoDate);

  const timezoneOption = useUTC ? { timeZone: 'UTC' as const } : {};

  if (isMonthOnly) {
    const formattedMonthDate = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
      ...timezoneOption,
    }).format(dateObject);

    return formattedMonthDate;
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    ...timezoneOption,
  }).format(dateObject);

  if (isDateOnly) {
    return formattedDate;
  }

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    second: '2-digit',
    ...timezoneOption,
  }).format(dateObject);

  const formattedDateTime = formattedDate + getDateTimeSeparator(locale) + formattedTime;

  if (hideTimeOffset) {
    return formattedDateTime;
  }

  const formattedTimeOffset = formatTimeOffsetLocalized(isoDate, timeOffset);
  return formattedDateTime + ' ' + formattedTimeOffset;
}

// Languages in which date and time are separated just with a space, without comma
const languagesWithoutDateTimeSeparator = ['ja', 'zh-CN', 'zh-TW'];

function getDateTimeSeparator(locale?: string) {
  return locale && languagesWithoutDateTimeSeparator.includes(locale) ? ' ' : ', ';
}
