// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DateRangePickerProps } from '../interfaces';
import { normalizeTimeOffset, setTimeOffset, shiftTimeOffset } from '../time-offset';

describe('Date range picker', () => {
  describe('time offset handling', () => {
    describe('setTimeOffset', () => {
      test.each([
        [
          'absolute dates with positive offset',
          { type: 'absolute', startDate: '2020-10-12T01:23:45', endDate: '2020-10-12T01:23:45' },
          { startDate: 120, endDate: 120 },
          { type: 'absolute', startDate: '2020-10-12T01:23:45+02:00', endDate: '2020-10-12T01:23:45+02:00' },
        ],
        [
          'absolute dates with negative offset',
          { type: 'absolute', startDate: '2020-10-12T01:23:45', endDate: '2020-10-12T01:23:45' },
          { startDate: -240, endDate: -240 },
          { type: 'absolute', startDate: '2020-10-12T01:23:45-04:00', endDate: '2020-10-12T01:23:45-04:00' },
        ],
        [
          'absolute dates with mixed offsets',
          { type: 'absolute', startDate: '2020-10-12T01:23:45', endDate: '2020-10-12T01:23:45' },
          { startDate: 120, endDate: -240 },
          { type: 'absolute', startDate: '2020-10-12T01:23:45+02:00', endDate: '2020-10-12T01:23:45-04:00' },
        ],
        [
          'relative value',
          { type: 'relative', unit: 'second', amount: 5 },
          { startDate: -240, endDate: -240 },
          { type: 'relative', unit: 'second', amount: 5 },
        ],
        ['null value', null, { startDate: 300, endDate: 300 }, null],
      ])('should handle %s correctly', (_, value, offset, expected) => {
        expect(setTimeOffset(value as DateRangePickerProps.Value | null, offset)).toEqual(expected);
      });
    });

    describe('shiftTimeOffset', () => {
      test.each([
        [
          'relative times have not shifted offset with undefined offset values',
          { type: 'relative', amount: 7, unit: 'day' },
          { startDate: undefined, endDate: undefined }, //this is the fallback value that will be passed
          { type: 'relative', amount: 7, unit: 'day' },
        ],
        [
          'relative times have not shifted offset with valid offset vaues',
          { type: 'relative', amount: 7, unit: 'day' },
          { startDate: 120, endDate: 120 },
          { type: 'relative', amount: 7, unit: 'day' },
        ],
        [
          'different timezones with positive offset',
          { type: 'absolute', startDate: '2020-10-12T01:23:45+04:00', endDate: '2020-10-12T01:23:45-05:00' },
          { startDate: 120, endDate: 120 },
          { type: 'absolute', startDate: '2020-10-11T23:23:45', endDate: '2020-10-12T08:23:45' },
        ],
        [
          'UTC and +00:00 with negative offset',
          { type: 'absolute', startDate: '2020-10-12T01:23:45Z', endDate: '2020-10-12T01:23:45+00:00' },
          { startDate: -240, endDate: -240 },
          { type: 'absolute', startDate: '2020-10-11T21:23:45', endDate: '2020-10-11T21:23:45' },
        ],
        [
          'UTC with mixed offsets',
          { type: 'absolute', startDate: '2020-10-12T01:23:45Z', endDate: '2020-10-12T01:23:45+00:00' },
          { startDate: 120, endDate: -240 },
          { type: 'absolute', startDate: '2020-10-12T03:23:45', endDate: '2020-10-11T21:23:45' },
        ],
        [
          'positive timezone to UTC',
          { type: 'absolute', startDate: '2020-10-12T00:00:00+10:00', endDate: '2020-10-12T10:00:00+10:00' },
          { startDate: 10 * 60, endDate: 10 * 60 },
          { type: 'absolute', startDate: '2020-10-12T00:00:00', endDate: '2020-10-12T10:00:00' },
        ],
        [
          'negative timezone to UTC',
          { type: 'absolute', startDate: '2020-10-12T00:00:00-10:00', endDate: '2020-10-12T10:00:00-10:00' },
          { startDate: -10 * 60, endDate: -10 * 60 },
          { type: 'absolute', startDate: '2020-10-12T00:00:00', endDate: '2020-10-12T10:00:00' },
        ],
        [
          'positive timezone to local time',
          { type: 'absolute', startDate: '2020-10-12T00:00:00+10:00', endDate: '2020-10-12T10:00:00+10:00' },
          { startDate: 0, endDate: 0 },
          { type: 'absolute', startDate: '2020-10-11T14:00:00', endDate: '2020-10-12T00:00:00' },
        ],
        ['empty dates', { type: 'absolute', startDate: '', endDate: '' }, { startDate: 0, endDate: 0 }, null],
      ])('should handle %s correctly', (_, value, offset, expected) => {
        expect(shiftTimeOffset(value as DateRangePickerProps.Value, offset)).toEqual(expected);
      });
    });
  });

  describe('normalizeTimeOffset', () => {
    test('ignores non-absolute value', () => {
      expect(normalizeTimeOffset(null, undefined, 60)).toEqual({ startDate: undefined, endDate: undefined });

      expect(normalizeTimeOffset({ type: 'relative', unit: 'day', amount: 10 }, undefined, 60)).toEqual({
        startDate: undefined,
        endDate: undefined,
      });

      expect(normalizeTimeOffset(null, () => 60)).toEqual({ startDate: undefined, endDate: undefined });

      expect(normalizeTimeOffset({ type: 'relative', unit: 'day', amount: 10 }, () => 60)).toEqual({
        startDate: undefined,
        endDate: undefined,
      });
    });

    test('prefers getTimeOffset over timeOffset', () => {
      const getTimeOffset = jest.fn().mockImplementation(date => (date.getFullYear() === 2021 ? 1 : 2));
      expect(
        normalizeTimeOffset({ type: 'absolute', startDate: '2020-06-01', endDate: '2021-06-01' }, getTimeOffset, 3)
      ).toEqual({ startDate: 2, endDate: 1 });
      expect(getTimeOffset).toHaveBeenCalledTimes(2);
    });

    test('converts getTimeOffset argument to UTC', () => {
      const getTimeOffset = jest.fn();

      normalizeTimeOffset(
        { type: 'absolute', startDate: '2020-01-01T00:00:00', endDate: '2020-06-01T23:59:59' },
        getTimeOffset
      );

      expect(getTimeOffset).toHaveBeenCalledWith(new Date(Date.UTC(2020, 0, 1, 0, 0, 0)));
      expect(getTimeOffset).toHaveBeenCalledWith(new Date(Date.UTC(2020, 5, 1, 23, 59, 59)));

      normalizeTimeOffset(
        { type: 'absolute', startDate: '2020-01-01T00:00:00Z', endDate: '2020-06-01T23:59:59Z' },
        getTimeOffset
      );

      expect(getTimeOffset).toHaveBeenCalledWith(new Date(Date.UTC(2020, 0, 1, 0, 0, 0)));
      expect(getTimeOffset).toHaveBeenCalledWith(new Date(Date.UTC(2020, 5, 1, 23, 59, 59)));

      normalizeTimeOffset(
        { type: 'absolute', startDate: '2020-01-01T00:00:00+01:00', endDate: '2020-06-01T23:59:59+02:00' },
        getTimeOffset
      );

      expect(getTimeOffset).toHaveBeenCalledWith(new Date(Date.UTC(2020, 0, 1, 0, 0, 0)));
      expect(getTimeOffset).toHaveBeenCalledWith(new Date(Date.UTC(2020, 5, 1, 23, 59, 59)));
    });
  });
});
