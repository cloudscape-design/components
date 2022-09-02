// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatDateRange } from '../../../../../lib/components/internal/utils/date-time/format-date-range';

describe('formatDateRange', () => {
  test.each([
    ['2020-01-01', '2020-01-02', undefined, '2020-01-01 — 2020-01-02'],
    ['2020-01-01', '2020-01-02', 60, '2020-01-01 — 2020-01-02'],
    ['2020-01-01T00:00:00', '2020-01-01T12:00:00', 60, '2020-01-01T00:00:00+01:00 — 2020-01-01T12:00:00+01:00'],
    ['2020-01-01T00:00:00', '2020-01-01T12:00:00', -60, '2020-01-01T00:00:00-01:00 — 2020-01-01T12:00:00-01:00'],
  ])('formats date correctly [%s, %s, %s]', (startDate, endDate, timeOffset, expected) => {
    expect(formatDateRange(startDate, endDate, timeOffset)).toBe(expected);
  });
});
