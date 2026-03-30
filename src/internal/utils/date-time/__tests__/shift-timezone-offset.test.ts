// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { shiftTimezoneOffset } from '../../../../../lib/components/internal/utils/date-time/shift-timezone-offset';

interface TestArguments {
  date: string;
  targetOffset: number;
}

const testCases: [args: TestArguments, result: string][] = [
  [{ date: '2020-01-01T09:00:00+03:00', targetOffset: 4 * 60 + 11 }, '2020-01-01T10:11:00'],
  [{ date: '2020-01-01T09:00:00+03:00', targetOffset: 2 * 60 }, '2020-01-01T08:00:00'],
  [{ date: '2020-01-01T09:00:00+03:00', targetOffset: 3 * 60 }, '2020-01-01T09:00:00'],
  [{ date: '2020-01-01T09:00:00-01:00', targetOffset: 1 * 60 }, '2020-01-01T11:00:00'],
  [{ date: '2020-01-01T09:00:00+01:00', targetOffset: -1 * 60 }, '2020-01-01T07:00:00'],
  [{ date: '2020-01-01T09:00:00-01:00', targetOffset: -1 * 60 }, '2020-01-01T09:00:00'],
  [{ date: '2020-01-01T11:22:33Z', targetOffset: 0 }, '2020-01-01T11:22:33'],
  [{ date: '2020-01-01T11:22:33.444Z', targetOffset: 0 }, '2020-01-01T11:22:33'],
];

describe('shiftTimezoneOffset', () => {
  test.each(testCases)('shifts timezone offset correctly', ({ date, targetOffset }, expectedResult) => {
    expect(shiftTimezoneOffset(date, targetOffset)).toBe(expectedResult);
  });
});

test.each(['2020-01-01', '2020-06-01'])('shifts timezone offset against default offset', isoDate => {
  expect(shiftTimezoneOffset(isoDate)).toBe(shiftTimezoneOffset(isoDate, 0 - new Date(isoDate).getTimezoneOffset()));
});

describe('Edge cases', () => {
  test('handles month boundary crossing', () => {
    // Jan 31, 23:00 UTC+1 shifted to UTC+3 should become Feb 1, 01:00
    expect(shiftTimezoneOffset('2020-01-31T23:00:00+01:00', 3 * 60)).toBe('2020-02-01T01:00:00');
  });

  test('handles year boundary crossing', () => {
    // Dec 31, 23:00 UTC+1 shifted to UTC+3 should become Jan 1 (next year), 01:00
    expect(shiftTimezoneOffset('2020-12-31T23:00:00+01:00', 3 * 60)).toBe('2021-01-01T01:00:00');
  });

  test('handles leap year February 29', () => {
    // Feb 29, 2020 (leap year) should be handled correctly
    expect(shiftTimezoneOffset('2020-02-29T12:00:00Z', 0)).toBe('2020-02-29T12:00:00');
  });

  test('handles negative timezone offset crossing day boundary', () => {
    // Jan 2, 01:00 UTC-10 shifted to UTC+2 should become Jan 2, 13:00
    expect(shiftTimezoneOffset('2020-01-02T01:00:00-10:00', 2 * 60)).toBe('2020-01-02T13:00:00');
  });

  test('handles large timezone offset difference', () => {
    // Test extreme offset changes (UTC+14 to UTC-12 = 26 hour difference)
    expect(shiftTimezoneOffset('2020-06-15T12:00:00+14:00', -12 * 60)).toBe('2020-06-14T10:00:00');
  });
});
