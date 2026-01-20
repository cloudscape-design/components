// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import dayjs from 'dayjs';

import { getBaseMonth, moveMonth } from '../navigation-month';

//mocked to avoid complications with timezones in the dayjs package
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  return originalDayjs;
});

const startYear = '2022',
  startMonth = '01',
  startDay = '15';
const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);

function disableMonths(...blockedDates: string[]) {
  return (date: Date) => {
    const blockedMonths = blockedDates.map(blocked => {
      const [, month] = blocked.split('-');
      return parseInt(month, 10) - 1; // Convert to 0-indexed month
    });
    return !blockedMonths.includes(date.getMonth());
  };
}

describe('moveMonth', () => {
  const baseDate = new Date(2024, 0, 1); // January 1, 2024 in local time

  test('moves forward to the next active month', () => {
    const isDateFocusable = (date: Date) => date.getMonth() === 2; // Only March is active
    const result = moveMonth(baseDate, isDateFocusable, 1);
    expect(result).toEqual(new Date(2024, 2, 1)); // March 1, 2024 in local time
  });

  test('moves backward to the previous active month', () => {
    const isDateFocusable = (date: Date) => date.getMonth() === 10; // Only November is active
    const result = moveMonth(baseDate, isDateFocusable, -1);
    expect(result).toEqual(new Date(2023, 10, 1)); // November 1, 2023 in local time
  });

  test('returns start date if no active month found within 10 years forward', () => {
    const isDateFocusable = () => false; // No months are active
    const result = moveMonth(baseDate, isDateFocusable, 1);
    expect(result).toEqual(baseDate);
  });

  test('returns start date if no active month found within 10 years backward', () => {
    const isDateFocusable = () => false; // No months are active
    const result = moveMonth(baseDate, isDateFocusable, -1);
    expect(result).toEqual(baseDate);
  });

  test('finds active month at the edge of 10 year limit', () => {
    const referenceDate = new Date(2024, 0, 1);
    const tenYearsLater = dayjs(referenceDate).add(10, 'year').toDate();
    const tenYearsEarlier = dayjs(referenceDate).subtract(10, 'year').toDate();

    const isDateFocusable = (date: Date) =>
      date.getTime() === tenYearsLater.getTime() || date.getTime() === tenYearsEarlier.getTime();

    const forwardResult = moveMonth(baseDate, isDateFocusable, 1);
    expect(forwardResult).toEqual(tenYearsLater);

    const backwardResult = moveMonth(baseDate, isDateFocusable, -1);
    expect(backwardResult).toEqual(tenYearsEarlier);
  });
});

test('getBaseMonth', () => {
  expect(getBaseMonth(startDate, () => true)).toEqual(dayjs(startDate).startOf('year').toDate()); //match actual start of year
  expect(getBaseMonth(startDate, disableMonths('2022-01', '2022-02'))).toEqual(new Date(2022, 2, 1)); //March 1, 2022 in local time
  expect(getBaseMonth(startDate, () => false)).toEqual(dayjs(startDate).startOf('year').toDate());
});
