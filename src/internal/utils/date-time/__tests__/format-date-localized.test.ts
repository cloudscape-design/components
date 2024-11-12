// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import formatDateLocalized from '../../../../../lib/components/internal/utils/date-time/format-date-localized';

describe('formatDateLocalized', () => {
  test('formats date correctly when the date is not ISO formatted', () => {
    expect(
      formatDateLocalized({
        date: 'Tue Nov 12 2024 11:03:17 GMT+0100 (Central European Standard Time)',
        isDateOnly: true,
        locale: 'en-US',
      })
    ).toBe('November 12, 2024');
  });

  test('formats date correctly when the TZ is negative in relation to UTC', () => {
    // Store original timezone offset method
    const originalTimezoneOffset = Date.prototype.getTimezoneOffset;

    // Mock to simulate Pacific Time (UTC-8/UTC-7)
    Date.prototype.getTimezoneOffset = function () {
      return 420; // 420 minutes = UTC-7 (PDT)
    };

    expect(
      formatDateLocalized({
        date: '2020-01-05',
        isDateOnly: true,
        locale: 'en-US',
      })
    ).toBe('January 5, 2020');

    Date.prototype.getTimezoneOffset = originalTimezoneOffset;
  });
});
