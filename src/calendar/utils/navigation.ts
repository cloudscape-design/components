// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addDays, addMonths, differenceInYears, isSameMonth, startOfMonth } from 'date-fns';

export function moveNextDay(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, 1);
}

export function movePrevDay(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, -1);
}

export function moveNextWeek(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, 7);
}

export function movePrevWeek(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, -7);
}

export function moveNextMonth(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  if (isDateEnabled(startDate)) {
    return addMonths(startDate, 1);
  }
  return startDate;
}

export function movePrevMonth(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  if (isDateEnabled(startDate)) {
    return addMonths(startDate, -1);
  }
  return startDate;
}

export function moveMonthDown(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  if (isDateEnabled(startDate)) {
    return addMonths(startDate, 3);
  }
  return startDate;
}

export function moveMonthUp(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  if (isDateEnabled(startDate)) {
    return addMonths(startDate, -3);
  }
  return startDate;
}

// Returns first enabled date of the month corresponding the given date.
// If all month's days are disabled the first day of the month is returned.
export function getBaseDate(date: Date, isDateEnabled: (date: Date) => boolean) {
  const startDate = startOfMonth(date);
  if (isDateEnabled(startDate)) {
    return startDate;
  }

  const firstEnabledDate = moveDate(startDate, isDateEnabled, 1);
  return isSameMonth(startDate, firstEnabledDate) ? firstEnabledDate : startDate;
}

// Iterates dates forwards or backwards until the next active date is found.
// If there is no active date in a year range the start date is returned.
function moveDate(startDate: Date, isDateEnabled: (date: Date) => boolean, step: number): Date {
  let current = addDays(startDate, step);

  while (!isDateEnabled(current)) {
    if (Math.abs(differenceInYears(startDate, current)) > 1) {
      return startDate;
    }
    current = addDays(current, step);
  }

  return current;
}
