// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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

  const formattedTimeOffset = formatTimeOffset(isoDate, timeOffset);
  return formattedDateTime + ' ' + formattedTimeOffset;
}

function formatTimeOffset(isoDate: string, offsetInMinutes?: number) {
  offsetInMinutes = offsetInMinutes ?? 0 - new Date(isoDate).getTimezoneOffset();
  if (offsetInMinutes === 0) {
    return '(UTC)';
  }
  const hoursOffset = Math.floor(Math.abs(offsetInMinutes) / 60);
  const minuteOffset = Math.floor(Math.abs(offsetInMinutes % 60));

  const sign = offsetInMinutes < 0 ? '-' : '+';
  const formattedOffsetMinutes = minuteOffset === 0 ? '' : `:${minuteOffset}`;
  const formattedOffset = `(UTC${sign}${hoursOffset}${formattedOffsetMinutes})`;

  return formattedOffset;
}

// Languages in which date and time are separated just with a space, without comma
const languagesWithoutDateTimeSeparator = ['ja', 'zh-CN', 'zh-TW'];

function getDateTimeSeparator(locale?: string) {
  return locale && languagesWithoutDateTimeSeparator.includes(locale) ? ' ' : ', ';
}
