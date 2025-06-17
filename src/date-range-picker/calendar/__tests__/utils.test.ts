// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MockDate from 'mockdate';

import {
  findDateToFocus,
  findMonthToDisplay,
  findMonthToFocus,
  findYearToDisplay,
  generateI18NFallbackKey,
  generateI18NKey,
  provideI18N,
} from '../utils';
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
  test('should handle leap years correctly', () => {
    MockDate.set(new Date('2024-02-29')); // Set 'today' to a leap year
    const baseDate = createDate('2024-02-01');
    const today = new Date();
    expect(findDateToFocus(null, baseDate, () => true)).toEqual(today);
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
});
describe('findMonthToDisplay', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-06-15'));
  });
  afterEach(() => {
    MockDate.reset();
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
    MockDate.set(new Date('2023-06-15'));
  });
  afterEach(() => {
    MockDate.reset();
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

describe('generateI18NKey', () => {
  test('should return isoMonthConstraintText when isMonthPicker is true and isIso is true', () => {
    expect(generateI18NKey(true, false, true)).toBe('i18nStrings.isoMonthConstraintText');
  });

  test('should return slashedMonthConstraintText when isMonthPicker is true and isIso is false', () => {
    expect(generateI18NKey(true, false, false)).toBe('i18nStrings.slashedMonthConstraintText');
  });

  test('should return isoDateConstraintText when isDateOnly is true and isIso is true', () => {
    expect(generateI18NKey(false, true, true)).toBe('i18nStrings.isoDateConstraintText');
  });

  test('should return slashedDateConstraintText when isDateOnly is true and isIso is false', () => {
    expect(generateI18NKey(false, true, false)).toBe('i18nStrings.slashedDateConstraintText');
  });

  test('should return isoDateTimeConstraintText when isDateOnly and isMonthPicker are false and isIso is true', () => {
    expect(generateI18NKey(false, false, true)).toBe('i18nStrings.isoDateTimeConstraintText');
  });

  test('should return slashedDateTimeConstraintText when isDateOnly and isMonthPicker are false and isIso is false', () => {
    expect(generateI18NKey(false, false, false)).toBe('i18nStrings.slashedDateTimeConstraintText');
  });
});

describe('generateI18NFallbackKey', () => {
  test('should return monthConstraintText when isMonthPicker is true', () => {
    expect(generateI18NFallbackKey(true, false)).toBe('i18nStrings.monthConstraintText');
  });

  test('should return dateConstraintText when isDateOnly is true', () => {
    expect(generateI18NFallbackKey(false, true)).toBe('i18nStrings.dateConstraintText');
  });

  test('should return dateTimeConstraintText when isDateOnly and isMonthPicker are false', () => {
    expect(generateI18NFallbackKey(false, false)).toBe('i18nStrings.dateTimeConstraintText');
  });
});

describe('provideI18N', () => {
  const mockI18nStrings = {
    monthConstraintText: 'Month constraint',
    isoMonthConstraintText: 'ISO month constraint',
    slashedMonthConstraintText: 'Slashed month constraint',
    dateConstraintText: 'Date constraint',
    isoDateConstraintText: 'ISO date constraint',
    slashedDateConstraintText: 'Slashed date constraint',
    dateTimeConstraintText: 'Date time constraint',
    isoDateTimeConstraintText: 'ISO date time constraint',
    slashedDateTimeConstraintText: 'Slashed date time constraint',
  };

  test('should return isoMonthConstraintText when isMonthPicker is true and isIso is true', () => {
    expect(provideI18N(mockI18nStrings, true, false, true)).toBe('ISO month constraint');
  });

  test('should return slashedMonthConstraintText when isMonthPicker is true and isIso is false', () => {
    expect(provideI18N(mockI18nStrings, true, false, false)).toBe('Slashed month constraint');
  });

  test('should return monthConstraintText when isMonthPicker is true and specific format text is not available', () => {
    const partialI18nStrings = {
      monthConstraintText: 'Month constraint',
    };
    expect(provideI18N(partialI18nStrings, true, false, true)).toBe('Month constraint');
  });

  test('should return isoDateConstraintText when isDateOnly is true and isIso is true', () => {
    expect(provideI18N(mockI18nStrings, false, true, true)).toBe('ISO date constraint');
  });

  test('should return slashedDateConstraintText when isDateOnly is true and isIso is false', () => {
    expect(provideI18N(mockI18nStrings, false, true, false)).toBe('Slashed date constraint');
  });

  test('should return dateConstraintText when isDateOnly is true and specific format text is not available', () => {
    const partialI18nStrings = {
      dateConstraintText: 'Date constraint',
    };
    expect(provideI18N(partialI18nStrings, false, true, true)).toBe('Date constraint');
  });

  test('should return isoDateTimeConstraintText when isDateOnly and isMonthPicker are false and isIso is true', () => {
    expect(provideI18N(mockI18nStrings, false, false, true)).toBe('ISO date time constraint');
  });

  test('should return slashedDateTimeConstraintText when isDateOnly and isMonthPicker are false and isIso is false', () => {
    expect(provideI18N(mockI18nStrings, false, false, false)).toBe('Slashed date time constraint');
  });

  test('should return dateTimeConstraintText when isDateOnly and isMonthPicker are false and specific format text is not available', () => {
    const partialI18nStrings = {
      dateTimeConstraintText: 'Date time constraint',
    };
    expect(provideI18N(partialI18nStrings, false, false, true)).toBe('Date time constraint');
  });

  test('should return empty string when no matching text is found', () => {
    expect(provideI18N({}, false, false, false)).toBe('');
  });

  test('should handle undefined i18nStrings', () => {
    expect(provideI18N(undefined as any, false, false, false)).toBe('');
  });
});
