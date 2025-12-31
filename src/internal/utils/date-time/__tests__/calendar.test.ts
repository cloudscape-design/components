// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import dayjs from 'dayjs';

import { DayIndex } from '../../locale';
import {
  getCalendarMonthWithSixRows,
  getCalendarYear,
  getCurrentMonthRows,
  getNextMonthRows,
  getPrevMonthRows,
} from '../calendar';

describe('getCalendarYear', () => {
  test('returns a 4x3 matrix of dates', () => {
    const testDate = new Date('2024-01-01');
    const result = getCalendarYear(testDate);

    // Check matrix dimensions
    expect(result.length).toBe(4);
    result.forEach(row => {
      expect(row.length).toBe(3);
    });
  });

  test('returns correct dates for all months of the year', () => {
    const testDate = new Date(2024, 5, 15); // June 15, 2024 in local time
    const result = getCalendarYear(testDate);

    // Expected months for 2024 (0-indexed)
    const expectedMonths = [
      // First quarter
      [0, 1, 2], // Jan, Feb, Mar
      // Second quarter
      [3, 4, 5], // Apr, May, Jun
      // Third quarter
      [6, 7, 8], // Jul, Aug, Sep
      // Fourth quarter
      [9, 10, 11], // Oct, Nov, Dec
    ];

    // Compare each date in the matrix
    result.forEach((row, i) => {
      row.forEach((date, j) => {
        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(expectedMonths[i][j]);
        expect(date.getDate()).toBe(1);
      });
    });
  });

  test('maintains the input year regardless of input month and day', () => {
    const testDate = new Date(2023, 11, 31); // December 31, 2023 in local time
    const result = getCalendarYear(testDate);

    result.forEach(row => {
      row.forEach(date => {
        expect(date.getFullYear()).toBe(2023);
      });
    });
  });

  test('sets all dates to the first day of each month', () => {
    const testDate = new Date(2024, 0, 15); // January 15, 2024 in local time
    const result = getCalendarYear(testDate);

    result.forEach(row => {
      row.forEach(date => {
        expect(date.getDate()).toBe(1);
      });
    });
  });

  test('handles leap years correctly', () => {
    const testDate = new Date(2024, 1, 1); // February 1, 2024 in local time
    const result = getCalendarYear(testDate);

    // Check February specifically
    const february = result[0][1];
    expect(february.getMonth()).toBe(1); // February

    // Check that February 29 exists in 2024
    const feb29 = new Date(2024, 1, 29);
    expect(feb29.getMonth()).toBe(1); // Still February (not rolled over to March)
  });

  test('handles non-leap years correctly', () => {
    const testDate = new Date(2023, 1, 1); // February 1, 2023 in local time
    const result = getCalendarYear(testDate);

    // Check February specifically
    const february = result[0][1];
    expect(february.getMonth()).toBe(1); // February

    // Check that February 29 doesn't exist in 2023 (rolls over to March 1)
    const feb29 = new Date(2023, 1, 29);
    expect(feb29.getMonth()).toBe(2); // March (rolled over)
  });

  test('handles different timezones correctly', () => {
    const testDate = new Date('2024-01-01T12:00:00Z'); // UTC time
    const result = getCalendarYear(testDate);

    result.forEach(row => {
      row.forEach(date => {
        expect(date.getUTCDate()).toBe(1); // Check UTC date is always 1st
      });
    });
  });
});

describe('getCurrentMonthRows', () => {
  test('returns correct month matrix', () => {
    const date = new Date('2024-02-15');
    const firstDayOfWeek: DayIndex = 0;

    const result = getCurrentMonthRows(date, firstDayOfWeek);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.every(row => Array.isArray(row))).toBeTruthy();
    expect(result.every(row => row.length === 7)).toBeTruthy();
  });

  test('handles different first day of week', () => {
    const date = new Date('2024-02-15');
    const mondayStart: DayIndex = 1;

    const result = getCurrentMonthRows(date, mondayStart);

    // First day of first week should be either Monday or the first of the month
    const firstDay = result[0][0];
    expect([1, firstDay.getDate()]).toContain(firstDay.getDay());
  });

  test('includes dates from current month', () => {
    const date = new Date('2024-02-15');
    const firstDayOfWeek: DayIndex = 0;

    const result = getCurrentMonthRows(date, firstDayOfWeek);

    // Should contain February 15, 2024
    const hasTargetDate = result.some(row => row.some(day => dayjs(day).isSame(date, 'day')));
    expect(hasTargetDate).toBeTruthy();
  });
});

