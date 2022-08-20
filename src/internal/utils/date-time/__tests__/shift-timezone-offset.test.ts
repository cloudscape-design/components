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
];

describe('shiftTimezoneOffset', () => {
  test.each(testCases)('shifts timezone offset correctly', ({ date, targetOffset }, expectedResult) => {
    expect(shiftTimezoneOffset(date, targetOffset)).toBe(expectedResult);
  });
});
