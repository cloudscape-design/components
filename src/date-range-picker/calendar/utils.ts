// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import dayjs from 'dayjs';

import { parseDate } from '../../internal/utils/date-time';
import { DateRangePickerProps } from '../interfaces';

export function findDateToFocus(
  selected: Date | null,
  baseDate: Date,
  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction
) {
  if (selected && isDateEnabled(selected) && dayjs(selected).isSame(baseDate, 'month')) {
    return selected;
  }
  const today = new Date();
  if (isDateEnabled(today) && dayjs(today).isSame(baseDate, 'month')) {
    return today;
  }
  if (isDateEnabled(baseDate)) {
    return baseDate;
  }
  return null;
}

export function findMonthToFocus(
  selected: Date | null,
  baseDate: Date,
  isMonthEnabled: DateRangePickerProps.IsDateEnabledFunction
) {
  if (selected && isMonthEnabled(selected) && dayjs(selected).isSame(baseDate, 'year')) {
    return selected;
  }

  const today = new Date();
  if (isMonthEnabled(today) && dayjs(today).isSame(baseDate, 'year')) {
    return today;
  }
  if (isMonthEnabled(baseDate)) {
    return baseDate;
  }
  return null;
}

export function findMonthToDisplay(value: DateRangePickerProps.PendingAbsoluteValue, isSingleGrid: boolean) {
  if (value.start.date) {
    const startDate = parseDate(value.start.date);
    if (isSingleGrid) {
      return dayjs(startDate).startOf('month').toDate();
    }
    return dayjs(startDate).add(1, 'month').startOf('month').toDate();
  }
  if (value.end.date) {
    return dayjs(parseDate(value.end.date)).startOf('month').toDate();
  }
  return dayjs(Date.now()).startOf('month').toDate();
}

export function findYearToDisplay(value: DateRangePickerProps.PendingAbsoluteValue, isSingleGrid: boolean) {
  if (value.start.date) {
    const startDate = parseDate(value.start.date);
    if (isSingleGrid) {
      return dayjs(startDate).startOf('year').toDate();
    }
    return dayjs(startDate).add(1, 'year').startOf('year').toDate();
  }
  if (value.end.date) {
    return dayjs(parseDate(value.end.date)).startOf('year').toDate();
  }
  return dayjs(Date.now()).startOf('year').toDate();
}
