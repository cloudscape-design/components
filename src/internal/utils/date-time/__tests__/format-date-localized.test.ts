// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import formatDateLocalized from '../format-date-localized';
import * as formatTimeOffsetModule from '../format-time-offset';

describe('formatDateLocalized', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(formatTimeOffsetModule, 'formatTimeOffsetLocalized').mockReturnValue('(UTC)');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('formats date with month and year for isMonthOnly', () => {
    const result = formatDateLocalized({
      date: '2023-06-15T12:00:00Z',
      isMonthOnly: true,
      isDateOnly: false,
      locale: 'en-US',
    });

    expect(result).toBe('June 2023');
  });

  test('formats date with day, month, and year for non-isMonthOnly', () => {
    const result = formatDateLocalized({
      date: '2023-06-15T12:00:00Z',
      isMonthOnly: false,
      isDateOnly: false,
      locale: 'en-US',
    });

    expect(result).toMatch(/^June 15, 2023, 12:00:00 \(UTC\)$/);
  });

  test('formats date only when isDateOnly is true', () => {
    const result = formatDateLocalized({
      date: '2023-06-15T12:00:00Z',
      isMonthOnly: false,
      isDateOnly: true,
      locale: 'en-US',
    });

    expect(result).toBe('June 15, 2023');
  });

  test('hides time offset when hideTimeOffset is true', () => {
    const result = formatDateLocalized({
      date: '2023-06-15T12:00:00Z',
      isMonthOnly: false,
      isDateOnly: false,
      hideTimeOffset: true,
      locale: 'en-US',
    });

    expect(result).toBe('June 15, 2023, 12:00:00');
  });

  test('uses space as separator for Japanese locale', () => {
    const result = formatDateLocalized({
      date: '2023-06-15T12:00:00Z',
      isMonthOnly: false,
      isDateOnly: false,
      locale: 'ja',
    });

    expect(result).toMatch(/^2023年6月15日 12:00:00 \(UTC\)$/);
  });

  test('handles non-ISO formatted date strings', () => {
    const result = formatDateLocalized({
      date: 'June 15, 2023 12:00:00',
      isMonthOnly: false,
      isDateOnly: false,
      locale: 'en-US',
    });

    expect(result).toMatch(/^June 15, 2023, 12:00:00 \(UTC\)$/);
  });

  test('handles invalid date strings by throwing RangeError', () => {
    expect(() => {
      formatDateLocalized({
        date: '15/06/2023 12:00:00',
        isMonthOnly: false,
        isDateOnly: false,
        locale: 'en-US',
      });
    }).toThrow('Invalid time value');
  });

  test('handles different time offsets', () => {
    jest.mocked(formatTimeOffsetModule.formatTimeOffsetLocalized).mockReturnValue('UTC-05:00');

    const result = formatDateLocalized({
      date: '2023-06-15T12:00:00-05:00',
      isMonthOnly: false,
      isDateOnly: false,
      timeOffset: -300,
      locale: 'en-US',
    });

    expect(result).toMatch(/^June 15, 2023, 17:00:00 UTC-05:00$/);
  });

  test('formats month-only ISO string correctly', () => {
    const result = formatDateLocalized({
      date: '2018-01',
      isMonthOnly: true,
      isDateOnly: false,
      locale: 'en-US',
    });

    expect(result).toBe('January 2018');
  });

  test('formats date-only ISO string correctly', () => {
    const result = formatDateLocalized({
      date: '2018-01-15',
      isMonthOnly: false,
      isDateOnly: true,
      locale: 'en-US',
    });

    expect(result).toBe('January 15, 2018');
  });

  test('handles month-only date with timezone offset correctly', () => {
    // This test ensures that month-only dates are not affected by timezone conversions
    const result = formatDateLocalized({
      date: '2018-01',
      isMonthOnly: true,
      isDateOnly: false,
      locale: 'en-US',
      timeOffset: -480, // America/Los_Angeles offset in minutes
    });

    // Should still be January 2018, not December 2017
    expect(result).toBe('January 2018');
  });
});
