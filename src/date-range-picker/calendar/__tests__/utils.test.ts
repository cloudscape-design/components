// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MockDate from 'mockdate';

import { DateRangePickerProps } from '../../interfaces';
import { findDateToFocus, findMonthToDisplay, findMonthToFocus, findYearToDisplay } from '../utils';
// Helper function to create Date objects from YYYY-MM-DD strings
const createDate = (dateString: string) => new Date(dateString);
describe('findDateToFocus', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-06-15'));
  });
  afterEach(() => {
    MockDate.reset();
  });
  test('should return selected date if it is enabled and in the same month as baseDate', () => {
    const selected = createDate('2023-06-10');
    const baseDate = createDate('2023-06-01');
    expect(findDateToFocus(selected, baseDate, () => true, true)).toEqual(selected);
  });
  test('should return today if selected is null, today is enabled and in the same month as baseDate', () => {
    const baseDate = createDate('2023-06-01');
    const today = new Date();
    expect(findDateToFocus(null, baseDate, () => true, true)).toEqual(today);
  });
  test('should return baseDate if selected is null, today is not in the same month, and baseDate is enabled', () => {
    const baseDate = createDate('2023-07-01');
    expect(findDateToFocus(null, baseDate, () => true, true)).toEqual(baseDate);
  });
  test('should return null if no date is suitable', () => {
    const baseDate = createDate('2023-07-01');
    expect(findDateToFocus(null, baseDate, () => false, true)).toBeNull();
  });
  test('should return today even if selected is provided but not in the same month as baseDate', () => {
    const selected = createDate('2023-05-01');
    const baseDate = createDate('2023-06-01');
    const today = new Date();
    expect(findDateToFocus(selected, baseDate, () => true, true)).toEqual(today);
  });
  test('should return baseDate if selected and today are not suitable', () => {
    const selected = createDate('2023-05-01');
    const baseDate = createDate('2023-08-01');
    expect(findDateToFocus(selected, baseDate, (date: Date) => date.getMonth() === 7, true)).toEqual(baseDate);
  });
  test('should handle leap years correctly', () => {
    MockDate.set(new Date('2024-02-29')); // Set 'today' to a leap year
    const baseDate = createDate('2024-02-01');
    const today = new Date();
    expect(findDateToFocus(null, baseDate, () => true, true)).toEqual(today);
  });
  describe('2-up grid', () => {
    test('should return selected date if it is enabled and in the next month as baseDate', () => {
      const selected = createDate('2023-07-10');
      const baseDate = createDate('2023-06-01');
      expect(findDateToFocus(selected, baseDate, () => true, false)).toEqual(selected);
    });
    test('should return today if selected is null, today is enabled and in the next month as baseDate', () => {
      const baseDate = createDate('2023-05-01');
      const today = new Date();
      expect(findDateToFocus(null, baseDate, () => true, false)).toEqual(today);
    });
  });
});
describe('findMonthToFocus', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-06-15'));
  });
  afterEach(() => {
    MockDate.reset();
  });
  test('should return selected date if it is enabled and in the same year as baseDate', () => {
    const selected = createDate('2023-03');
    const baseDate = createDate('2023-06');
    expect(findMonthToFocus(selected, baseDate, () => true, true)).toEqual(selected);
  });
  test('should return today if selected is null, today is enabled and in the same year as baseDate', () => {
    const baseDate = createDate('2023-12-01');
    const today = new Date();
    expect(findMonthToFocus(null, baseDate, () => true, true)).toEqual(today);
  });
  test('should return baseDate if selected is null, today is not in the same year, and baseDate is enabled', () => {
    const baseDate = createDate('2024-01-01');
    expect(findMonthToFocus(null, baseDate, () => true, true)).toEqual(baseDate);
  });
  test('should return null if no date is suitable', () => {
    const baseDate = createDate('2024-01-01');
    expect(findMonthToFocus(null, baseDate, () => false, true)).toBeNull();
  });
  test('should return today even if selected is provided but not in the same year as baseDate', () => {
    const selected = createDate('2022-12-01');
    const baseDate = createDate('2023-01-01');
    const today = new Date();
    expect(findMonthToFocus(selected, baseDate, () => true, true)).toEqual(today);
  });
  test('should return baseDate if selected and today are not suitable', () => {
    const selected = createDate('2022-12-01');
    const baseDate = createDate('2024-01-01');
    expect(findMonthToFocus(selected, baseDate, date => date.getFullYear() === 2024, true)).toEqual(baseDate);
  });
  describe('2-up grid', () => {
    test('should return selected date if it is enabled and in the next year as baseDate', () => {
      const selected = createDate('2024-03');
      const baseDate = createDate('2023-06');
      expect(findMonthToFocus(selected, baseDate, () => true, false)).toEqual(selected);
    });
    test('should return today if selected is null, today is enabled and in the next year as baseDate', () => {
      const baseDate = createDate('2022-12-01');
      const today = new Date();
      expect(findMonthToFocus(null, baseDate, () => true, false)).toEqual(today);
    });
  });
});
describe('findMonthToDisplay', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-06-15'));
  });
  afterEach(() => {
    MockDate.reset();
  });
  test.each(['current', 'previous', 'auto'] as DateRangePickerProps.StartPeriod[])(
    'should return start date month for single grid, regardless of startPeriod (%s)',
    startPeriod => {
      const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
      const result = findMonthToDisplay(value, true, startPeriod);
      expect(result).toEqual(createDate('2023-03-01'));
    }
  );
  test('should return month of start date for double grid with startPeriod "current"', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2023-03-01'));
  });
  test('should return month of start date for double grid with startPeriod "auto"', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false, 'auto');
    expect(result).toEqual(createDate('2023-03-01'));
  });
  test('should return previous month to start date for double grid with startPeriod "previous"', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-02-01'));
  });
  test('should keep startPeriod "previous" when range spans 1 month (same month)', () => {
    const value = { start: { date: '2023-03-10', time: '00:00' }, end: { date: '2023-03-20', time: '00:00' } };
    const result = findMonthToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-02-01'));
  });
  test('should override startPeriod "previous" to "current" when range spans more than 1 month', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '2023-04-01', time: '00:00' } };
    const result = findMonthToDisplay(value, false, 'previous');
    // Should behave like 'current': left panel shows March, right panel shows April
    expect(result).toEqual(createDate('2023-03-01'));
  });
  test.each(['current', 'previous', 'auto'] as DateRangePickerProps.StartPeriod[])(
    'should return month of end date when start date is null in single grid, regardless of startPeriod (%s)',
    startPeriod => {
      const value = { start: { date: '', time: '' }, end: { date: '2023-07-20', time: '00:00' } };
      const result = findMonthToDisplay(value, true, startPeriod);
      expect(result).toEqual(createDate('2023-07-01'));
    }
  );
  test('should return end date month when start date is null with startPeriod "current"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '2023-07-20', time: '00:00' } };
    const result = findMonthToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2023-07-01'));
  });
  test('should return month before end date month when start date is null with startPeriod "previous"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '2023-07-20', time: '00:00' } };
    const result = findMonthToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-06-01'));
  });
  test.each(['current', 'previous', 'auto'] as DateRangePickerProps.StartPeriod[])(
    'should return current monthwhen both start and end dates are null in single grid, regardless of startPeriod (%s)',
    startPeriod => {
      const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
      const result = findMonthToDisplay(value, true, startPeriod);
      expect(result).toEqual(createDate('2023-06-01')); // Based on the mocked current date
    }
  );
  test('should return current month when value is empty with startPeriod "current"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2023-06-01'));
  });
  test('should return month before current month when value is empty with startPeriod "previous"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-05-01'));
  });
  test('should handle leap years correctly', () => {
    jest.setSystemTime(createDate('2024-02-15').getTime());
    const value = { start: { date: '2024-02-29', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, true, 'current');
    expect(result).toEqual(createDate('2024-02-01'));
  });
  test('should handle year change for double grid with startPeriod "current"', () => {
    const value = { start: { date: '2023-12-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2023-12-01'));
  });
  test('should not change year for double grid with startPeriod "previous" on December', () => {
    const value = { start: { date: '2023-12-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-11-01'));
  });
  test('should override startPeriod "previous" when range crosses year boundary and spans more than 2 months', () => {
    const value = { start: { date: '2023-11-15', time: '00:00' }, end: { date: '2024-03-15', time: '00:00' } };
    const result = findMonthToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-11-01'));
  });
  test('should prioritize start date over end date', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '2023-07-20', time: '00:00' } };
    const result = findMonthToDisplay(value, true, 'current');
    expect(result).toEqual(createDate('2023-03-01'));
  });
});
describe('findYearToDisplay', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-06-15'));
  });
  afterEach(() => {
    MockDate.reset();
  });
  test.each(['current', 'previous', 'auto'] as DateRangePickerProps.StartPeriod[])(
    'should return start date year for single grid, regardless of startPeriod (%s)',
    startPeriod => {
      const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
      const result = findYearToDisplay(value, true, startPeriod);
      expect(result).toEqual(createDate('2023-01-01'));
    }
  );
  test('should return year of start date for double grid with startPeriod "current"', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should return year of start date for double grid with startPeriod "auto"', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'auto');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should return previous year to start date for double grid with startPeriod "previous"', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2022-01-01'));
  });
  test('should keep startPeriod "previous" when range spans 1 year (same year)', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '2023-11-15', time: '00:00' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2022-01-01'));
  });
  test('should override startPeriod "previous" to "current" when range spans more than 1 year', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '2024-06-15', time: '00:00' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should override startPeriod "previous" to "current" when range spans exactly 3 years', () => {
    const value = { start: { date: '2023-01-01', time: '00:00' }, end: { date: '2025-12-31', time: '00:00' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test.each(['current', 'previous', 'auto'] as DateRangePickerProps.StartPeriod[])(
    'should return year of end date when start date is null in single grid, regardless of startPeriod (%s)',
    startPeriod => {
      const value = { start: { date: '', time: '' }, end: { date: '2024-07-20', time: '00:00' } };
      const result = findYearToDisplay(value, true, startPeriod);
      expect(result).toEqual(createDate('2024-01-01'));
    }
  );
  test('should return end date year when start date is null with startPeriod "current"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '2024-07-20', time: '00:00' } };
    const result = findYearToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2024-01-01'));
  });
  test('should return year before end date year when start date is null with startPeriod "previous"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '2024-07-20', time: '00:00' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test.each(['current', 'previous', 'auto'] as DateRangePickerProps.StartPeriod[])(
    'should return current year when both start and end dates are null in single grid, regardless of startPeriod (%s)',
    startPeriod => {
      const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
      const result = findYearToDisplay(value, true, startPeriod);
      expect(result).toEqual(createDate('2023-01-01')); // Based on the mocked current date
    }
  );
  test('should return current year when value is empty with startPeriod "current"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should return year before current year when value is empty with startPeriod "previous"', () => {
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2022-01-01'));
  });
  test('should handle leap years correctly', () => {
    const value = { start: { date: '2024-02-29', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true, 'current');
    expect(result).toEqual(createDate('2024-01-01'));
  });
  test('should handle year change for double grid with startPeriod "current"', () => {
    const value = { start: { date: '2023-12-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should not change year for double grid with startPeriod "previous" on December', () => {
    const value = { start: { date: '2023-12-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2022-01-01'));
  });
  test('should prioritize start date over end date', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '2024-07-20', time: '00:00' } };
    const result = findYearToDisplay(value, true, 'current');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should handle end of year dates', () => {
    const value = { start: { date: '2023-12-31', time: '23:59' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true, 'current');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should handle start of year dates', () => {
    const value = { start: { date: '2023-01-01', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true, 'current');
    expect(result).toEqual(createDate('2023-01-01'));
  });
  test('should handle current date of first day of month: current', () => {
    MockDate.set(new Date('2026-04-01'));
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'current');
    expect(result).toEqual(createDate('2026-01-01'));
  });
  test('should handle current date of first day of month: auto', () => {
    MockDate.set(new Date('2026-04-01'));
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'auto');
    expect(result).toEqual(createDate('2025-01-01'));
  });
  test('should handle current date of first day of month: previous', () => {
    MockDate.set(new Date('2026-04-01'));
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false, 'previous');
    expect(result).toEqual(createDate('2025-01-01'));
  });
});
