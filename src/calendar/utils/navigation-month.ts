// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import dayjs from 'dayjs';

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
  const startDate = dayjs(date).startOf('year').toDate();
  if (isDateFocusable(startDate)) {
    return startDate;
  }
  const firstEnabledDate = moveMonth(startDate, isDateFocusable, 1);
  return dayjs(startDate).isSame(firstEnabledDate, 'year') ? firstEnabledDate : startDate;
}

// Iterates months forwards or backwards until the next active month is found.
// If there is no active month in a 10 year range, the start month is returned.
export function moveMonth(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction, step: number): Date {
  const limitYears = 10;
  let current = dayjs(startDate).add(step, 'month').toDate();

  while (!isDateFocusable(current)) {
    if (Math.abs(dayjs(startDate).diff(current, 'year')) > limitYears) {
      return startDate;
    }
    current = dayjs(current).add(step, 'month').toDate();
  }

  return current;
}
