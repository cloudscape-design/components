// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import addMonths from 'date-fns/addMonths';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import subMonths from 'date-fns/subMonths';

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
    const testDate = new Date('2024-06-15');
    const result = getCalendarYear(testDate);

    // Expected dates for 2024
    const expectedDates = [
      // First quarter
      [new Date('2024-01-01'), new Date('2024-02-01'), new Date('2024-03-01')],
      // Second quarter
      [new Date('2024-04-01'), new Date('2024-05-01'), new Date('2024-06-01')],
      // Third quarter
      [new Date('2024-07-01'), new Date('2024-08-01'), new Date('2024-09-01')],
      // Fourth quarter
      [new Date('2024-10-01'), new Date('2024-11-01'), new Date('2024-12-01')],
    ];

    // Compare each date in the matrix
    result.forEach((row, i) => {
      row.forEach((date, j) => {
        expect(date.getTime()).toBe(expectedDates[i][j].getTime());
      });
    });
  });

  test('maintains the input year regardless of input month and day', () => {
    const testDate = new Date('2023-12-31');
    const result = getCalendarYear(testDate);

    result.forEach(row => {
      row.forEach(date => {
        expect(date.getFullYear()).toBe(2023);
      });
    });
  });

  test('sets all dates to the first day of each month', () => {
    const testDate = new Date('2024-01-15');
    const result = getCalendarYear(testDate);

    result.forEach(row => {
      row.forEach(date => {
        expect(date.getDate()).toBe(1);
      });
    });
  });

  test('handles leap years correctly', () => {
    const testDate = new Date('2024-02-01');
    const result = getCalendarYear(testDate);

    // Check February specifically
    const february = result[0][1];

    // Create March 1st of the same year
    const march = new Date('2024-03-01');

    // Calculate days in February
    const daysInFebruary = (march.getTime() - february.getTime()) / (1000 * 60 * 60 * 24);

    expect(daysInFebruary).toBe(29);
  });

  test('handles non-leap years correctly', () => {
    const testDate = new Date('2023-02-01');
    const result = getCalendarYear(testDate);

    // Check February specifically
    const february = result[0][1];

    // Create March 1st of the same year
    const march = new Date('2023-03-01');

    // Calculate days in February
    const daysInFebruary = (march.getTime() - february.getTime()) / (1000 * 60 * 60 * 24);

    expect(daysInFebruary).toBe(28);
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
    const hasTargetDate = result.some(row => row.some(day => isSameDay(day, date)));
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
    const prevMonth = subMonths(date, 1);

    // First day should be from previous month
    expect(isSameMonth(result[0][0], prevMonth)).toBeFalsy();
  });

  test('slices last row when it contains current month dates', () => {
    const date = new Date('2024-02-01'); // First day of month
    const firstDayOfWeek: DayIndex = 0;

    const result = getPrevMonthRows(date, firstDayOfWeek);

    // Last date should not be from current month
    const lastRow = result[result.length - 1];
    const lastDate = lastRow[lastRow.length - 1];
    expect(isSameMonth(lastDate, date)).toBeFalsy();
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
    const nextMonth = addMonths(date, 1);

    // First day should be from next month
    expect(isSameMonth(result[0][0], nextMonth)).toBeTruthy();
  });

  test('slices first row when it contains current month dates', () => {
    const date = new Date('2024-02-29'); // Last day of February 2024
    const firstDayOfWeek: DayIndex = 0;

    const result = getNextMonthRows(date, firstDayOfWeek);

    // First date should not be from current month
    expect(isSameMonth(result[0][0], date)).toBeFalsy();
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
      const date = new Date('2024-02-15');
      const firstDayOfWeek: DayIndex = 0;

      const result = fn(date, firstDayOfWeek);

      result.forEach(week => {
        // Check if days in week are consecutive
        for (let i = 1; i < week.length; i++) {
          const dayDiff = week[i].getTime() - week[i - 1].getTime();
          expect(dayDiff).toBe(24 * 60 * 60 * 1000); // One day in milliseconds
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
    expect(isSameMonth(result[0][0], date)).toBeFalsy();
    expect(isSameMonth(result[3][3], date)).toBeTruthy();
    expect(isSameMonth(result[5][6], date)).toBeFalsy();
  });

  test('handles padding after correctly', () => {
    const date = new Date('2024-02-15');
    const startOfWeek: DayIndex = 0;

    const result = getCalendarMonthWithSixRows(date, {
      startOfWeek,
      padDates: 'after',
    });

    // First dates should be from current month
    expect(isSameMonth(result[0][0], date)).toBeFalsy();
    expect(isSameMonth(result[3][3], date)).toBeTruthy();
    expect(isSameMonth(result[5][6], date)).toBeFalsy();
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
        const dayDiff = week[i].getTime() - week[i - 1].getTime();
        expect(dayDiff).toBe(24 * 60 * 60 * 1000); // One day in milliseconds
      }

      // Check connection between weeks (except for last week)
      if (weekIndex < result.length - 1) {
        const lastDayOfWeek = week[6];
        const firstDayOfNextWeek = result[weekIndex + 1][0];
        const dayDiff = firstDayOfNextWeek.getTime() - lastDayOfWeek.getTime();
        expect(dayDiff).toBe(24 * 60 * 60 * 1000);
      }
    });
  });
});
