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
  let dateObject = new Date(isoDate);
  if (isNaN(dateObject.getTime())) {
    // Preserve original behavior: throw RangeError for invalid dates
    throw new RangeError('Invalid time value');
  }

  // Detect ISO string format (full datetime, date-only, or month-only)
  const isISOString =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(isoDate) || isIsoDateOnly(isoDate) || isIsoMonthOnly(isoDate);

  // For non-ISO strings, date-fns treated them as UTC, so we need to adjust
  if (!isISOString) {
    // Convert local time to UTC to match original date-fns behavior
    const utcTime = dateObject.getTime() - dateObject.getTimezoneOffset() * 60000;
    dateObject = new Date(utcTime);
  }

  if (isMonthOnly) {
    const formattedMonthDate = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(dateObject);

    return formattedMonthDate;
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(dateObject);

  if (isDateOnly) {
    return formattedDate;
  }

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
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
