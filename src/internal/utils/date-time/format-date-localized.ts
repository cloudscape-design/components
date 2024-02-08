// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatTimeOffsetLocalized } from './format-time-offset';

export default function formatDateLocalized({
  date: isoDate,
  hideTimeOffset,
  isDateOnly,
  timeOffset,
  locale,
}: {
  date: string;
  hideTimeOffset?: boolean;
  isDateOnly: boolean;
  timeOffset?: number;
  locale?: string;
}) {
  const date = new Date(isoDate);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  if (isDateOnly) {
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
