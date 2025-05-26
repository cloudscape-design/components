// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { formatDateIso, updateShortDateStrings } from '../format-date-iso';
import * as formatTimeOffsetModule from '../format-time-offset';

describe('updateShortDateStrings', () => {
  test.each([
    { input: '1', expected: '2001-01-01' },
    { input: '21', expected: '2021-01-01' },
    { input: '123', expected: '2123-01-01' },
    { input: '999', expected: '2999-01-01' },
    { input: '2023', expected: '2023-01-01' },
    { input: '2023-01-02', expected: '2023-01-02' },
    { input: '2023-01', expected: '2023-01' },
  ])('converts $input to $expected', ({ input, expected }) => {
    expect(updateShortDateStrings(input)).toBe(expected);
  });
});

describe('formatDateIso', () => {
  let formatTimeOffsetISOMock: jest.SpyInstance;

  beforeEach(() => {
    formatTimeOffsetISOMock = jest.spyOn(formatTimeOffsetModule, 'formatTimeOffsetISO').mockReturnValue('+00:00');
  });

  afterEach(() => {
    formatTimeOffsetISOMock.mockRestore();
  });

  describe('fallback date functionality', () => {
    const tests = [
      { input: '1', expected: '2001-01' },
      { input: '21', expected: '2021-01' },
      { input: '123', expected: '2123-01' },
      { input: '2023', expected: '2023-01' },
    ];
    test.each(tests)('handles $input as year input with isMonthOnly=true', ({ input, expected }) => {
      const result = formatDateIso({
        date: input,
        isDateOnly: false,
        isMonthOnly: true,
      });

      expect(result).toBe(expected);
    });

    test.each(tests)(
      'handles $input as year input with isMonthOnly=false and isDateOnly=true',
      ({ input, expected: expectedBase }) => {
        const result = formatDateIso({
          date: input,
          isDateOnly: true,
          isMonthOnly: false,
        });

        expect(result).toBe(`${expectedBase}-01`);
      }
    );

    test.each(tests)(
      'handles $input as year input with isMonthOnly=false and isDateOnly=false',
      ({ input, expected: expectedBase }) => {
        const result = formatDateIso({
          date: input,
          isDateOnly: false,
          isMonthOnly: false,
        });

        expect(result).toBe(`${expectedBase}-01+00:00`);
      }
    );
  });

  test('returns ISO date without offset when hideTimeOffset is true', () => {
    const result = formatDateIso({
      date: '2023-06-15T12:00:00',
      hideTimeOffset: true,
      isDateOnly: false,
      isMonthOnly: false,
    });

    expect(result).toBe('2023-06-15T12:00:00');
    expect(formatTimeOffsetISOMock).not.toHaveBeenCalled();
  });

  describe('flag combinations', () => {
    test.each([
      { isDateOnly: true, isMonthOnly: false, date: '2023-06-15', expected: '2023-06-15', shouldCallOffset: false },
      { isDateOnly: false, isMonthOnly: true, date: '2023-06', expected: '2023-06', shouldCallOffset: false },
      {
        isDateOnly: false,
        isMonthOnly: false,
        date: '2023-06-15T12:00:00',
        expected: '2023-06-15T12:00:00+00:00',
        shouldCallOffset: true,
      },
      { isDateOnly: true, isMonthOnly: true, date: '2023-06', expected: '2023-06', shouldCallOffset: false },
    ])(
      'handles isDateOnly=$isDateOnly, isMonthOnly=$isMonthOnly correctly',
      ({ isDateOnly, isMonthOnly, date, expected, shouldCallOffset }) => {
        const result = formatDateIso({
          date,
          isDateOnly,
          isMonthOnly,
        });

        expect(result).toBe(expected);

        if (shouldCallOffset) {
          expect(formatTimeOffsetISOMock).toHaveBeenCalledWith(date, undefined);
        } else {
          expect(formatTimeOffsetISOMock).not.toHaveBeenCalled();
        }

        formatTimeOffsetISOMock.mockClear();
      }
    );
  });

  describe('time offsets', () => {
    test.each([
      { offset: -300, offsetString: '-05:00', expected: '2023-06-15T12:00:00-05:00' },
      { offset: 330, offsetString: '+05:30', expected: '2023-06-15T12:00:00+05:30' },
      { offset: 0, offsetString: 'Z', expected: '2023-06-15T12:00:00Z' },
    ])('handles timeOffset=$offset correctly', ({ offset, offsetString, expected }) => {
      formatTimeOffsetISOMock.mockReturnValue(offsetString);

      const result = formatDateIso({
        date: '2023-06-15T12:00:00',
        isDateOnly: false,
        isMonthOnly: false,
        timeOffset: offset,
      });

      expect(result).toBe(expected);
      expect(formatTimeOffsetISOMock).toHaveBeenCalledWith('2023-06-15T12:00:00', offset);

      formatTimeOffsetISOMock.mockClear();
    });
  });
});
