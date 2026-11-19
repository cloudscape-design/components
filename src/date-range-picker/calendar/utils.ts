// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addMonths, addYears, isSameMonth, isSameYear, startOfMonth, startOfYear } from 'date-fns';

import { parseDate } from '../../internal/utils/date-time';
import { DateRangePickerProps } from '../interfaces';
import { RangeCalendarI18nStrings } from './interfaces';

function isVisibleMonth(dateLeft: number | Date, dateRight: number | Date, isSingleGrid: boolean) {
  if (isSingleGrid) {
    return isSameMonth(dateLeft, dateRight);
  }
  return isSameMonth(dateLeft, dateRight) || isSameMonth(dateLeft, addMonths(dateRight, 1));
}
function isVisibleYear(dateLeft: number | Date, dateRight: number | Date, isSingleGrid: boolean) {
  if (isSingleGrid) {
    return isSameYear(dateLeft, dateRight);
  }
  return isSameYear(dateLeft, dateRight) || isSameYear(dateLeft, addYears(dateRight, 1));
}

export function findDateToFocus(
  selected: Date | null,
  baseDate: Date,
  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction,
  isSingleGrid: boolean
) {
  if (selected && isDateEnabled(selected) && isVisibleMonth(selected, baseDate, isSingleGrid)) {
    return selected;
  }
  const today = new Date();
  if (isDateEnabled(today) && isVisibleMonth(today, baseDate, isSingleGrid)) {
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
  isMonthEnabled: DateRangePickerProps.IsDateEnabledFunction,
  isSingleGrid: boolean
) {
  if (selected && isMonthEnabled(selected) && isVisibleYear(selected, baseDate, isSingleGrid)) {
    return selected;
  }

  const today = new Date();
  if (isMonthEnabled(today) && isVisibleYear(today, baseDate, isSingleGrid)) {
    return today;
  }
  if (isMonthEnabled(baseDate)) {
    return baseDate;
  }
  return null;
}

function calculateEffectiveStartPeriod(
  startPeriod: DateRangePickerProps.StartPeriod,
  value: DateRangePickerProps.PendingAbsoluteValue,
  isSamePeriod: (date1: Date, date2: Date) => boolean
): 'current' | 'previous' {
  if (startPeriod === 'current') {
    return 'current';
  }

  // 'auto' always resolves to 'current' when a date is selected
  if ((value.start.date || value.end.date) && startPeriod === 'auto') {
    return 'current';
  }

  // Override 'previous' to 'current' when the range spans multiple periods
  // to ensure as much of the range is visible as possible
  if (value.start.date && value.end.date) {
    const startDate = parseDate(value.start.date);
    const endDate = parseDate(value.end.date);
    if (!isSamePeriod(startDate, endDate)) {
      return 'current';
    }
  }

  return 'previous';
}

function calculateDisplayOffset(isSingleGrid: boolean, startPeriod: DateRangePickerProps.StartPeriod): number {
  if (isSingleGrid) {
    return 0;
  }

  return startPeriod === 'current' ? 0 : -1;
}

/**
 * Generic function to find which period (month or year) to display in the calendar.
 */
function findPeriodToDisplay(
  value: DateRangePickerProps.PendingAbsoluteValue,
  isSingleGrid: boolean,
  startPeriod: DateRangePickerProps.StartPeriod,
  addPeriods: (date: Date | number, amount: number) => Date,
  startOfPeriod: (date: Date) => Date,
  isSamePeriod: (date1: Date, date2: Date) => boolean
): Date {
  const effectiveStartPeriod = calculateEffectiveStartPeriod(startPeriod, value, isSamePeriod);
  const offset = calculateDisplayOffset(isSingleGrid, effectiveStartPeriod);
  const date =
    (value.start.date && parseDate(value.start.date)) || (value.end.date && parseDate(value.end.date)) || Date.now();

  return startOfPeriod(addPeriods(date, offset));
}

export function findMonthToDisplay(
  value: DateRangePickerProps.PendingAbsoluteValue,
  isSingleGrid: boolean,
  startPeriod: DateRangePickerProps.StartPeriod
) {
  return findPeriodToDisplay(value, isSingleGrid, startPeriod, addMonths, startOfMonth, isSameMonth);
}

export function findYearToDisplay(
  value: DateRangePickerProps.PendingAbsoluteValue,
  isSingleGrid: boolean,
  startPeriod: DateRangePickerProps.StartPeriod
) {
  return findPeriodToDisplay(value, isSingleGrid, startPeriod, addYears, startOfYear, isSameYear);
}

export const generateI18NFallbackKey = (isMonthPicker: boolean, isDateOnly: boolean) => {
  if (isMonthPicker) {
    return 'i18nStrings.monthConstraintText';
  }
  if (isDateOnly) {
    return 'i18nStrings.dateConstraintText';
  }
  return 'i18nStrings.dateTimeConstraintText';
};

export const generateI18NKey = (isMonthPicker: boolean, isDateOnly: boolean, isIso: boolean) => {
  if (isMonthPicker) {
    return isIso ? 'i18nStrings.isoMonthConstraintText' : 'i18nStrings.slashedMonthConstraintText';
  }
  if (isDateOnly) {
    return isIso ? 'i18nStrings.isoDateConstraintText' : 'i18nStrings.slashedDateConstraintText';
  }
  return isIso ? 'i18nStrings.isoDateTimeConstraintText' : 'i18nStrings.slashedDateTimeConstraintText';
};

export const provideI18N = (
  i18nStrings: RangeCalendarI18nStrings,
  isMonthPicker: boolean,
  isDateOnly: boolean,
  isIso: boolean
): undefined | string => {
  let result;
  if (isMonthPicker) {
    result = isIso ? i18nStrings?.isoMonthConstraintText : i18nStrings?.slashedMonthConstraintText;
    if (!result) {
      result = i18nStrings?.monthConstraintText;
    }
  } else if (isDateOnly) {
    result = isIso ? i18nStrings?.isoDateConstraintText : i18nStrings?.slashedDateConstraintText;
    if (!result) {
      result = i18nStrings?.dateConstraintText;
    }
  }
  if (!result) {
    result = isIso ? i18nStrings?.isoDateTimeConstraintText : i18nStrings?.slashedDateTimeConstraintText;
    if (!result) {
      result = i18nStrings?.dateTimeConstraintText;
    }
  }
  return result;
};
