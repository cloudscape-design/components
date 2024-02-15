// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addDays, differenceInYears, isSameMonth, startOfMonth } from 'date-fns';

export function moveNextDay(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDay(startDate, isDateEnabled, 1);
}

export function movePrevDay(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDay(startDate, isDateEnabled, -1);
}

export function moveNextWeek(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDay(startDate, isDateEnabled, 7);
}

export function movePrevWeek(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDay(startDate, isDateEnabled, -7);
}

// Returns first enabled date of the month corresponding to the given date.
// If all month's days are disabled, the first day of the month is returned.
export function getBaseDay(date: Date, isDateEnabled: (date: Date) => boolean) {
  const startDate = startOfMonth(date);
  if (isDateEnabled(startDate)) {
    return startDate;
  }

  const firstEnabledDate = moveDay(startDate, isDateEnabled, 1);
  return isSameMonth(startDate, firstEnabledDate) ? firstEnabledDate : startDate;
}

// If there is no active day in a year range, the start day is returned.
function moveDay(startDate: Date, isDateEnabled: (date: Date) => boolean, step: number): Date {
  let current = addDays(startDate, step);

  while (!isDateEnabled(current)) {
    if (Math.abs(differenceInYears(startDate, current)) > 1) {
      return startDate;
    }
    current = addDays(current, step);
  }

  return current;
}
