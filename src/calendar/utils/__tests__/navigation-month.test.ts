// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addYears, subYears } from 'date-fns';

import { getBaseMonth, moveMonth } from '../navigation-month';

//mocked to avoid complications with timezones in the 'date-fns' package
jest.mock('date-fns', () => ({ ...jest.requireActual('date-fns'), startOfYear: () => new Date('2025-01-01') }));

const startYear = '2022',
  startMonth = '01',
  startDay = '15';
const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);

function disableMonths(...blockedDates: string[]) {
  return (date: Date) => blockedDates.every(blocked => new Date(blocked).getMonth() !== date.getMonth());
}

describe('moveMonth', () => {
  const baseDate = new Date('2024-01-01');
  4;

  test('moves forward to the next active month', () => {
    const isDateFocusable = (date: Date) => date.getMonth() === 2; // Only March is active
    const result = moveMonth(baseDate, isDateFocusable, 1);
    expect(result).toEqual(new Date('2024-03-01'));
  });

  test('moves backward to the previous active month', () => {
    const isDateFocusable = (date: Date) => date.getMonth() === 10; // Only November is active
    const result = moveMonth(baseDate, isDateFocusable, -1);
    expect(result).toEqual(new Date('2023-11-01')); // November 1, 2023
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
    //set to match mock above
    const tenYearsLater = addYears(new Date('2025-01-01'), 10);
    const tenYearsEarlier = subYears(new Date('2025-01-01'), 10);

    const isDateFocusable = (date: Date) =>
      date.getTime() === tenYearsLater.getTime() || date.getTime() === tenYearsEarlier.getTime();

    const forwardResult = moveMonth(baseDate, isDateFocusable, 1);
    expect(forwardResult).toEqual(tenYearsLater);

    const backwardResult = moveMonth(baseDate, isDateFocusable, -1);
    expect(backwardResult).toEqual(tenYearsEarlier);
  });
});

test('getBaseMonth', () => {
  expect(getBaseMonth(startDate, () => true)).toEqual(new Date('2025-01-01')); //match mocked date
  expect(getBaseMonth(startDate, disableMonths('2022-01', '2022-02'))).toEqual(new Date('2025-03')); //match first after mocked date
  expect(getBaseMonth(startDate, () => false)).toEqual(new Date('2025-01-01'));
});
