// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DateRangePickerProps } from '../../../date-range-picker/interfaces';
import formatDateIso from './format-date-iso';
import formatDateLocalized from './format-date-localized';
import { isIsoDateOnly, isIsoMonthOnly } from './is-iso-only';

export function formatDateTimeWithOffset({
  date,
  format,
  hideTimeOffset,
  timeOffset,
  locale,
}: {
  date: string;
  format: DateRangePickerProps.AbsoluteFormat;
  hideTimeOffset?: boolean;
  timeOffset?: number;
  locale?: string;
}) {
  const isDateOnly = isIsoDateOnly(date);
  const isMonthOnly = isIsoMonthOnly(date);
  switch (format) {
    case 'long-localized': {
      return formatDateLocalized({ date, hideTimeOffset, isDateOnly, isMonthOnly, locale, timeOffset });
    }
    default: {
      return formatDateIso({ date, hideTimeOffset, isDateOnly, isMonthOnly, timeOffset });
    }
  }
}