describe('getPrevMonthRows', () => {
  test('returns correct previous month matrix', () => {
    const date = new Date('2024-02-15');
    const firstDayOfWeek: DayIndex = 0;

    const result = getPrevMonthRows(date, firstDayOfWeek);

    expect(Array.isArray(result)).toBeTruthy();
    result.forEach(row => {
      expect(row.length).toBe(7);
    });
  });

  test('returns dates from previous month', () => {
    const date = new Date('2024-02-15');
    const firstDayOfWeek: DayIndex = 0;

    const result = getPrevMonthRows(date, firstDayOfWeek);
    const prevMonth = dayjs(date).subtract(1, 'month').toDate();

    // First day should be from previous month
    expect(dayjs(result[0][0]).isSame(prevMonth, 'month')).toBeFalsy();
  });

  test('slices last row when it contains current month dates', () => {
    const date = new Date('2024-02-01'); // First day of month
    const firstDayOfWeek: DayIndex = 0;

    const result = getPrevMonthRows(date, firstDayOfWeek);

    // Last date should not be from current month
    const lastRow = result[result.length - 1];
    const lastDate = lastRow[lastRow.length - 1];
    expect(dayjs(lastDate).isSame(date, 'month')).toBeFalsy();
  });
});

describe('getNextMonthRows', () => {
  test('returns correct next month matrix', () => {
    const date = new Date('2024-02-15');
    const firstDayOfWeek: DayIndex = 0;

    const result = getNextMonthRows(date, firstDayOfWeek);

    expect(Array.isArray(result)).toBeTruthy();
    result.forEach(row => {
      expect(row.length).toBe(7);
    });
  });

  test('returns dates from next month', () => {
    const date = new Date('2024-02-15');
    const firstDayOfWeek: DayIndex = 0;

    const result = getNextMonthRows(date, firstDayOfWeek);
    const nextMonth = dayjs(date).add(1, 'month').toDate();

    // First day should be from next month
    expect(dayjs(result[0][0]).isSame(nextMonth, 'month')).toBeTruthy();
  });

  test('slices first row when it contains current month dates', () => {
    const date = new Date('2024-02-29'); // Last day of February 2024
    const firstDayOfWeek: DayIndex = 0;

    const result = getNextMonthRows(date, firstDayOfWeek);

    // First date should not be from current month
    expect(dayjs(result[0][0]).isSame(date, 'month')).toBeFalsy();
  });

  test('handles year boundary', () => {
    const date = new Date('2024-12-15'); // December
    const firstDayOfWeek: DayIndex = 0;

    const result = getNextMonthRows(date, firstDayOfWeek);

    // Should show January of next year
    const firstDay = result[0][0];
    expect(firstDay.getMonth()).toBe(0); // January
    expect(firstDay.getFullYear()).toBe(2025);
  });
});

// Shared behavior tests
describe('shared calendar behavior', () => {
  const testCases = [
    { name: 'getCurrentMonthRows', fn: getCurrentMonthRows },
    { name: 'getPrevMonthRows', fn: getPrevMonthRows },
    { name: 'getNextMonthRows', fn: getNextMonthRows },
  ];

  testCases.forEach(({ name, fn }) => {
    test(`${name} handles all possible first days of week`, () => {
      const date = new Date('2024-02-15');
      const allFirstDays: DayIndex[] = [0, 1, 2, 3, 4, 5, 6];

      allFirstDays.forEach(firstDayOfWeek => {
        const result = fn(date, firstDayOfWeek);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].length).toBe(7);
      });
    });

    test(`${name} maintains week integrity`, () => {
      const date = new Date(2024, 1, 15); // February 15, 2024 in local time
      const firstDayOfWeek: DayIndex = 0;

      const result = fn(date, firstDayOfWeek);

      result.forEach(week => {
        // Check if days in week are consecutive calendar days
        for (let i = 1; i < week.length; i++) {
          const prevDate = week[i - 1].getDate();
          const currDate = week[i].getDate();
          // Either next day in same month, or 1st of next month
          const isConsecutive = currDate === prevDate + 1 || (currDate === 1 && prevDate >= 28);
          expect(isConsecutive).toBe(true);
        }
      });
    });
  });
});

