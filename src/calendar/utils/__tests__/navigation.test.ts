// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { moveNextDay, movePrevDay, moveNextWeek, movePrevWeek } from '../navigation';

const startDate = new Date('2022-01-15');

function disableDates(...blockedDates: string[]) {
  return (date: Date) => blockedDates.every(blocked => new Date(blocked).getTime() !== date.getTime());
}

test('should move to the next day if enabled', () => {
  expect(moveNextDay(startDate, () => true)).toEqual(new Date('2022-01-16'));
  expect(moveNextDay(startDate, disableDates('2022-01-16', '2022-01-17'))).toEqual(new Date('2022-01-18'));
});

test('should move to the previous day if enabled', () => {
  expect(movePrevDay(startDate, () => true)).toEqual(new Date('2022-01-14'));
  expect(movePrevDay(startDate, disableDates('2022-01-14', '2022-01-13'))).toEqual(new Date('2022-01-12'));
});

test('should move to the next week if enabled', () => {
  expect(moveNextWeek(startDate, () => true)).toEqual(new Date('2022-01-22'));
  expect(moveNextWeek(startDate, disableDates('2022-01-22', '2022-01-29'))).toEqual(new Date('2022-02-05'));
});

test('should move to the previous week if enabled', () => {
  expect(movePrevWeek(startDate, () => true)).toEqual(new Date('2022-01-08'));
  expect(movePrevWeek(startDate, disableDates('2022-01-08', '2022-01-01'))).toEqual(new Date('2021-12-25'));
});
