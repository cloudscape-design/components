// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addDays, addMonths, differenceInYears, isSameMonth, isSameYear, startOfMonth, startOfYear } from 'date-fns';

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

export function moveNextMonth(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveMonth(startDate, isDateEnabled, 1);
}

export function movePrevMonth(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveMonth(startDate, isDateEnabled, -1);
}

export function moveMonthDown(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveMonth(startDate, isDateEnabled, 3);
}

export function moveMonthUp(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveMonth(startDate, isDateEnabled, -3);
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

// Returns first enabled month of the year corresponding to the given date.
// If all year's months are disabled, the first month of the year is returned.
export function getBaseMonth(date: Date, isDateEnabled: (date: Date) => boolean) {
  const startDate = startOfYear(date);
  if (isDateEnabled(startDate)) {
    return startDate;
  }

  const firstEnabledDate = moveMonth(startDate, isDateEnabled, 1);
  return isSameYear(startDate, firstEnabledDate) ? firstEnabledDate : startDate;
}

// Iterates days forwards or backwards until the next active day is found.
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

// Iterates months forwards or backwards until the next active month is found.
// If there is no active month in a year range, the start month is returned.
function moveMonth(startDate: Date, isDateEnabled: (date: Date) => boolean, step: number): Date {
  let current = addMonths(startDate, step);

  while (!isDateEnabled(current)) {
    if (Math.abs(differenceInYears(startDate, current)) > 1) {
      return startDate;
    }
    current = addMonths(current, step);
  }

  return current;
}
