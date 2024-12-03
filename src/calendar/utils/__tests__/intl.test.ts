// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getDateLabel, renderTimeLabel } from '../intl';

describe('getDateLabel', () => {
  test('should return local date string for the sepcified date', () => {
    expect(getDateLabel('en-US', new Date(2017, 0, 5))).toEqual('Thursday, January 5, 2017');
  });
});

describe('renderTimeLabel', () => {
  const locale = 'en-US';

  test('renders hour only format', () => {
    const date = new Date(2023, 5, 15, 14, 30); // June 15, 2023, 14:30
    const result = renderTimeLabel(locale, date, 'hh');
    expect(result).toMatch(/^02 PM$/); // Matches "02 PM" (might vary based on locale)
  });

  test('renders hour and minute format', () => {
    const date = new Date(2023, 5, 15, 14, 30); // June 15, 2023, 14:30
    const result = renderTimeLabel(locale, date, 'hh:mm');
    expect(result).toMatch(/^02:30 PM$/); // Matches "02:30 PM" (might vary based on locale)
  });

  test('renders full time format when no format is provided', () => {
    const date = new Date(2023, 5, 15, 14, 30, 45); // June 15, 2023, 14:30:45
    const result = renderTimeLabel(locale, date);
    expect(result).toMatch(/^2:30:45 PM$/); // Full time format including seconds
  });

  test('handles midnight correctly', () => {
    const date = new Date(2023, 5, 15, 0, 0); // June 15, 2023, 00:00
    const result = renderTimeLabel(locale, date, 'hh:mm');
    expect(result).toMatch(/^12:00 AM$/);
  });

  test('handles noon correctly', () => {
    const date = new Date(2023, 5, 15, 12, 0); // June 15, 2023, 12:00
    const result = renderTimeLabel(locale, date, 'hh:mm');
    expect(result).toMatch(/^12:00 PM$/);
  });

  test('uses provided locale', () => {
    const date = new Date(2023, 5, 15, 14, 30); // June 15, 2023, 14:30
    const result = renderTimeLabel('de-DE', date, 'hh:mm');
    expect(result).toMatch(/^14:30$/); // German format uses 24-hour clock
  });

  test('handles single-digit hours correctly', () => {
    const date = new Date(2023, 5, 15, 9, 5); // June 15, 2023, 09:05
    const result = renderTimeLabel(locale, date, 'hh:mm');
    expect(result).toMatch(/^09:05 AM$/);
  });

  test('handles end of day correctly', () => {
    const date = new Date(2023, 5, 15, 23, 59, 59); // June 15, 2023, 23:59:59
    const result = renderTimeLabel(locale, date, 'hh:mm');
    expect(result).toMatch(/^11:59 PM$/);
  });
});
