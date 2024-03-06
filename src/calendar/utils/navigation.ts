// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addDays, addMonths, differenceInYears, isSameMonth, isSameYear, startOfMonth, startOfYear } from 'date-fns';
import { CalendarProps } from '../interfaces';

export function moveNextDay(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateEnabled, 1);
}

export function movePrevDay(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateEnabled, -1);
}

export function moveNextWeek(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateEnabled, 7);
}

export function movePrevWeek(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveDay(startDate, isDateEnabled, -7);
}

export function moveNextMonth(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateEnabled, 1);
}

export function movePrevMonth(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateEnabled, -1);
}

export function moveMonthDown(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateEnabled, 3);
}

export function moveMonthUp(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return moveMonth(startDate, isDateEnabled, -3);
}

// Returns first enabled date of the month corresponding to the given date.
// If all month's days are disabled, the first day of the month is returned.
export function getBaseDay(date: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return getBaseDate({ date, isDateEnabled, granularity: 'day' });
}

// Returns first enabled month of the year corresponding to the given date.
// If all year's months are disabled, the first month of the year is returned.
export function getBaseMonth(date: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction) {
  return getBaseDate({ date, isDateEnabled, granularity: 'month' });
}

function getBaseDate({
  date,
  granularity,
  isDateEnabled,
}: {
  date: Date;
  granularity: CalendarProps.Granularity;
  isDateEnabled: CalendarProps.IsDateEnabledFunction;
}) {
  const isMonthGranularity = granularity === 'month';
  const getStartDate = isMonthGranularity ? startOfYear : startOfMonth;
  const moveDate = isMonthGranularity ? moveMonth : moveDay;
  const isSamePage = isMonthGranularity ? isSameYear : isSameMonth;

  const startDate = getStartDate(date);
  if (isDateEnabled(startDate)) {
    return startDate;
  }
  const firstEnabledDate = moveDate(startDate, isDateEnabled, 1);
  return isSamePage(startDate, firstEnabledDate) ? firstEnabledDate : startDate;
}

// Iterates days forwards or backwards until the next active day is found.
// If there is no active day in a year range, the start day is returned.
function moveDay(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction, step: number): Date {
  return moveDate({ startDate, granularity: 'day', isDateEnabled, step });
}

// Iterates months forwards or backwards until the next active month is found.
// If there is no active month in a 10 year range, the start month is returned.
function moveMonth(startDate: Date, isDateEnabled: CalendarProps.IsDateEnabledFunction, step: number): Date {
  return moveDate({ startDate, granularity: 'month', isDateEnabled, step });
}

function moveDate({
  startDate,
  granularity,
  isDateEnabled,
  step,
}: {
  startDate: Date;
  granularity: CalendarProps.Granularity;
  isDateEnabled: CalendarProps.IsDateEnabledFunction;
  step: number;
}) {
  const isMonthGranularity = granularity === 'month';
  const addSteps = isMonthGranularity ? addMonths : addDays;
  const limitYears = isMonthGranularity ? 1 : 10;

  let current = addSteps(startDate, step);

  while (!isDateEnabled(current)) {
    if (Math.abs(differenceInYears(startDate, current)) > limitYears) {
      return startDate;
    }
    current = addSteps(current, step);
  }

  return current;
}
