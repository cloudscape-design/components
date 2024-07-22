// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addDays, addMonths, differenceInYears, isSameMonth, isSameYear, startOfMonth, startOfYear } from 'date-fns';

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

// Returns first enabled date of the month corresponding to the given date.
// If all month's days are disabled, the first day of the month is returned.
export function getBaseDay(date: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return getBaseDate({ date, isDateFocusable, granularity: 'day' });
}

// Returns first enabled month of the year corresponding to the given date.
// If all year's months are disabled, the first month of the year is returned.
export function getBaseMonth(date: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction) {
  return getBaseDate({ date, isDateFocusable, granularity: 'month' });
}

function getBaseDate({
  date,
  granularity,
  isDateFocusable,
}: {
  date: Date;
  granularity: CalendarProps.Granularity;
  isDateFocusable: CalendarProps.IsDateEnabledFunction;
}) {
  const isMonthGranularity = granularity === 'month';
  const getStartDate = isMonthGranularity ? startOfYear : startOfMonth;
  const moveDate = isMonthGranularity ? moveMonth : moveDay;
  const isSamePage = isMonthGranularity ? isSameYear : isSameMonth;

  const startDate = getStartDate(date);
  if (isDateFocusable(startDate)) {
    return startDate;
  }
  const firstEnabledDate = moveDate(startDate, isDateFocusable, 1);
  return isSamePage(startDate, firstEnabledDate) ? firstEnabledDate : startDate;
}

// Iterates days forwards or backwards until the next active day is found.
// If there is no active day in a year range, the start day is returned.
function moveDay(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction, step: number): Date {
  return moveDate({ startDate, granularity: 'day', isDateFocusable, step });
}

// Iterates months forwards or backwards until the next active month is found.
// If there is no active month in a 10 year range, the start month is returned.
function moveMonth(startDate: Date, isDateFocusable: CalendarProps.IsDateEnabledFunction, step: number): Date {
  return moveDate({ startDate, granularity: 'month', isDateFocusable, step });
}

function moveDate({
  startDate,
  granularity,
  isDateFocusable,
  step,
}: {
  startDate: Date;
  granularity: CalendarProps.Granularity;
  isDateFocusable: CalendarProps.IsDateEnabledFunction;
  step: number;
}) {
  const isMonthGranularity = granularity === 'month';
  const addSteps = isMonthGranularity ? addMonths : addDays;
  const limitYears = isMonthGranularity ? 1 : 10;

  let current = addSteps(startDate, step);

  while (!isDateFocusable(current)) {
    if (Math.abs(differenceInYears(startDate, current)) > limitYears) {
      return startDate;
    }
    current = addSteps(current, step);
  }

  return current;
}
