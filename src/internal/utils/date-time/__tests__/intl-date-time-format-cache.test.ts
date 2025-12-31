// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getDateTimeFormat } from '../intl-date-time-format-cache';

describe('getDateTimeFormat', () => {
  test('returns an Intl.DateTimeFormat instance', () => {
    const formatter = getDateTimeFormat('en-US', { month: 'long' });
    expect(formatter).toBeInstanceOf(Intl.DateTimeFormat);
  });

  test('returns the same instance for identical locale and options', () => {
    const formatter1 = getDateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    const formatter2 = getDateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    expect(formatter1).toBe(formatter2);
  });

  test('returns the same instance regardless of options property order', () => {
    const formatter1 = getDateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    const formatter2 = getDateTimeFormat('en-US', { year: 'numeric', month: 'long' });
    expect(formatter1).toBe(formatter2);
  });

  test('returns different instances for different locales', () => {
    const formatter1 = getDateTimeFormat('en-US', { month: 'long' });
    const formatter2 = getDateTimeFormat('de-DE', { month: 'long' });
    expect(formatter1).not.toBe(formatter2);
  });

  test('returns different instances for different options', () => {
    const formatter1 = getDateTimeFormat('en-US', { month: 'long' });
    const formatter2 = getDateTimeFormat('en-US', { month: 'short' });
    expect(formatter1).not.toBe(formatter2);
  });

  test('handles undefined locale', () => {
    const formatter = getDateTimeFormat(undefined, { month: 'long' });
    expect(formatter).toBeInstanceOf(Intl.DateTimeFormat);
  });

  test('formats dates correctly', () => {
    const formatter = getDateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    const date = new Date(2023, 5, 15); // June 15, 2023
    expect(formatter.format(date)).toBe('June 2023');
  });

  test('caches formatters with complex options', () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      second: '2-digit',
    };
    const formatter1 = getDateTimeFormat('en-US', options);
    const formatter2 = getDateTimeFormat('en-US', options);
    expect(formatter1).toBe(formatter2);
  });
});