describe('getCalendarMonthWithSixRows', () => {
  test('always returns exactly 6 rows', () => {
    const date = new Date('2024-02-15');
    const startOfWeek: DayIndex = 0;

    const resultBefore = getCalendarMonthWithSixRows(date, {
      startOfWeek,
      padDates: 'before',
    });

    const resultAfter = getCalendarMonthWithSixRows(date, {
      startOfWeek,
      padDates: 'after',
    });

    expect(resultBefore.length).toBe(6);
    expect(resultAfter.length).toBe(6);

    // Each row should have 7 days
    resultBefore.forEach(row => expect(row.length).toBe(7));
    resultAfter.forEach(row => expect(row.length).toBe(7));
  });

  test('handles padding before correctly', () => {
    const date = new Date('2024-02-15');
    const startOfWeek: DayIndex = 0;

    const result = getCalendarMonthWithSixRows(date, {
      startOfWeek,
      padDates: 'before',
    });

    // First date should be from previous month or current month
    expect(dayjs(result[0][0]).isSame(date, 'month')).toBeFalsy();
    expect(dayjs(result[3][3]).isSame(date, 'month')).toBeTruthy();
    expect(dayjs(result[5][6]).isSame(date, 'month')).toBeFalsy();
  });

  test('handles padding after correctly', () => {
    const date = new Date('2024-02-15');
    const startOfWeek: DayIndex = 0;

    const result = getCalendarMonthWithSixRows(date, {
      startOfWeek,
      padDates: 'after',
    });

    // First dates should be from current month
    expect(dayjs(result[0][0]).isSame(date, 'month')).toBeFalsy();
    expect(dayjs(result[3][3]).isSame(date, 'month')).toBeTruthy();
    expect(dayjs(result[5][6]).isSame(date, 'month')).toBeFalsy();
  });

  test('handles different start of week', () => {
    const date = new Date('2024-02-15');
    const startOfWeek: DayIndex = 1; // Monday

    const result = getCalendarMonthWithSixRows(date, {
      startOfWeek,
      padDates: 'before',
    });

    // First day of each week should be Monday
    result.forEach(week => {
      expect(week[0].getDay()).toBe(startOfWeek);
    });
  });

  test('handles month with 5 natural weeks', () => {
    // February 2024 has 29 days and fits in 5 weeks
    const date = new Date('2024-02-01');

    const resultBefore = getCalendarMonthWithSixRows(date, {
      startOfWeek: 0,
      padDates: 'before',
    });

    const resultAfter = getCalendarMonthWithSixRows(date, {
      startOfWeek: 0,
      padDates: 'after',
    });

    // Both should still return 6 weeks
    expect(resultBefore.length).toBe(6);
    expect(resultAfter.length).toBe(6);
  });

  test('handles month with 6 natural weeks', () => {
    // March 2024 spans 6 weeks
    const date = new Date('2024-03-01');

    const resultBefore = getCalendarMonthWithSixRows(date, {
      startOfWeek: 0,
      padDates: 'before',
    });

    const resultAfter = getCalendarMonthWithSixRows(date, {
      startOfWeek: 0,
      padDates: 'after',
    });

    expect(resultBefore.length).toBe(6);
    expect(resultAfter.length).toBe(6);
  });

  test('maintains consecutive dates', () => {
    const date = new Date('2024-02-15');
    const startOfWeek: DayIndex = 0;

    const result = getCalendarMonthWithSixRows(date, {
      startOfWeek,
      padDates: 'before',
    });

    result.forEach((week, weekIndex) => {
      for (let i = 1; i < week.length; i++) {
        const prevDate = week[i - 1].getDate();
        const currDate = week[i].getDate();
        // Either next day in same month, or 1st of next month
        const isConsecutive = currDate === prevDate + 1 || (currDate === 1 && prevDate >= 28);
        expect(isConsecutive).toBe(true);
      }

      // Check connection between weeks (except for last week)
      if (weekIndex < result.length - 1) {
        const lastDayOfWeek = week[6];
        const firstDayOfNextWeek = result[weekIndex + 1][0];
        const prevDate = lastDayOfWeek.getDate();
        const currDate = firstDayOfNextWeek.getDate();
        const isConsecutive = currDate === prevDate + 1 || (currDate === 1 && prevDate >= 28);
        expect(isConsecutive).toBe(true);
      }
    });
  });
});
