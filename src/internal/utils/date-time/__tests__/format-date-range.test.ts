// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatDateRange } from '../../../../../lib/components/internal/utils/date-time/format-date-range';

const browser = { startDate: undefined, endDate: undefined };
const berlin = { startDate: 120, endDate: 120 };
const newYork = { startDate: -240, endDate: -240 };
const regional = { startDate: 0, endDate: 60 };

describe('formatDateRange', () => {
  describe('Only date', () => {
    const cases = [
      {
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        timeOffset: browser,
        expected: {
          iso: '2020-01-01 — 2020-01-02',
          absolute: { 'en-US': 'January 1, 2020 — January 2, 2020' },
        },
      },
      {
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        timeOffset: berlin,
        expected: { iso: '2020-01-01 — 2020-01-02', absolute: { 'en-US': 'January 1, 2020 — January 2, 2020' } },
      },
    ];
    describe.each(cases)('formats date correctly [%j]', ({ startDate, endDate, timeOffset, expected }) => {
      test('Default', () => {
        expect(formatDateRange({ startDate, endDate, timeOffset })).toBe(expected.iso);
      });
      test('ISO', () => {
        expect(formatDateRange({ startDate, endDate, timeOffset, format: 'iso' })).toBe(expected.iso);
      });
      test('Absolute', () => {
        expect(formatDateRange({ startDate, endDate, timeOffset, format: 'absolute', locale: 'en-US' })).toBe(
          expected.absolute['en-US']
        );
      });
    });
  });

  describe('Date and time', () => {
    test.each([
      ['2020-01-01T00:00:00', '2020-01-01T12:00:00', berlin, '2020-01-01T00:00:00+02:00 — 2020-01-01T12:00:00+02:00'],
      ['2020-01-01T00:00:00', '2020-01-01T12:00:00', newYork, '2020-01-01T00:00:00-04:00 — 2020-01-01T12:00:00-04:00'],
      ['2020-01-01T00:00:00', '2020-01-01T12:00:00', regional, '2020-01-01T00:00:00+00:00 — 2020-01-01T12:00:00+01:00'],
    ])('formats date correctly [%s, %s, %s]', (startDate, endDate, timeOffset, expected) => {
      expect(formatDateRange({ startDate, endDate, timeOffset })).toBe(expected);
    });
  });
});
