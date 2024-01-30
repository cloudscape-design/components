// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DateRangePickerProps } from '../../../date-range-picker/interfaces';
import { padLeftZeros } from '../strings';
import { formatTimezoneOffset } from './format-timezone-offset';
import { isIsoDateOnly } from './is-iso-date-only';

export function formatDateRange({
  startDate,
  endDate,
  timeOffset,
  hideTimeOffset,
  format,
}: {
  startDate: string;
  endDate: string;
  hideTimeOffset?: boolean;
  timeOffset: { startDate?: number; endDate?: number };
  format?: DateRangePickerProps.AbsoluteFormat;
}): string {
  const isDateOnly = isIsoDateOnly(startDate) && isIsoDateOnly(endDate);
  return [
    formatDate({
      date: startDate,
      format,
      hideTimeOffset,
      isDateOnly,
      timeOffset: timeOffset.startDate,
    }),
    formatDate({
      date: endDate,
      format,
      hideTimeOffset,
      isDateOnly,
      timeOffset: timeOffset.endDate,
    }),
  ].join(' — ');
}

function formatDate({
  date,
  format,
  hideTimeOffset,
  isDateOnly,
  timeOffset,
}: {
  date: string;
  format?: DateRangePickerProps.AbsoluteFormat;
  hideTimeOffset?: boolean;
  isDateOnly: boolean;
  timeOffset?: number;
}) {
  const formattedOffset = hideTimeOffset || isDateOnly ? '' : formatTimezoneOffset(date, timeOffset);

  switch (format) {
    case 'spaced': {
      const d = new Date(date);

      const formattedDate = [
        d.getFullYear(),
        padLeftZeros((d.getMonth() + 1).toString(), 2),
        padLeftZeros(d.getDate().toString(), 2),
      ].join('-');

      const formattedTime = isDateOnly
        ? undefined
        : [
            padLeftZeros(d.getHours().toString(), 2),
            padLeftZeros(d.getMinutes().toString(), 2),
            padLeftZeros(d.getSeconds().toString(), 2),
          ].join(':');

      return [formattedDate, formattedTime, formattedOffset].filter(Boolean).join(' ');
    }

    default:
      return date + formattedOffset;
  }
}
