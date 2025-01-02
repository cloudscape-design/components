// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addMonths, differenceInYears, isSameYear, startOfYear } from 'date-fns';

import { CalendarProps } from '../interfaces';

export function moveNextMonth(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateFocusable, 1);
}

export function movePrevMonth(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateFocusable, -1);
}

export function moveMonthDown(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateFocusable, 3);
}

export function moveMonthUp(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateFocusable, -3);
}

// Returns first enabled month of the year corresponding to the given date.
// If all year's months are disabled, the first month of the year is returned.
export function getBaseMonth(date: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  const startDate = startOfYear(date);
  if (isDateFocusable(startDate)) {
    return startDate;
  }
  const firstEnabledDate = moveMonth(startDate, isDateFocusable, 1);
  return isSameYear(startDate, firstEnabledDate) ? firstEnabledDate : startDate;
}

// Iterates months forwards or backwards until the next active month is found.
// If there is no active month in a 10 year range, the start month is returned.
export function moveMonth(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction, step: number): Date {
  const limitYears = 10;
  let current = addMonths(startDate, step);

  while (!isDateFocusable(current)) {
    if (Math.abs(differenceInYears(startDate, current)) > limitYears) {
      return startDate;
    }
    current = addMonths(current, step);
  }

  return current;
}
