// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';
import { getCalendarMonth } from 'mnth';

import { DayIndex } from '../locale';

// Returns a 3-by-4 matrix with dates corresponding to the initial date-time of each month of the year for a given date.
export function getCalendarYear(date: Date): Date[][] {
  const year = date.getFullYear();
  return new Array(4)
    .fill(0)
    .map((_, i: number) => new Array(3).fill(0).map((_, j: number) => new Date(year, i * 3 + j)));
}

export interface CalendarDate {
  /**
   * could represent one day or or one complete month depending on the type of calendar
   */
  date: Date;
  isVisible: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isSelectionTop: boolean;
  isSelectionBottom: boolean;
  isSelectionLeft: boolean;
  isSelectionRight: boolean;
}
export interface CalendarWeek {
  days: CalendarDate[];
  testIndex?: number;
}

export interface CalendarQuarter {
  months: CalendarDate[];
}

export class MonthCalendar {
  padDates: 'before' | 'after';
  weekdays: number[];
  weeks: CalendarWeek[];
  range: [Date, Date];

  constructor({
    padDates,
    baseDate,
    startOfWeek,
    selection,
  }: {
    padDates: 'before' | 'after';
    baseDate: Date;
    startOfWeek: DayIndex;
    selection: null | [Date, Date];
  }) {
    this.padDates = padDates;
    this.weeks = [];
    this.range = [baseDate, baseDate];

    const allCalendarDates = getCalendarMonthWithSixRows(baseDate, { startOfWeek, padDates });
    this.weekdays = allCalendarDates[0].map(date => date.getDay());

    const isDateVisible = (weekIndex: number, dayIndex: number) => {
      const week = allCalendarDates[weekIndex];
      const date = week?.[dayIndex];
      if (!date) {
        return false;
      }
      switch (padDates) {
        case 'before':
          return dayjs(date).isSame(baseDate, 'month') || dayjs(date).isBefore(baseDate);
        case 'after':
          return dayjs(date).isSame(baseDate, 'month') || dayjs(date).isAfter(baseDate);
      }
    };

    const isDateInRange = (weekIndex: number, dayIndex: number) => {
      const week = allCalendarDates[weekIndex];
      const date = week?.[dayIndex];
      return !!(date && selection && checkDateIsInRange(date, selection[0], selection[1]));
    };

    // The test index is only set for weeks that have at least one day that belongs to the current month.
    // It starts from the first such week and counts from 1.
    const getWeekTestIndex = (weekIndex: number): undefined | number => {
      const week = allCalendarDates[weekIndex];
      if (!week) {
        return undefined;
      }
      if (!dayjs(week[0]).isSame(baseDate, 'month') && !dayjs(week[week.length - 1]).isSame(baseDate, 'month')) {
        return undefined;
      }
      return (getWeekTestIndex(weekIndex - 1) ?? 0) + 1;
    };

    for (let weekIndex = 0; weekIndex < allCalendarDates.length; weekIndex++) {
      const daysOfWeek = allCalendarDates[weekIndex];
      const week: CalendarWeek = { days: [], testIndex: getWeekTestIndex(weekIndex) };

      for (let dayIndex = 0; dayIndex < daysOfWeek.length; dayIndex++) {
        const date = daysOfWeek[dayIndex];
        const isVisible = isDateVisible(weekIndex, dayIndex);
        const isSelected = !!(
          selection &&
          (dayjs(date).isSame(selection[0], 'day') || dayjs(date).isSame(selection[1], 'day'))
        );
        const isInRange = isDateInRange(weekIndex, dayIndex);
        const isTop = isVisible && !isDateVisible(weekIndex - 1, dayIndex);
        const isBottom = isVisible && !isDateVisible(weekIndex + 1, dayIndex);
        const isLeft = isVisible && !isDateVisible(weekIndex, dayIndex - 1);
        const isRight = isVisible && !isDateVisible(weekIndex, dayIndex + 1);
        const isRangeTop = isInRange && !isDateInRange(weekIndex - 1, dayIndex);
        const isRangeBottom = isInRange && !isDateInRange(weekIndex + 1, dayIndex);
        const isRangeLeft = isInRange && !isDateInRange(weekIndex, dayIndex - 1);
        const isRangeRight = isInRange && !isDateInRange(weekIndex, dayIndex + 1);

        week.days.push({
          date,
          isVisible,
          isSelected,
          isInRange,
          isSelectionTop: isTop || isRangeTop,
          isSelectionBottom: isBottom || isRangeBottom,
          isSelectionLeft: isLeft || isRangeLeft,
          isSelectionRight: isRight || isRangeRight,
        });
      }
      this.weeks.push(week);
    }
  }
}

export class YearCalendar {
  quarters: CalendarQuarter[];
  range: [Date, Date];

