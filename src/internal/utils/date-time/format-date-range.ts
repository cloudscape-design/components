// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isIsoDateOnly } from './is-iso-date-only';
import formatDateIso from './format-date-iso';
import formatDateLocalized from './format-date-localized';
import { DateRangePickerProps } from '../../../date-range-picker/interfaces';

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
  format?: DateRangePickerProps.AbsoluteFormat;
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
  date,
  format,
  hideTimeOffset,
  isDateOnly,
  timeOffset,
  locale,
}: {
  date: string;
  format?: DateRangePickerProps.AbsoluteFormat;
  hideTimeOffset?: boolean;
  isDateOnly: boolean;
  timeOffset?: number;
  locale?: string;
}) {
  switch (format) {
    case 'long-localized': {
      return formatDateLocalized({ date, hideTimeOffset, isDateOnly, locale, timeOffset });
    }
    default: {
      return formatDateIso({ date, hideTimeOffset, isDateOnly, timeOffset });
    }
  }
}
