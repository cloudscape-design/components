// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatDateTimeWithOffset } from '../../../../../lib/components/internal/utils/date-time/format-date-time-with-offset';

const browser = undefined;
const berlin = 120;
const newYork = -240;
const regional = 0;

describe('formatDateTimeWithOffset', () => {
  describe('Only date', () => {
    const cases = [
      {
        date: '2020-01-01',
        timeOffset: browser,
        expected: {
          iso: '2020-01-01',
          localized: { 'en-US': 'January 1, 2020' },
        },
      },
      {
        date: '2020-01-01',
        timeOffset: berlin,
        expected: { iso: '2020-01-01', localized: { 'en-US': 'January 1, 2020' } },
      },
    ];
    describe.each(cases)(
      'formats date correctly [date=$date, timeOffset=$timeOffset]',
      ({ date, timeOffset, expected }) => {
        test('ISO', () => {
          expect(formatDateTimeWithOffset({ date, timeOffset, format: 'iso' })).toBe(expected.iso);
        });
        test('Human-readable', () => {
          expect(formatDateTimeWithOffset({ date, timeOffset, format: 'long-localized', locale: 'en-US' })).toBe(
            expected.localized['en-US']
          );
        });
      }
    );
  });

  describe('Date and time', () => {
    describe('with time offset', () => {
      const cases = [
        {
          date: '2020-01-01T00:00:00',
          timeOffset: berlin,
          expected: {
            iso: '2020-01-01T00:00:00+02:00',
            localized: { 'en-US': 'January 1, 2020, 00:00:00 (UTC+2)' },
          },
        },
        {
          date: '2020-01-01T00:00:00',
          timeOffset: newYork,
          expected: {
            iso: '2020-01-01T00:00:00-04:00',
            localized: { 'en-US': 'January 1, 2020, 00:00:00 (UTC-4)' },
          },
        },
        {
          date: '2020-01-01T00:00:00',
          timeOffset: regional,
          expected: {
            iso: '2020-01-01T00:00:00+00:00',
            localized: { 'en-US': 'January 1, 2020, 00:00:00 (UTC)' },
          },
        },
      ];
      describe.each(cases)(
        'formats date correctly [date=$date, timeOffset=$timeOffset]',
        ({ date, timeOffset, expected }) => {
          test('ISO', () => {
            expect(formatDateTimeWithOffset({ date, timeOffset, format: 'iso' })).toBe(expected.iso);
          });
          test('Human-readable', () => {
            expect(formatDateTimeWithOffset({ date, timeOffset, format: 'long-localized', locale: 'en-US' })).toBe(
              expected.localized['en-US']
            );
          });
        }
      );
    });

    describe('without time offset', () => {
      const cases = [
        {
          date: '2020-01-01T00:00:00',
          timeOffset: berlin,
          expected: {
            iso: '2020-01-01T00:00:00',
            localized: { 'en-US': 'January 1, 2020, 00:00:00' },
          },
        },
        {
          date: '2020-01-01T00:00:00',
          timeOffset: newYork,
          expected: {
            iso: '2020-01-01T00:00:00',
            localized: { 'en-US': 'January 1, 2020, 00:00:00' },
          },
        },
        {
          date: '2020-01-01T00:00:00',
          timeOffset: regional,
          expected: {
            iso: '2020-01-01T00:00:00',
            localized: { 'en-US': 'January 1, 2020, 00:00:00' },
          },
        },
      ];

      describe.each(cases)(
        'formats date correctly [date=$date timeOffset=$timeOffset]',
        ({ date, timeOffset, expected }) => {
          test('ISO', () => {
            expect(formatDateTimeWithOffset({ date, timeOffset, hideTimeOffset: true, format: 'iso' })).toBe(
              expected.iso
            );
          });
          test('Human-readable', () => {
            expect(
              formatDateTimeWithOffset({
                date,
                timeOffset,
                hideTimeOffset: true,
                format: 'long-localized',
                locale: 'en-US',
              })
            ).toBe(expected.localized['en-US']);
          });
        }
      );
    });
  });

  describe('Localization', () => {
    describe('uses comma to separate date and time in some languages', () => {
      test.each(['ar', 'de', 'en-GB', 'en-US', 'es', 'fr', 'he', 'id', 'it', 'ko', 'pt-BR', 'th', 'tr'])(
        '%s',
        locale => {
          expect(
            formatDateTimeWithOffset({
              date: '2020-01-01T00:00:00',
              timeOffset: 60,
              locale,
              format: 'long-localized',
            })
          ).toContain(', ');
        }
      );
    });

    describe('does not use comma to separate date and time in some languages', () => {
      test.each(['ja', 'zh-CN', 'zh-TW'])('%s', locale => {
        expect(
          formatDateTimeWithOffset({
            date: '2020-01-01T00:00:00',
            timeOffset: 60,
            locale,
            format: 'long-localized',
          })
        ).not.toContain(',');
      });
    });
  });
});
