// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addYears, startOfMonth, subYears } from 'date-fns';

import { getBaseDay, moveDay, moveNextDay, moveNextWeek, movePrevDay, movePrevWeek } from '../navigation-day';

//mocked to avoid complications with timezones in the 'date-fns' package
jest.mock('date-fns', () => ({ ...jest.requireActual('date-fns'), startOfMonth: () => new Date('2025-01-01') }));

const startDate = new Date(`2022-01-15`);

function disableDates(...blockedDates: string[]) {
  return (date: Date) => blockedDates.every(blocked => new Date(blocked).getTime() !== date.getTime());
}

describe('getBaseDay', () => {
  const baseDate = new Date('2024-04-15');

  test('returns first day of month when it is focusable', () => {
    const isDateFocusable = () => true; // All days are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(startOfMonth(baseDate));
  });

  test('returns first focusable day within the same month', () => {
    const isDateFocusable = (date: Date) => date.getDate() === 5; // Only the 5th of each month is focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(new Date('2025-01-05')); //5th of month after mock
  });

  test('returns first day of month when no days are focusable', () => {
    const isDateFocusable = () => false; // No days are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(new Date(`2025-01-01`)); //start of year of mock
  });

  test('returns first day of month when first focusable day is in next month', () => {
    const isDateFocusable = (date: Date) => date >= new Date('2024-05-01'); // Only days from May 1, 2024 are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(startOfMonth(baseDate));
  });

  test('handles custom isDateFocusable function', () => {
    const isDateFocusable = (date: Date) => date.getDay() === 1; // Only Mondays are focusable
    const result = getBaseDay(baseDate, isDateFocusable);
    expect(result).toEqual(new Date('2025-01-06')); //first monday after mock
    expect(result.getDay()).toEqual(1);
  });

  test('works with dates at the start of the month', () => {
    const startOfMonthDate = new Date('2024-04-01');
    const isDateFocusable = (date: Date) => date.getDate() === 3; // Only the 3rd of each month is focusable
    const result = getBaseDay(startOfMonthDate, isDateFocusable);
    expect(result).toEqual(new Date('2025-01-03')); // first 3rd day after mock
  });

  test('works with dates at the end of the month', () => {
    const endOfMonthDate = new Date('2024-04-30');
    const isDateFocusable = (date: Date) => date.getDate() === 28; // Only the 28th of each month is focusable
    const result = getBaseDay(endOfMonthDate, isDateFocusable);
    expect(result).toEqual(new Date('2025-01-28')); // April 28, 2024
  });
});

describe('moveDay', () => {
  const baseDate = new Date('2024-01-15');

  test('moves forward to the next active day', () => {
    const isDateFocusable = (date: Date) => date.getDate() === 20; // Only the 20th of each month is active
    const result = moveDay(baseDate, isDateFocusable, 1);
    expect(result).toEqual(new Date('2024-01-20'));
  });

  test('moves backward to the previous active day', () => {
    const isDateFocusable = (date: Date) => date.getDate() === 10; // Only the 10th of each month is active
    const result = moveDay(baseDate, isDateFocusable, -1);
    expect(result).toEqual(new Date('2024-01-10'));
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
    const oneYearLater = addYears(baseDate, 1);
    const oneYearEarlier = subYears(baseDate, 1);

    const isDateFocusable = (date: Date) =>
      date.getTime() === oneYearLater.getTime() || date.getTime() === oneYearEarlier.getTime();

    const forwardResult = moveDay(baseDate, isDateFocusable, 1);
    expect(forwardResult).toEqual(oneYearLater);

    const backwardResult = moveDay(baseDate, isDateFocusable, -1);
    expect(backwardResult).toEqual(oneYearEarlier);
  });

  test('handles custom isDateFocusable function', () => {
    const isDateFocusable = (date: Date) => date.getDay() === 1; // Only Mondays are active
    const result = moveDay(baseDate, isDateFocusable, 1);
    expect(result).toEqual(new Date('2024-01-22'));
    expect(result.getDay()).toEqual(1);
  });

  test('moves multiple steps forward', () => {
    const isDateFocusable = (date: Date) => date.getDate() % 5 === 0; // Every 5th day is active
    const result = moveDay(baseDate, isDateFocusable, 3);
    expect(result).toEqual(new Date('2024-01-30'));
  });

  test('moves multiple steps backward', () => {
    const isDateFocusable = (date: Date) => date.getDate() % 5 === 0; // Every 5th day is active
    const result = moveDay(baseDate, isDateFocusable, -3);
    expect(result).toEqual(new Date('2023-12-25'));
  });
});

test('moveNextDay', () => {
  expect(moveNextDay(startDate, () => true)).toEqual(new Date('2022-01-16'));
  expect(moveNextDay(startDate, disableDates('2022-01-16', '2022-01-17'))).toEqual(new Date('2022-01-18'));
});

test('movePrevDay', () => {
  expect(movePrevDay(startDate, () => true)).toEqual(new Date('2022-01-14'));
  expect(movePrevDay(startDate, disableDates('2022-01-14', '2022-01-13'))).toEqual(new Date('2022-01-12'));
});

test('moveNextWeek', () => {
  expect(moveNextWeek(startDate, () => true)).toEqual(new Date('2022-01-22'));
  expect(moveNextWeek(startDate, disableDates('2022-01-22', '2022-01-29'))).toEqual(new Date('2022-02-05'));
});

test('movePrevWeek', () => {
  expect(movePrevWeek(startDate, () => true)).toEqual(new Date('2022-01-08'));
  expect(movePrevWeek(startDate, disableDates('2022-01-08', '2022-01-01'))).toEqual(new Date('2021-12-25'));
});
