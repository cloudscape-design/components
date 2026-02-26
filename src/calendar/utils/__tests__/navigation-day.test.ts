// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import dayjs from 'dayjs';

import { getBaseDay, moveDay, moveNextDay, moveNextWeek, movePrevDay, movePrevWeek } from '../navigation-day';

//mocked to avoid complications with timezones in the dayjs package
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  return originalDayjs;
});

const startDate = new Date(2022, 0, 15); // January 15, 2022 in local time

test('moveNextDay', () => {
  expect(moveNextDay(startDate, () => true)).toEqual(new Date(2022, 0, 16)); // January 16, 2022
});

describe('getBaseDay', () => {
  const baseDate = new Date(2024, 3, 15); // April 15, 2024 in local time

  test('returns first day of month when it is focusable', () => {
    const isDateFocusable = () => true; // All days are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(dayjs(baseDate).startOf('month').toDate());
  });

  test('returns first focusable day within the same month', () => {
    const isDateFocusable = (date: Date) => date.getDate() === 5; // Only the 5th of each month is focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(new Date(2024, 3, 5)); // April 5, 2024
  });

  test('returns first day of month when no days are focusable', () => {
    const isDateFocusable = () => false; // No days are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(new Date(2024, 3, 1)); // April 1, 2024
  });

  test('returns first day of month when first focusable day is in next month', () => {
    const isDateFocusable = (date: Date) => date >= new Date(2024, 4, 1); // Only days from May 1, 2024 are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(dayjs(baseDate).startOf('month').toDate());
  });

  test('handles custom isDateFocusable function', () => {
    const isDateFocusable = (date: Date) => date.getDay() === 1; // Only Mondays are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(new Date(2024, 3, 1)); // April 1, 2024 (Monday)
    expect(result.getDay()).toEqual(1);
  });

  test('works with dates at the start of the month', () => {
    const startOfMonthDate = new Date(2024, 3, 1); // April 1, 2024
    const isDateFocusable = (date: Date) => date.getDate() === 3; // Only the 3rd of each month is focusable
    const result = getBaseDay(startOfMonthDate, isDateFocusable);
    expect(result).toEqual(new Date(2024, 3, 3)); // April 3, 2024
  });

  test('works with dates at the end of the month', () => {
    const endOfMonthDate = new Date(2024, 3, 30); // April 30, 2024
    const isDateFocusable = (date: Date) => date.getDate() === 28; // Only the 28th of each month is focusable
    const result = getBaseDay(endOfMonthDate, isDateFocusable);
    expect(result).toEqual(new Date(2024, 3, 28)); // April 28, 2024
  });
});

describe('moveDay', () => {
  const baseDate = new Date(2024, 0, 15); // January 15, 2024

  test('moves forward to the next active day', () => {
    const isDateFocusable = (date: Date) => date.getDate() === 20; // Only the 20th of each month is active
    const result = moveDay(baseDate, isDateFocusable, 1);
    expect(result).toEqual(new Date(2024, 0, 20)); // January 20, 2024
  });

  test('moves backward to the previous active day', () => {
    const isDateFocusable = (date: Date) => date.getDate() === 10; // Only the 10th of each month is active
    const result = moveDay(baseDate, isDateFocusable, -1);
    expect(result).toEqual(new Date(2024, 0, 10)); // January 10, 2024
  });

  test('returns start date if no active day found within 1 year forward', () => {
    const isDateFocusable = () => false; // No days are active
    const result = moveDay(baseDate, isDateFocusable, 1);
    expect(result).toEqual(baseDate);
  });

  test('returns start date if no active day found within 1 year backward', () => {
    const isDateFocusable = () => false; // No days are active
    const result = moveDay(baseDate, isDateFocusable, -1);
    expect(result).toEqual(baseDate);
  });

  test('finds active day at the edge of 1 year limit', () => {
    const oneYearLater = dayjs(baseDate).add(1, 'year').toDate();
    const oneYearEarlier = dayjs(baseDate).subtract(1, 'year').toDate();

    const isDateFocusable = (date: Date) =>
      date.getTime() === oneYearLater.getTime() || date.getTime() === oneYearEarlier.getTime();

    const forwardResult = moveDay(baseDate, isDateFocusable, 1);
    expect(forwardResult).toEqual(oneYearLater);

    const backwardResult = moveDay(baseDate, isDateFocusable, -1);
    expect(backwardResult).toEqual(oneYearEarlier);
  });

  test('handles custom isDateFocusable function', () => {
    const isDateFocusable = (date: Date) => date.getDay() === 0; // Only Sundays are active
    const result = moveDay(baseDate, isDateFocusable, 1);
    expect(result.getDay()).toEqual(0);
  });

  test('moves multiple steps forward', () => {
    const isDateFocusable = (date: Date) => date.getDate() % 5 === 0; // Days divisible by 5 are active
    const result = moveDay(baseDate, isDateFocusable, 1);
    expect(result).toEqual(new Date(2024, 0, 20)); // January 20, 2024
  });

  test('moves multiple steps backward', () => {
    const isDateFocusable = (date: Date) => date.getDate() % 5 === 0; // Days divisible by 5 are active
    const result = moveDay(baseDate, isDateFocusable, -1);
    expect(result).toEqual(new Date(2024, 0, 10)); // January 10, 2024
  });
});

test('movePrevDay', () => {
  expect(movePrevDay(startDate, () => true)).toEqual(new Date(2022, 0, 14)); // January 14, 2022
});

test('moveNextWeek', () => {
  expect(moveNextWeek(startDate, () => true)).toEqual(new Date(2022, 0, 22)); // January 22, 2022
});

test('movePrevWeek', () => {
  expect(movePrevWeek(startDate, () => true)).toEqual(new Date(2022, 0, 8)); // January 8, 2022
});
