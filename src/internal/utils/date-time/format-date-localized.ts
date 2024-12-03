// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isValid, parseISO } from 'date-fns';

import { formatTimeOffsetLocalized } from './format-time-offset';

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
  let date = parseISO(isoDate);
  // if the date is not ISO formatted, fallback to built-in date parsing
  if (!isValid(date)) {
    date = new Date(isoDate);
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    ...(isMonthOnly ? {} : { day: 'numeric' }),
  }).format(date);

  if (isDateOnly || isMonthOnly) {
    return formattedDate;
  }

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);

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
