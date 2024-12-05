// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces';
import * as AllTimeOffset from '../time-offset';
import { formatValue } from '../utils';

const TimeOffsetSpy = jest.spyOn(AllTimeOffset, 'setTimeOffset').mockReturnValue({
  type: 'absolute',
  startDate: 'mock-start-time',
  endDate: 'mock-end-time',
});

describe('DateRangePicker', () => {
  describe('formatValue', () => {
    beforeEach(() => jest.clearAllMocks());
    const defaultOptions = { timeOffset: {}, granularity: 'day' as const, dateOnly: false };

    test('returns null when input is null', () => {
      expect(formatValue(null, defaultOptions)).toBeNull();
    });

    test('returns empty strings when input is empty stings', () => {
      const expected = {
        type: 'absolute',
        startDate: '',
        endDate: '',
      };
      expect(
        formatValue(
          { type: 'absolute', startDate: '', endDate: '' },
          { timeOffset: {}, granularity: 'month', dateOnly: false }
        )
      ).toEqual(expected);
      expect(
        formatValue(
          { type: 'absolute', startDate: '', endDate: '' },
          { timeOffset: {}, granularity: 'day', dateOnly: true }
        )
      ).toEqual(expected);
    });

    test('returns input when type is relative', () => {
      const relativeValue = { type: 'relative', amount: 7, unit: 'day' };
      expect(formatValue(relativeValue as DateRangePickerProps.Value, defaultOptions)).toEqual(relativeValue);
    });

    test('formats value for month granularity', () => {
      const input = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z',
        endDate: '2023-07-20T23:59:59Z',
      };
      const expected = {
        type: 'absolute',
        startDate: '2023-06',
        endDate: '2023-07',
      };
      expect(formatValue(input as DateRangePickerProps.Value, { ...defaultOptions, granularity: 'month' })).toEqual(
        expected
      );
    });

    test('formats value for dateOnly option', () => {
      const input = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z',
        endDate: '2023-07-20T23:59:59Z',
      };
      const expected = {
        type: 'absolute',
        startDate: '2023-06-15',
        endDate: '2023-07-20',
      };
      expect(formatValue(input as DateRangePickerProps.Value, { ...defaultOptions, dateOnly: true })).toEqual(expected);
    });

    test('calls setTimeOffset for default case', () => {
      const input = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z',
        endDate: '2023-07-20T23:59:59Z',
      };
      const timeOffset = { startDate: 3600000, endDate: 7200000 };

      formatValue(input as DateRangePickerProps.Value, { ...defaultOptions, timeOffset });

      expect(TimeOffsetSpy).toHaveBeenCalledWith(input, timeOffset);
    });
  });
});
