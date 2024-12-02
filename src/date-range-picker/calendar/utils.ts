// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addMonths, addYears, isSameMonth, isSameYear, startOfMonth, startOfYear } from 'date-fns';

import { parseDate } from '../../internal/utils/date-time';
import { DateRangePickerProps } from '../interfaces';

export function findDateToFocus(
  selected: Date | null,
  baseDate: Date,
  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction
) {
  if (selected && isDateEnabled(selected) && isSameMonth(selected, baseDate)) {
    return selected;
  }
  const today = new Date();
  if (isDateEnabled(today) && isSameMonth(today, baseDate)) {
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
  if (selected && isMonthEnabled(selected) && isSameYear(selected, baseDate)) {
    return selected;
  }
  const today = new Date();
  if (isMonthEnabled(today) && isSameYear(today, baseDate)) {
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
      return startOfMonth(startDate);
    }
    return startOfMonth(addMonths(startDate, 1));
  }
  if (value.end.date) {
    return startOfMonth(parseDate(value.end.date));
  }
  return startOfMonth(Date.now());
}

export function findYearToDisplay(value: DateRangePickerProps.PendingAbsoluteValue, isSingleGrid: boolean) {
  if (value.start.date) {
    const startDate = parseDate(value.start.date);
    if (isSingleGrid) {
      return startOfYear(startDate);
    }
    return startOfYear(addYears(startDate, 1));
  }
  if (value.end.date) {
    return startOfYear(parseDate(value.end.date));
  }
  return startOfYear(Date.now());
}
