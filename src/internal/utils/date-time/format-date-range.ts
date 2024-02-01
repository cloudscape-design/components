// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatTimezoneOffset, isIsoDateOnly } from '.';
export type AbsoluteDateFormat = 'iso' | 'long-localized';
export function formatDateRange({
  startDate,
  endDate,
  timeOffset,
  hideTimeOffset,
  format,
  locale,
}: {
  startDate: string;
  endDate: string;
  hideTimeOffset?: boolean;
  timeOffset: { startDate?: number; endDate?: number };
  format?: AbsoluteDateFormat;
  locale?: string;
}): string {
  const isDateOnly = isIsoDateOnly(startDate) && isIsoDateOnly(endDate);
  return (
    formatDate({
      date: startDate,
      format,
      hideTimeOffset,
      isDateOnly,
      timeOffset: timeOffset.startDate,
      locale,
    }) +
    ' — ' +
    formatDate({
      date: endDate,
      format,
      hideTimeOffset,
      isDateOnly,
      timeOffset: timeOffset.endDate,
      locale,
    })
  );
}

function formatDate({
  date: isoDate,
  format,
  hideTimeOffset,
  isDateOnly,
  timeOffset,
  locale,
}: {
  date: string;
  format?: AbsoluteDateFormat;
  hideTimeOffset?: boolean;
  isDateOnly: boolean;
  timeOffset?: number;
  locale?: string;
}) {
  switch (format) {
    case 'long-localized': {
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
        ? [formattedTime, formattedDate].join(' ,') + '\u200E' // Add LTR mark at the end to be able to concatenate correctly to form the date range.
        : [formattedDate, formattedTime].join(', ');

      if (hideTimeOffset) {
        return formattedDateTime;
      }
      const formattedTimeOffset = formatTimezoneOffsetAbsolute(isoDate, timeOffset);
      if (isRTL) {
        return [formattedTimeOffset, formattedDateTime].join(' ');
      }
      return [formattedDateTime, formattedTimeOffset].join(' ');
    }

    default: {
      const formattedOffset = hideTimeOffset || isDateOnly ? '' : formatTimezoneOffset(isoDate, timeOffset);
      return isoDate + formattedOffset;
    }
  }
}

function getDirection(locale: string) {
  return ['ar', 'he'].includes(locale.split('-')[0]) ? 'rtl' : 'ltr';
}

function formatTimezoneOffsetAbsolute(isoDate: string, offsetInMinutes?: number) {
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
