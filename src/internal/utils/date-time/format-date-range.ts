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
  const formattedStartOffset =
    hideTimeOffset || isDateOnly ? '' : formatTimezoneOffset(startDate, timeOffset.startDate);
  const formattedEndOffset = hideTimeOffset || isDateOnly ? '' : formatTimezoneOffset(endDate, timeOffset.endDate);
  return format === 'spaced'
    ? [
        applyAbsoluteFormat({
          date: startDate,
          dateOnly: isDateOnly,
        }),
        formattedStartOffset,
      ]
        .filter(Boolean)
        .join(' ') +
        '  — ' +
        [
          applyAbsoluteFormat({
            date: endDate,
            dateOnly: isDateOnly,
          }),
          formattedEndOffset,
        ]
          .filter(Boolean)
          .join(' ')
    : startDate + formattedStartOffset + ' ' + '—' + ' ' + endDate + formattedEndOffset;
}

function applyAbsoluteFormat({ date, dateOnly }: { date: string; dateOnly: boolean }) {
  const d = new Date(date);

  const formattedDate = [
    d.getFullYear(),
    padLeftZeros((d.getMonth() + 1).toString(), 2),
    padLeftZeros(d.getDate().toString(), 2),
  ].join('-');

  const formattedTime = dateOnly
    ? undefined
    : [
        padLeftZeros(d.getHours().toString(), 2),
        padLeftZeros(d.getMinutes().toString(), 2),
        padLeftZeros(d.getSeconds().toString(), 2),
      ].join(':');

  return [formattedDate, formattedTime].filter(Boolean).join(' ');
}
