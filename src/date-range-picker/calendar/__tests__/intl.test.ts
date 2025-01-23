// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MockDate from 'mockdate';

import * as intl from '../grids/intl';

const GetDateLabelSpy = jest.spyOn(intl, 'getDateLabel').mockReturnValue('June 2023');
const RenderMonthAndYearSpy = jest.spyOn(intl, 'renderMonthAndYear').mockReturnValue('June 2023');

describe('intl', () => {
  afterAll(() => {
    GetDateLabelSpy.mockRestore();
    RenderMonthAndYearSpy.mockRestore();
  });

  beforeEach(() => {
    GetDateLabelSpy.mockClear();
    RenderMonthAndYearSpy.mockClear();
  });
  describe('setDayIndex', () => {
    test('sets the day to the same day of the week', () => {
      const date = new Date('2023-06-14'); // Wednesday, June 14, 2023
      intl.setDayIndex(date, 3); // 3 is Wednesday
      expect(date.getDay()).toBe(3);
      expect(date.toISOString()).toBe('2023-06-14T00:00:00.000Z');
    });

    test('sets the day to a later day in the same week', () => {
      const date = new Date('2023-06-14'); // Wednesday, June 14, 2023
      intl.setDayIndex(date, 5); // 5 is Friday
      expect(date.getDay()).toBe(5);
      expect(date.toISOString()).toBe('2023-06-16T00:00:00.000Z');
    });

    test('sets the day to an earlier day in the same week', () => {
      const date = new Date('2023-06-14'); // Wednesday, June 14, 2023
      intl.setDayIndex(date, 1); // 1 is Monday
      expect(date.getDay()).toBe(1);
      expect(date.toISOString()).toBe('2023-06-12T00:00:00.000Z');
    });

    test('handles week boundary (Sunday to Saturday)', () => {
      const date = new Date('2023-06-11'); // Sunday, June 11, 2023
      intl.setDayIndex(date, 6); // 6 is Saturday
      expect(date.getDay()).toBe(6);
      expect(date.toISOString()).toBe('2023-06-17T00:00:00.000Z');
    });

    test('handles week boundary (Saturday to Sunday)', () => {
      const date = new Date('2023-06-17'); // Saturday, June 17, 2023
      intl.setDayIndex(date, 0); // 0 is Sunday
      expect(date.getDay()).toBe(0);
      expect(date.toISOString()).toBe('2023-06-11T00:00:00.000Z');
    });

    test('handles month boundary', () => {
      const date = new Date('2023-06-30'); // Friday, June 30, 2023
      intl.setDayIndex(date, 0); // 0 is Sunday
      expect(date.getDay()).toBe(0);
      expect(date.toISOString()).toBe('2023-06-25T00:00:00.000Z');
    });

    test('handles year boundary', () => {
      const date = new Date('2023-12-31'); // Sunday, December 31, 2023
      intl.setDayIndex(date, 2); // 2 is Tuesday
      expect(date.getDay()).toBe(2);
      expect(date.toISOString()).toBe('2024-01-02T00:00:00.000Z');
    });

    test('handles leap year', () => {
      const date = new Date('2024-02-28'); // Wednesday, February 28, 2024
      intl.setDayIndex(date, 4); // 4 is Thursday
      expect(date.getDay()).toBe(4);
      expect(date.toISOString()).toBe('2024-02-29T00:00:00.000Z');
    });

    test('maintains the time component', () => {
      const date = new Date('2023-06-14T15:30:45'); // Wednesday, June 14, 2023, 15:30:45
      intl.setDayIndex(date, 5); // 5 is Friday
      expect(date.getDay()).toBe(5);
      expect(date.toISOString()).toBe('2023-06-16T15:30:45.000Z');
    });
  });

  describe('renderDayName', () => {
    beforeEach(() => {
      MockDate.set(new Date('2023-06-11T00:00:00Z'));
    });

    afterEach(() => {
      MockDate.reset();
    });

    test('renders short day names in English', () => {
      expect(intl.renderDayName('en-US', 0, 'short')).toBe('Sun');
      expect(intl.renderDayName('en-US', 1, 'short')).toBe('Mon');
      expect(intl.renderDayName('en-US', 6, 'short')).toBe('Sat');
    });

    test('renders long day names in English', () => {
      expect(intl.renderDayName('en-US', 0, 'long')).toBe('Sunday');
      expect(intl.renderDayName('en-US', 1, 'long')).toBe('Monday');
      expect(intl.renderDayName('en-US', 6, 'long')).toBe('Saturday');
    });

    test('renders short day names in Spanish', () => {
      expect(intl.renderDayName('es-ES', 0, 'short')).toBe('dom');
      expect(intl.renderDayName('es-ES', 1, 'short')).toBe('lun');
      expect(intl.renderDayName('es-ES', 6, 'short')).toBe('sáb');
    });

    test('renders long day names in Spanish', () => {
      expect(intl.renderDayName('es-ES', 0, 'long')).toBe('domingo');
      expect(intl.renderDayName('es-ES', 1, 'long')).toBe('lunes');
      expect(intl.renderDayName('es-ES', 6, 'long')).toBe('sábado');
    });

    test('handles different locales', () => {
      expect(intl.renderDayName('fr-FR', 3, 'short')).toBe('mer.');
      expect(intl.renderDayName('de-DE', 3, 'long')).toBe('Mittwoch');
      expect(intl.renderDayName('ja-JP', 3, 'short')).toBe('水');
      expect(intl.renderDayName('ar-SA', 3, 'long')).toBe('الأربعاء');
    });
  });

  describe('renderMonthAndYear', () => {
    beforeEach(() => {
      RenderMonthAndYearSpy.mockRestore();
    });
    test('renders month and year in English (US)', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderMonthAndYear('en-US', date)).toBe('June 2023');
    });

    test('renders month and year in English (UK)', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderMonthAndYear('en-GB', date)).toBe('June 2023');
    });

    test('renders month and year in Spanish', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderMonthAndYear('es-ES', date)).toBe('junio de 2023');
    });

    test('renders month and year in French', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderMonthAndYear('fr-FR', date)).toBe('juin 2023');
    });

    test('renders month and year in German', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderMonthAndYear('de-DE', date)).toBe('Juni 2023');
    });

    test('renders month and year in Japanese', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderMonthAndYear('ja-JP', date)).toBe('2023年6月');
    });

    test('renders month and year in Arabic', () => {
      const date = new Date('2023-06-15');
      //todo confirm it shouldn't be 'يونيو ٢٠٢٣'
      expect(intl.renderMonthAndYear('ar-SA', date)).toBe('ذو القعدة ١٤٤٤ هـ');
    });

    test('handles different months', () => {
      expect(intl.renderMonthAndYear('en-US', new Date('2023-01-01'))).toBe('January 2023');
      expect(intl.renderMonthAndYear('en-US', new Date('2023-12-31'))).toBe('December 2023');
    });

    test('handles different years', () => {
      expect(intl.renderMonthAndYear('en-US', new Date('2020-06-15'))).toBe('June 2020');
      expect(intl.renderMonthAndYear('en-US', new Date('2025-06-15'))).toBe('June 2025');
    });

    test('handles leap years', () => {
      expect(intl.renderMonthAndYear('en-US', new Date('2024-02-29'))).toBe('February 2024');
    });
  });

  describe('renderYear', () => {
    test('renders year in English (US)', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderYear('en-US', date)).toBe('2023');
    });

    test('renders year in English (UK)', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderYear('en-GB', date)).toBe('2023');
    });

    test('renders year in Spanish', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderYear('es-ES', date)).toBe('2023');
    });

    test('renders year in French', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderYear('fr-FR', date)).toBe('2023');
    });

    test('renders year in German', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderYear('de-DE', date)).toBe('2023');
    });

    test('renders year in Japanese', () => {
      const date = new Date('2023-06-15');
      expect(intl.renderYear('ja-JP', date)).toBe('2023年');
    });

    test('renders year in Arabic', () => {
      const date = new Date('2023-06-15');
      //todo confirm not '٢٠٢٣'
      expect(intl.renderYear('ar-SA', date)).toBe('١٤٤٤ هـ');
    });

    test('handles different years', () => {
      expect(intl.renderYear('en-US', new Date('2020-01-01'))).toBe('2020');
      expect(intl.renderYear('en-US', new Date('2025-12-31'))).toBe('2025');
    });

    test('handles leap years', () => {
      expect(intl.renderYear('en-US', new Date('2024-02-29'))).toBe('2024');
    });

    test('ignores month and day', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-12-31');
      expect(intl.renderYear('en-US', date1)).toBe(intl.renderYear('en-US', date2));
    });
  });

  describe('getDateLabel', () => {
    beforeEach(() => {
      GetDateLabelSpy.mockRestore();
    });

    test('renders full date label in English (US)', () => {
      const date = new Date('2023-06-15');
      expect(intl.getDateLabel('en-US', date)).toBe('Thursday, June 15, 2023');
    });

    test('renders short date label in English (US)', () => {
      const date = new Date('2023-06-15');
      expect(intl.getDateLabel('en-US', date, 'short')).toBe('June 15, 2023');
    });

    test('renders full date label in Spanish', () => {
      const date = new Date('2023-06-15');
      expect(intl.getDateLabel('es-ES', date)).toBe('jueves, 15 de junio de 2023');
    });

    test('renders short date label in Spanish', () => {
      const date = new Date('2023-06-15');
      expect(intl.getDateLabel('es-ES', date, 'short')).toBe('15 de junio de 2023');
    });

    test('renders full date label in French', () => {
      const date = new Date('2023-06-15');
      expect(intl.getDateLabel('fr-FR', date)).toBe('jeudi 15 juin 2023');
    });

    test('renders full date label in German', () => {
      const date = new Date('2023-06-15');
      expect(intl.getDateLabel('de-DE', date)).toBe('Donnerstag, 15. Juni 2023');
    });

    test('renders full date label in Japanese', () => {
      const date = new Date('2023-06-15');
      expect(intl.getDateLabel('ja-JP', date)).toBe('2023年6月15日木曜日');
    });

    test('handles different dates', () => {
      expect(intl.getDateLabel('en-US', new Date('2023-01-01'))).toBe('Sunday, January 1, 2023');
      expect(intl.getDateLabel('en-US', new Date('2023-12-31'))).toBe('Sunday, December 31, 2023');
    });

    test('handles leap years', () => {
      expect(intl.getDateLabel('en-US', new Date('2024-02-29'))).toBe('Thursday, February 29, 2024');
    });
  });

  describe('renderTimeLabel', () => {
    const testDate = new Date('2023-06-15T14:30:45');

    test('renders time with default format in English (US)', () => {
      expect(intl.renderTimeLabel('en-US', testDate)).toMatch(/^2:30:45 PM$/);
    });

    test('renders time with default format in English (UK)', () => {
      expect(intl.renderTimeLabel('en-GB', testDate)).toMatch(/^14:30:45$/);
    });

    test('renders time with "hh" format in English (US)', () => {
      expect(intl.renderTimeLabel('en-US', testDate, 'hh')).toMatch(/^02 PM$/);
    });

    test('renders time with "hh:mm" format in English (US)', () => {
      expect(intl.renderTimeLabel('en-US', testDate, 'hh:mm')).toMatch(/^02:30 PM$/);
    });

    test('renders time with "hh" format in English (UK)', () => {
      expect(intl.renderTimeLabel('en-GB', testDate, 'hh')).toMatch(/^14$/);
    });

    test('renders time with "hh:mm" format in English (UK)', () => {
      expect(intl.renderTimeLabel('en-GB', testDate, 'hh:mm')).toMatch(/^14:30$/);
    });

    test('renders time with default format in Spanish', () => {
      expect(intl.renderTimeLabel('es-ES', testDate)).toMatch(/^14:30:45$/);
    });

    test('renders time with "hh:mm" format in Spanish', () => {
      expect(intl.renderTimeLabel('es-ES', testDate, 'hh:mm')).toMatch(/^14:30$/);
    });

    test('renders time with default format in Japanese', () => {
      expect(intl.renderTimeLabel('ja-JP', testDate)).toMatch(/^14:30:45$/);
    });

    test('renders time with "hh:mm" format in Japanese', () => {
      expect(intl.renderTimeLabel('ja-JP', testDate, 'hh:mm')).toMatch(/^14:30$/);
    });

    test('handles midnight correctly in English (US)', () => {
      const midnightDate = new Date('2023-06-15T00:00:00');
      expect(intl.renderTimeLabel('en-US', midnightDate, 'hh:mm')).toMatch(/^12:00 AM$/);
    });

    test('handles noon correctly in English (US)', () => {
      const noonDate = new Date('2023-06-15T12:00:00');
      expect(intl.renderTimeLabel('en-US', noonDate, 'hh:mm')).toMatch(/^12:00 PM$/);
    });

    test('handles single-digit hours correctly', () => {
      const singleDigitHourDate = new Date('2023-06-15T09:05:00');
      expect(intl.renderTimeLabel('en-US', singleDigitHourDate, 'hh:mm')).toMatch(/^09:05 AM$/);
    });
  });

  describe('renderDateAnnouncement', () => {
    test('renders date with day granularity', () => {
      const result = intl.renderDateAnnouncement({
        date: new Date('2023-06-15'),
        isCurrent: false,
        locale: 'en-US',
      });
      expect(result).toBe('June 15, 2023');
    });

    test('renders date with month granularity', () => {
      const result = intl.renderDateAnnouncement({
        date: new Date('2023-06-15'),
        isCurrent: false,
        locale: 'en-US',
        granularity: 'month',
      });
      expect(result).toBe('June 2023');
    });

    test('appends current label when isCurrent is true', () => {
      const result = intl.renderDateAnnouncement({
        date: new Date('2023-06-15'),
        isCurrent: true,
        locale: 'en-US',
        currentLabel: 'Current selection',
      });
      expect(result).toBe('June 15, 2023. Current selection');
    });

    test('does not append current label when isCurrent is false', () => {
      const result = intl.renderDateAnnouncement({
        date: new Date('2023-06-15'),
        isCurrent: false,
        locale: 'en-US',
        currentLabel: 'Current selection',
      });
      expect(result).toBe('June 15, 2023');
    });

    test('does not append current label when currentLabel is not provided', () => {
      const result = intl.renderDateAnnouncement({
        date: new Date('2023-06-15'),
        isCurrent: true,
        locale: 'en-US',
      });
      expect(result).toBe('June 15, 2023');
    });

    test('uses day granularity by default', () => {
      const result = intl.renderDateAnnouncement({
        date: new Date('2023-06-15'),
        isCurrent: false,
        locale: 'en-US',
      });
      expect(result).toBe('June 15, 2023');
    });
  });
});
