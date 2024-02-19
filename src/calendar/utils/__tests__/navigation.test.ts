// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { moveNextDay, movePrevDay, moveNextWeek, movePrevWeek, getBaseDay } from '../navigation';

jest.mock('date-fns', () => ({ ...jest.requireActual('date-fns'), startOfMonth: () => new Date('2022-01-01') }));

const startDate = new Date('2022-01-15');

function disableDates(...blockedDates: string[]) {
  return (date: Date) => blockedDates.every(blocked => new Date(blocked).getTime() !== date.getTime());
}

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

test('getBaseDay', () => {
  expect(getBaseDay(startDate, () => true)).toEqual(new Date('2022-01-01'));
  expect(getBaseDay(startDate, disableDates('2022-01-01', '2022-01-02'))).toEqual(new Date('2022-01-03'));
  expect(getBaseDay(startDate, () => false)).toEqual(new Date('2022-01-01'));
});
