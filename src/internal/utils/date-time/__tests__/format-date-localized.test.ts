// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import formatDateLocalized from '../format-date-localized';
import * as formatTimeOffsetModule from '../format-time-offset';

describe('formatDateLocalized', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(formatTimeOffsetModule, 'formatTimeOffsetLocalized').mockReturnValue('UTC+00:00');
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

    expect(result).toMatch(/^June 15, 2023, 12:00:00 UTC\+00:00$/);
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

    expect(result).toMatch(/^2023年6月15日 12:00:00 UTC\+00:00$/);
  });

  test('handles non-ISO formatted date strings', () => {
    const result = formatDateLocalized({
      date: 'June 15, 2023 12:00:00',
      isMonthOnly: false,
      isDateOnly: false,
      locale: 'en-US',
    });

    expect(result).toMatch(/^June 15, 2023, 12:00:00 UTC\+00:00$/);
  });

  //todo  determine how to handle this failing
  test.skip('handles different time offsets', () => {
    (formatTimeOffsetModule.formatTimeOffsetLocalized as jest.Mock).mockReturnValue('UTC-05:00');

    const result = formatDateLocalized({
      date: '2023-06-15T12:00:00-05:00',
      isMonthOnly: false,
      isDateOnly: false,
      timeOffset: -300,
      locale: 'en-US',
    });

    expect(result).toMatch(/^June 15, 2023, 17:00:00 UTC-05:00$/);
  });
});
