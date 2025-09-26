// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import dayjs from 'dayjs';

import { CalendarProps } from '../interfaces';

export function moveNextDay(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateFocusable, 1);
}

export function movePrevDay(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateFocusable, -1);
}

export function moveNextWeek(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateFocusable, 7);
}

export function movePrevWeek(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateFocusable, -7);
}

// Returns first enabled date of the month corresponding to the given date.
// If all month's days are disabled, the first day of the month is returned.
export function getBaseDay(date: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  const startDate = dayjs(date).startOf('month').toDate();

  if (isDateFocusable(startDate)) {
    return startDate;
  }
  const firstEnabledDate = moveDay(startDate, isDateFocusable, 1);
  return dayjs(startDate).isSame(firstEnabledDate, 'month') ? firstEnabledDate : startDate;
}

// Iterates days forwards or backwards until the next active day is found.
// If there is no active day in a year range, the start day is returned.
export function moveDay(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction, step: number): Date {
  const limitYears = 1;

  let current = dayjs(startDate).add(step, 'day').toDate();

  while (!isDateFocusable(current)) {
    if (Math.abs(dayjs(startDate).diff(current, 'year')) > limitYears) {
      return startDate;
    }
    current = dayjs(current).add(step, 'day').toDate();
  }

  return current;
}
