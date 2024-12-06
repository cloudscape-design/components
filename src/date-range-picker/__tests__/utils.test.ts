// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces';
import * as AllTimeOffset from '../time-offset';
import { formatInitialValue, formatValue, getDefaultMode, joinAbsoluteValue, splitAbsoluteValue } from '../utils';

const SetTimeOffsetSpy = jest.spyOn(AllTimeOffset, 'setTimeOffset');
const ShiftTimeOffsetSpy = jest.spyOn(AllTimeOffset, 'shiftTimeOffset');

describe('DateRangePicker utils', () => {
  describe('getDefaultMode', () => {
    const relativeOptions: DateRangePickerProps.RelativeOption[] = [
      { key: 'week', type: 'relative', amount: 7, unit: 'day' },
    ];

    it('should return the value type when present', () => {
      const value: DateRangePickerProps.Value = { type: 'absolute', startDate: '2023-01-01', endDate: '2023-01-07' };
      expect(getDefaultMode(value, relativeOptions, 'default')).toBe('absolute');
    });

    it('should return relative for relative-only mode', () => {
      expect(getDefaultMode(null, relativeOptions, 'relative-only')).toBe('relative');
    });

    it('should return absolute for absolute-only mode', () => {
      expect(getDefaultMode(null, relativeOptions, 'absolute-only')).toBe('absolute');
    });

    it('should return relative when relativeOptions are available', () => {
      expect(getDefaultMode(null, relativeOptions, 'default')).toBe('relative');
    });

    it('should return absolute when no relativeOptions are available', () => {
      expect(getDefaultMode(null, [], 'default')).toBe('absolute');
    });
  });

  describe('splitAbsoluteValue', () => {
    it('should return empty object when value is null', () => {
      const result = splitAbsoluteValue(null);
      expect(result).toEqual({ start: { date: '', time: '' }, end: { date: '', time: '' } });
    });

    it('should call splitDateTime for start and end dates', () => {
      const value: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-07T12:00:00',
      };

      const result = splitAbsoluteValue(value);

      expect(result).toEqual({
        start: { date: '2023-01-01', time: '12:00:00' },
        end: { date: '2023-01-07', time: '12:00:00' },
      });
    });

    it('should hide time for start and end dates when hiseTime param is passed', () => {
      const value: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-07T12:00:00',
      };

      const result = splitAbsoluteValue(value, true);

      expect(result).toEqual({
        start: { date: '2023-01-01', time: '' },
        end: { date: '2023-01-07', time: '' },
      });
    });
  });

  describe('joinAbsoluteValue', () => {
    it('should join date and time correctly', () => {
      const value: DateRangePickerProps.PendingAbsoluteValue = {
        start: { date: '2023-01-01', time: '12:00:00' },
        end: { date: '2023-01-07', time: '18:00:00' },
      };

      const result = joinAbsoluteValue(value);

      expect(result).toEqual({
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-07T18:00:00',
      });
    });

    it('should use default times when not provided', () => {
      const value: DateRangePickerProps.PendingAbsoluteValue = {
        start: { date: '2023-01-01', time: '' },
        end: { date: '2023-01-07', time: '' },
      };

      const result = joinAbsoluteValue(value);

      const expected = {
        endDate: '2023-01-07T23:59:59',
        startDate: '2023-01-01T00:00:00',
        type: 'absolute',
      };

      expect(result).toEqual(expected);
    });

    it('should hide the them when a hideTime param is passed as true', () => {
      const value: DateRangePickerProps.PendingAbsoluteValue = {
        start: { date: '2023-01-01', time: '' },
        end: { date: '2023-01-07', time: '' },
      };

      const result = joinAbsoluteValue(value, true);

      const expected = {
        endDate: '2023-01-07',
        startDate: '2023-01-01',
        type: 'absolute',
      };

      expect(result).toEqual(expected);
    });
  });

  describe('formatValue', () => {
    beforeEach(() => jest.clearAllMocks());
    const defaultOptions = { timeOffset: null, monthOnly: false, dateOnly: false };

    test('returns null when input is null', () => {
      expect(formatValue(null, defaultOptions)).toBeNull();
    });

    test('returns empty strings when input is empty stings', () => {
      const expected = {
        type: 'absolute',
        startDate: '',
        endDate: '',
      };
      expect(formatValue({ type: 'absolute', startDate: '', endDate: '' }, defaultOptions)).toEqual(expected);
      expect(
        formatValue(
          { type: 'absolute', startDate: '', endDate: '' },
          {
            ...defaultOptions,
            dateOnly: true,
          }
        )
      ).toEqual(expected);
      expect(
        formatValue(
          { type: 'absolute', startDate: '', endDate: '' },
          {
            ...defaultOptions,
            monthOnly: true,
          }
        )
      ).toEqual(expected);
    });

    test('returns input when type is relative', () => {
      const relativeValue = { type: 'relative', amount: 7, unit: 'day' };
      expect(formatValue(relativeValue as DateRangePickerProps.Value, defaultOptions)).toEqual(relativeValue);
      expect(
        formatValue(relativeValue as DateRangePickerProps.Value, {
          ...defaultOptions,
          dateOnly: true,
        })
      ).toEqual(relativeValue);
      expect(
        formatValue(relativeValue as DateRangePickerProps.Value, {
          ...defaultOptions,
          monthOnly: true,
        })
      ).toEqual(relativeValue);
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

    test('formats value for monthOnly option', () => {
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
      expect(formatValue(input as DateRangePickerProps.Value, { ...defaultOptions, monthOnly: true })).toEqual(
        expected
      );
    });

    test('calls setTimeOffset for default case', () => {
      const input = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z',
        endDate: '2023-07-20T23:59:59Z',
      };
      const timeOffset = { startDate: 3600000, endDate: 7200000 };

      const expected = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z+60000:00',
        endDate: '2023-07-20T23:59:59Z+120000:00',
      };

      const result = formatValue(input as DateRangePickerProps.Value, { ...defaultOptions, timeOffset });

      expect(SetTimeOffsetSpy).toHaveBeenCalledWith(input, timeOffset);
      expect(result).toEqual(expected);
    });

    test('passes empty timeoffset obj to setTimeOffset when timeoffset param is null', () => {
      const input = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z',
        endDate: '2023-07-20T23:59:59Z',
      };
      const timeOffset = null;

      const expected = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z+00:00',
        endDate: '2023-07-20T23:59:59Z+00:00',
      };

      const result = formatValue(input as DateRangePickerProps.Value, { ...defaultOptions, timeOffset });

      expect(SetTimeOffsetSpy).toHaveBeenCalledWith(input, { startDate: undefined, endDate: undefined });
      expect(result).toEqual(expected);
    });

    test('timeoffset does not have effect when dateOnly', () => {
      const input = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z',
        endDate: '2023-07-20T23:59:59Z',
      };
      const timeOffset = { startDate: 3600000, endDate: 7200000 };
      const expected = {
        type: 'absolute',
        startDate: '2023-06-15',
        endDate: '2023-07-20',
      };

      const result = formatValue(input as DateRangePickerProps.Value, {
        ...defaultOptions,
        timeOffset,
        dateOnly: true,
      });

      expect(SetTimeOffsetSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    test('timeoffset does not have effect when monthOnly', () => {
      const input = {
        type: 'absolute',
        startDate: '2023-06-15T00:00:00Z',
        endDate: '2023-07-20T23:59:59Z',
      };
      const timeOffset = { startDate: 3600000, endDate: 7200000 };
      const expected = {
        type: 'absolute',
        startDate: '2023-06',
        endDate: '2023-07',
      };

      const result = formatValue(input as DateRangePickerProps.Value, {
        ...defaultOptions,
        timeOffset,
        monthOnly: true,
      });

      expect(SetTimeOffsetSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return null when value is null', () => {
      expect(formatValue(null, defaultOptions)).toBeNull();
      expect(formatValue(null, { ...defaultOptions, dateOnly: true })).toBeNull();
      expect(formatValue(null, { ...defaultOptions, monthOnly: true })).toBeNull();
    });

    it('should return the value when type is relative', () => {
      const value: DateRangePickerProps.Value = { type: 'relative', amount: 7, unit: 'day' };
      expect(formatValue(value, defaultOptions)).toBe(value);
      expect(formatValue(value, { ...defaultOptions, dateOnly: true })).toBe(value);
      expect(formatValue(value, { ...defaultOptions, monthOnly: true })).toBe(value);
    });
  });

  //todo  add month only tests
  describe('formatInitialValue', () => {
    const normalizedTimeOffset = { startDate: 0, endDate: 0 };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return shifted time offset when value is null', () => {
      const shiftedValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };
      ShiftTimeOffsetSpy.mockReturnValue(shiftedValue);

      const result = formatInitialValue(null, false, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(null, normalizedTimeOffset);
      expect(result).toBe(shiftedValue);
    });

    it('should return shifted time offset for relative value', () => {
      const relativeValue: DateRangePickerProps.RelativeValue = { type: 'relative', amount: 7, unit: 'day' };
      ShiftTimeOffsetSpy.mockReturnValue(relativeValue);

      const result = formatInitialValue(relativeValue, false, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(relativeValue, normalizedTimeOffset);
      expect(result).toBe(relativeValue);
    });

    it('should format value when dateOnly is true for absolute value', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-31T12:00:00',
      };

      const result = formatInitialValue(absoluteValue, true, false, normalizedTimeOffset);
      expect(ShiftTimeOffsetSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      });
    });

    it('should format value when monthOnly is true for absolute value', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-31T12:00:00',
      };

      const result = formatInitialValue(absoluteValue, false, true, normalizedTimeOffset);
      expect(ShiftTimeOffsetSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        type: 'absolute',
        startDate: '2023-01',
        endDate: '2023-01',
      });
    });

    it('should return the original value when both dates are ISO date-only strings', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };

      const result = formatInitialValue(absoluteValue, false, false, normalizedTimeOffset);
      expect(ShiftTimeOffsetSpy).not.toHaveBeenCalled();
      expect(result).toBe(absoluteValue);
    });

    it('should return the original value when both dates are ISO month-only strings', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01',
        endDate: '2023-01',
      };

      const result = formatInitialValue(absoluteValue, false, false, normalizedTimeOffset);
      expect(ShiftTimeOffsetSpy).not.toHaveBeenCalled();
      expect(result).toBe(absoluteValue);
    });

    it('should return shifted time offset when dates are not ISO date-only strings', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-31T12:00:00',
      };
      const shiftedValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };
      ShiftTimeOffsetSpy.mockReturnValue(shiftedValue);

      const result = formatInitialValue(absoluteValue, false, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(absoluteValue, normalizedTimeOffset);
      expect(result).toBe(shiftedValue);
    });

    it('should handle empty string dates in absolute value', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '',
        endDate: '',
      };

      expect(formatInitialValue(absoluteValue, false, false, normalizedTimeOffset)).toBe(absoluteValue);
      expect(formatInitialValue(absoluteValue, true, false, normalizedTimeOffset)).toBe(absoluteValue);
      expect(formatInitialValue(absoluteValue, false, true, normalizedTimeOffset)).toBe(absoluteValue);
    });

    it('should handle mixed ISO date-only and non-ISO date-only strings', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31T23:59:59',
      };
      const shiftedValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };
      ShiftTimeOffsetSpy.mockReturnValue(shiftedValue);

      const result = formatInitialValue(absoluteValue, false, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(absoluteValue, normalizedTimeOffset);
      expect(result).toBe(shiftedValue);
    });
  });
});
