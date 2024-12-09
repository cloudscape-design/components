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
  });

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
        formatValue({ type: 'absolute', startDate: '', endDate: '' }, { timeOffset: {}, dateOnly: false })
      ).toEqual(expected);
      expect(formatValue({ type: 'absolute', startDate: '', endDate: '' }, { timeOffset: {}, dateOnly: true })).toEqual(
        expected
      );
    });

    test('returns input when type is relative', () => {
      const relativeValue = { type: 'relative', amount: 7, unit: 'day' };
      expect(formatValue(relativeValue as DateRangePickerProps.Value, defaultOptions)).toEqual(relativeValue);
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

      expect(SetTimeOffsetSpy).toHaveBeenCalledWith(input, timeOffset);
    });

    it('should return null when value is null', () => {
      const result = formatValue(null, { timeOffset: {}, dateOnly: false });
      expect(result).toBeNull();
    });

    it('should return the value when type is relative', () => {
      const value: DateRangePickerProps.Value = { type: 'relative', amount: 7, unit: 'day' };
      const result = formatValue(value, { timeOffset: {}, dateOnly: false });
      expect(result).toBe(value);
    });

    it('should return date-only format when dateOnly is true', () => {
      const value: DateRangePickerProps.Value = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-07T12:00:00',
      };
      const result = formatValue(value, { timeOffset: {}, dateOnly: true });
      expect(result).toEqual({ type: 'absolute', startDate: '2023-01-01', endDate: '2023-01-07' });
    });

    it('should call setTimeOffset when dateOnly is false', () => {
      const value: DateRangePickerProps.Value = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-07T12:00:00',
      };
      const timeOffset = { startDate: 0, endDate: 0 };
      formatValue(value, { timeOffset, dateOnly: false });
      expect(SetTimeOffsetSpy).toHaveBeenCalledWith(value, timeOffset);
    });
  });

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

      const result = formatInitialValue(null, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(null, normalizedTimeOffset);
      expect(result).toBe(shiftedValue);
    });

    it('should return shifted time offset for relative value', () => {
      const relativeValue: DateRangePickerProps.RelativeValue = { type: 'relative', amount: 7, unit: 'day' };
      const shiftedValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-07',
      };
      ShiftTimeOffsetSpy.mockReturnValue(shiftedValue);

      const result = formatInitialValue(relativeValue, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(relativeValue, normalizedTimeOffset);
      expect(result).toBe(shiftedValue);
    });

    it('should format value when dateOnly is true for absolute value', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-31T12:00:00',
      };

      const result = formatInitialValue(absoluteValue, true, normalizedTimeOffset);

      expect(result).toEqual({
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      });
    });

    it('should return the original value when both dates are ISO date-only strings', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };

      const result = formatInitialValue(absoluteValue, false, normalizedTimeOffset);

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

      const result = formatInitialValue(absoluteValue, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(absoluteValue, normalizedTimeOffset);
      expect(result).toBe(shiftedValue);
    });

    it('should handle empty string dates in absolute value', () => {
      const absoluteValue: DateRangePickerProps.AbsoluteValue = {
        type: 'absolute',
        startDate: '',
        endDate: '',
      };

      const result = formatInitialValue(absoluteValue, false, normalizedTimeOffset);

      expect(result).toBe(absoluteValue);
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

      const result = formatInitialValue(absoluteValue, false, normalizedTimeOffset);

      expect(ShiftTimeOffsetSpy).toHaveBeenCalledWith(absoluteValue, normalizedTimeOffset);
      expect(result).toBe(shiftedValue);
    });
  });
});
