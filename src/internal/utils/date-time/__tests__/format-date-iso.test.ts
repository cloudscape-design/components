// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { formatDateIso } from '../format-date-iso';
import * as formatTimeOffsetModule from '../format-time-offset';

describe('formatDateIso', () => {
  let formatTimeOffsetISOMock: jest.SpyInstance;

  beforeEach(() => {
    formatTimeOffsetISOMock = jest.spyOn(formatTimeOffsetModule, 'formatTimeOffsetISO').mockReturnValue('+00:00');
  });

  afterEach(() => {
    formatTimeOffsetISOMock.mockRestore();
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

  test('returns ISO date without offset when isDateOnly is true', () => {
    const result = formatDateIso({
      date: '2023-06-15',
      isDateOnly: true,
      isMonthOnly: false,
    });

    expect(result).toBe('2023-06-15');
    expect(formatTimeOffsetISOMock).not.toHaveBeenCalled();
  });

  test('returns ISO date without offset when isMonthOnly is true', () => {
    const result = formatDateIso({
      date: '2023-06',
      isDateOnly: false,
      isMonthOnly: true,
    });

    expect(result).toBe('2023-06');
    expect(formatTimeOffsetISOMock).not.toHaveBeenCalled();
  });

  test('returns ISO date with offset when all flags are false', () => {
    const result = formatDateIso({
      date: '2023-06-15T12:00:00',
      isDateOnly: false,
      isMonthOnly: false,
    });

    expect(result).toBe('2023-06-15T12:00:00+00:00');
    expect(formatTimeOffsetISOMock).toHaveBeenCalledWith('2023-06-15T12:00:00', undefined);
  });

  test('passes timeOffset to formatTimeOffsetISO when provided', () => {
    formatDateIso({
      date: '2023-06-15T12:00:00',
      isDateOnly: false,
      isMonthOnly: false,
      timeOffset: -300,
    });

    expect(formatTimeOffsetISOMock).toHaveBeenCalledWith('2023-06-15T12:00:00', -300);
  });

  test('handles different time offsets', () => {
    formatTimeOffsetISOMock.mockReturnValue('-05:00');

    const result = formatDateIso({
      date: '2023-06-15T12:00:00',
      isDateOnly: false,
      isMonthOnly: false,
      timeOffset: -300,
    });

    expect(result).toBe('2023-06-15T12:00:00-05:00');
  });
});
