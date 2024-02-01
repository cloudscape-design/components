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

  const isRTL = locale && getDirection(locale) === 'rtl';

  const formattedDateTime = isRTL
    ? [formattedTime, formattedDate].join(getDateTimeSeparator(locale)) + '\u200E' // Add LTR mark at the end to be able to concatenate correctly to form the date range.
    : [formattedDate, formattedTime].join(getDateTimeSeparator(locale));

  if (hideTimeOffset) {
    return formattedDateTime;
  }

  const formattedTimeOffset = formatTimeOffset(isoDate, timeOffset);
  if (isRTL) {
    return [formattedTimeOffset, formattedDateTime].join(' ');
  }
  return [formattedDateTime, formattedTimeOffset].join(' ');
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

// Languages written from right to left (RTL)
const rtlLanguages = ['ar', 'he'];

// Languages in which date and time are separated just with a space, without comma
const languagesWithoutDateTimeSeparator = ['ja', 'zh-CN'];

function getDirection(locale: string) {
  return rtlLanguages.includes(getPrimarySubTag(locale)) ? 'rtl' : 'ltr';
}

function getDateTimeSeparator(locale?: string) {
  if (!locale) {
    return ', ';
  }
  return languagesWithoutDateTimeSeparator.includes(locale) ? ' ' : getDirection(locale) === 'rtl' ? ' ,' : ', ';
}

function getPrimarySubTag(locale: string) {
  return locale.split('-')[0];
}