  constructor({ baseDate, selection }: { baseDate: Date; selection: null | [Date, Date] }) {
    this.quarters = [];
    this.range = [baseDate, baseDate];

    const allCalendarMonths = getCalendarYear(baseDate);

    const isMonthInRange = (quarterIndex: number, monthIndex: number) => {
      const quarter = allCalendarMonths[quarterIndex];
      const month = quarter?.[monthIndex];
      return !!(month && selection && checkMonthIsInRange(month, selection[0], selection[1]));
    };

    const isMonthVisible = (quarterIndex: number, monthIndex: number) => {
      const quarter = allCalendarMonths[quarterIndex];
      const month = quarter?.[monthIndex];
      if (!month) {
        return false;
      }
      return dayjs(month).isSame(baseDate, 'year');
    };

    for (let quarterIndex = 0; quarterIndex < allCalendarMonths.length; quarterIndex++) {
      const monthsOfQuarter = allCalendarMonths[quarterIndex];
      const quarter: CalendarQuarter = { months: [] };

      for (let monthIndex = 0; monthIndex < monthsOfQuarter.length; monthIndex++) {
        const month = monthsOfQuarter[monthIndex];
        const isVisible = isMonthVisible(quarterIndex, monthIndex);
        const isSelected = !!(
          selection &&
          (dayjs(month).isSame(selection[0], 'month') || dayjs(month).isSame(selection[1], 'month'))
        );
        const isInRange = isMonthInRange(quarterIndex, monthIndex);
        const isTop = isVisible && !isMonthVisible(quarterIndex - 1, monthIndex);
        const isBottom = isVisible && !isMonthVisible(quarterIndex + 1, monthIndex);
        const isLeft = isVisible && !isMonthVisible(quarterIndex, monthIndex - 1);
        const isRight = isVisible && !isMonthVisible(quarterIndex, monthIndex + 1);
        const isRangeTop = isInRange && !isMonthInRange(quarterIndex - 1, monthIndex);
        const isRangeBottom = isInRange && !isMonthInRange(quarterIndex + 1, monthIndex);
        const isRangeLeft = isInRange && !isMonthInRange(quarterIndex, monthIndex - 1);
        const isRangeRight = isInRange && !isMonthInRange(quarterIndex, monthIndex + 1);

        quarter.months.push({
          date: month,
          isVisible,
          isSelected,
          isInRange,
          isSelectionTop: isTop || isRangeTop,
          isSelectionBottom: isBottom || isRangeBottom,
          isSelectionLeft: isLeft || isRangeLeft,
          isSelectionRight: isRight || isRangeRight,
        });
      }
      this.quarters.push(quarter);
    }
  }
}

export function getCalendarMonthWithSixRows(
  date: Date,
  { startOfWeek, padDates }: { startOfWeek: DayIndex; padDates: 'before' | 'after' }
) {
  switch (padDates) {
    case 'before':
      return [...getPrevMonthRows(date, startOfWeek), ...getCurrentMonthRows(date, startOfWeek)].slice(-6);
    case 'after':
      return [...getCurrentMonthRows(date, startOfWeek), ...getNextMonthRows(date, startOfWeek)].slice(0, 6);
  }
}

function checkDateIsInRange(date: Date, dateOne: Date | null, dateTwo: Date | null) {
  if (!dateOne || !dateTwo || dayjs(dateOne).isSame(dateTwo, 'day')) {
    return false;
  }

  const inRange =
    (dayjs(date).isAfter(dateOne) && dayjs(date).isBefore(dateTwo)) ||
    (dayjs(date).isAfter(dateTwo) && dayjs(date).isBefore(dateOne));

  return inRange || dayjs(date).isSame(dateOne, 'day') || dayjs(date).isSame(dateTwo, 'day');
}

function checkMonthIsInRange(date: Date, dateOne: Date | null, dateTwo: Date | null) {
  if (!dateOne || !dateTwo || dayjs(dateOne).isSame(dateTwo, 'month')) {
    return false;
  }

  const inRange =
    (dayjs(date).isAfter(dateOne) && dayjs(date).isBefore(dateTwo)) ||
    (dayjs(date).isAfter(dateTwo) && dayjs(date).isBefore(dateOne));

  return inRange || dayjs(date).isSame(dateOne, 'month') || dayjs(date).isSame(dateTwo, 'month');
}

export function getCurrentMonthRows(date: Date, firstDayOfWeek: DayIndex) {
  return getCalendarMonth(date, { firstDayOfWeek });
}

export function getPrevMonthRows(date: Date, firstDayOfWeek: DayIndex) {
  const rows = getCalendarMonth(dayjs(date).subtract(1, 'month').toDate(), { firstDayOfWeek });
  const lastDay = rows[rows.length - 1][rows[rows.length - 1].length - 1];
  return !dayjs(date).isSame(lastDay, 'month') ? rows : rows.slice(0, -1);
}

export function getNextMonthRows(date: Date, firstDayOfWeek: DayIndex) {
  const rows = getCalendarMonth(dayjs(date).add(1, 'month').toDate(), { firstDayOfWeek });
  const firstDay = rows[0][0];
  return !dayjs(date).isSame(firstDay, 'month') ? rows : rows.slice(1);
}
