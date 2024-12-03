// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findDateToFocus, findMonthToDisplay, findMonthToFocus, findYearToDisplay } from '../utils';

// Helper function to create Date objects from YYYY-MM-DD strings
const createDate = (dateString: string) => new Date(dateString);

describe('findDateToFocus', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(createDate('2023-06-15').getTime()); // Set a fixed date for 'today'
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return selected date if it is enabled and in the same month as baseDate', () => {
    const selected = createDate('2023-06-10');
    const baseDate = createDate('2023-06-01');
    expect(findDateToFocus(selected, baseDate, () => true)).toEqual(selected);
  });

  test('should return today if selected is null, today is enabled and in the same month as baseDate', () => {
    const baseDate = createDate('2023-06-01');
    const today = new Date();
    expect(findDateToFocus(null, baseDate, () => true)).toEqual(today);
  });

  test('should return baseDate if selected is null, today is not in the same month, and baseDate is enabled', () => {
    const baseDate = createDate('2023-07-01');
    expect(findDateToFocus(null, baseDate, () => true)).toEqual(baseDate);
  });

  test('should return null if no date is suitable', () => {
    const baseDate = createDate('2023-07-01');
    expect(findDateToFocus(null, baseDate, () => false)).toBeNull();
  });

  test('should return today even if selected is provided but not in the same month as baseDate', () => {
    const selected = createDate('2023-05-01');
    const baseDate = createDate('2023-06-01');
    const today = new Date();
    expect(findDateToFocus(selected, baseDate, () => true)).toEqual(today);
  });

  test('should return baseDate if selected and today are not suitable', () => {
    const selected = createDate('2023-05-01');
    const baseDate = createDate('2023-08-01');
    expect(findDateToFocus(selected, baseDate, (date: Date) => date.getMonth() === 7)).toEqual(baseDate);
  });
});

describe('findMonthToFocus', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(createDate('2023-06-15').getTime()); // Set a fixed date for 'today'
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return selected date if it is enabled and in the same year as baseDate', () => {
    const selected = createDate('2023-03-10');
    const baseDate = createDate('2023-06-01');
    expect(findMonthToFocus(selected, baseDate, () => true)).toEqual(selected);
  });

  test('should return today if selected is null, today is enabled and in the same year as baseDate', () => {
    const baseDate = createDate('2023-12-01');
    const today = new Date();
    expect(findMonthToFocus(null, baseDate, () => true)).toEqual(today);
  });

  test('should return baseDate if selected is null, today is not in the same year, and baseDate is enabled', () => {
    const baseDate = createDate('2024-01-01');
    expect(findMonthToFocus(null, baseDate, () => true)).toEqual(baseDate);
  });

  test('should return null if no date is suitable', () => {
    const baseDate = createDate('2024-01-01');
    expect(findMonthToFocus(null, baseDate, () => false)).toBeNull();
  });

  test('should return today even if selected is provided but not in the same year as baseDate', () => {
    const selected = createDate('2022-12-01');
    const baseDate = createDate('2023-01-01');
    const today = new Date();
    expect(findMonthToFocus(selected, baseDate, () => true)).toEqual(today);
  });

  test('should return baseDate if selected and today are not suitable', () => {
    const selected = createDate('2022-12-01');
    const baseDate = createDate('2024-01-01');
    expect(findMonthToFocus(selected, baseDate, date => date.getFullYear() === 2024)).toEqual(baseDate);
  });

  test('should handle leap years correctly', () => {
    jest.setSystemTime(createDate('2024-02-29').getTime()); // Set 'today' to a leap year
    const baseDate = createDate('2024-01-01');
    const today = new Date();
    expect(findMonthToFocus(null, baseDate, () => true)).toEqual(today);
  });
});

describe('findMonthToDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(createDate('2023-06-15').getTime()); // Set a fixed date for Date.now()
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return start date month for single grid', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, true);
    expect(result).toEqual(createDate('2023-03-01'));
  });

  test('should return next month of start date for double grid', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false);
    expect(result).toEqual(createDate('2023-04-01'));
  });

  test('should return end date month when start date is null', () => {
    const value = { start: { date: '', time: '' }, end: { date: '2023-07-20', time: '00:00' } };
    const result = findMonthToDisplay(value, true); // isSingleGrid doesn't matter in this case
    expect(result).toEqual(createDate('2023-07-01'));
  });

  test('should return current month when both start and end dates are null', () => {
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, true); // isSingleGrid doesn't matter in this case
    expect(result).toEqual(createDate('2023-06-01')); // Based on the mocked current date
  });

  test('should handle leap years correctly', () => {
    jest.setSystemTime(createDate('2024-02-15').getTime());
    const value = { start: { date: '2024-02-29', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, true);
    expect(result).toEqual(createDate('2024-02-01'));
  });

  test('should handle year change for double grid', () => {
    const value = { start: { date: '2023-12-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findMonthToDisplay(value, false);
    expect(result).toEqual(createDate('2024-01-01'));
  });

  test('should prioritize start date over end date', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '2023-07-20', time: '00:00' } };
    const result = findMonthToDisplay(value, true);
    expect(result).toEqual(createDate('2023-03-01'));
  });
});

describe('findYearToDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(createDate('2023-06-15').getTime()); // Set a fixed date for Date.now()
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return start year for single grid', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true);
    expect(result).toEqual(createDate('2023-01-01'));
  });

  test('should return next year of start date for double grid', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false);
    expect(result).toEqual(createDate('2024-01-01'));
  });

  test('should return end year when start date is empty', () => {
    const value = { start: { date: '', time: '' }, end: { date: '2024-07-20', time: '00:00' } };
    const result = findYearToDisplay(value, true); // isSingleGrid doesn't matter in this case
    expect(result).toEqual(createDate('2024-01-01'));
  });

  test('should return current year when both start and end dates are empty', () => {
    const value = { start: { date: '', time: '' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true); // isSingleGrid doesn't matter in this case
    expect(result).toEqual(createDate('2023-01-01')); // Based on the mocked current date
  });

  test('should handle leap years correctly', () => {
    const value = { start: { date: '2024-02-29', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true);
    expect(result).toEqual(createDate('2024-01-01'));
  });

  test('should handle year change for double grid', () => {
    const value = { start: { date: '2023-12-15', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, false);
    expect(result).toEqual(createDate('2024-01-01'));
  });

  test('should prioritize start date over end date', () => {
    const value = { start: { date: '2023-03-15', time: '00:00' }, end: { date: '2024-07-20', time: '00:00' } };
    const result = findYearToDisplay(value, true);
    expect(result).toEqual(createDate('2023-01-01'));
  });

  test('should handle end of year dates', () => {
    const value = { start: { date: '2023-12-31', time: '23:59' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true);
    expect(result).toEqual(createDate('2023-01-01'));
  });

  test('should handle start of year dates', () => {
    const value = { start: { date: '2023-01-01', time: '00:00' }, end: { date: '', time: '' } };
    const result = findYearToDisplay(value, true);
    expect(result).toEqual(createDate('2023-01-01'));
  });
});
