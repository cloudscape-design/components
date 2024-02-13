// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import DatePickerWrapper from '../../../lib/components/test-utils/dom/date-picker';
import { DatePickerProps } from '../../../lib/components/date-picker';
import { KeyCode } from '../../../lib/components/internal/keycode';
import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.selectors.js';
import { padLeftZeros } from '../../../lib/components/internal/utils/strings/pad-left-zeros';
import {
  findCalendarDates,
  findCalendarHeaderText,
  findCurrentDate,
  findFocusableDateText,
  findFocusedDate,
  renderDatePicker,
} from './common';

describe('Date picker calendar at month granularity', () => {
  const defaultProps: DatePickerProps = {
    granularity: 'month',
    i18nStrings: {
      currentMonthAriaLabel: 'Current month',
      nextYearAriaLabel: 'Next year',
      previousYearAriaLabel: 'Previous year',
    },
    value: '2018-03',
  };

  const openDatePicker = (props: Partial<DatePickerProps> = defaultProps) => {
    const { wrapper } = renderDatePicker({ ...defaultProps, ...props });
    wrapper.focus();
    wrapper.findOpenCalendarButton().click();
    return wrapper;
  };

  beforeEach(() => {
    // Set default locale of the browser to en-US for more consistent tests
    const locale = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  describe('localization', () => {
    test('should render calendar with the default locale', () => {
      const wrapper = openDatePicker();
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe('2018');
      expect(findCalendarDates(wrapper)).toEqual([
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]);
    });

    test('should allow locale override', () => {
      const wrapper = openDatePicker({ locale: 'de' });
      expect(findCalendarHeaderText(wrapper)).toBe('2018');
      expect(findCalendarDates(wrapper)).toEqual([
        'Jan',
        'Feb',
        'Mär',
        'Apr',
        'Mai',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Okt',
        'Nov',
        'Dez',
      ]);
    });
  });

  describe('keyboard navigation', () => {
    let wrapper: DatePickerWrapper;
    beforeEach(() => {
      wrapper = openDatePicker({ value: '2024-05' });
    });

    test('should have the selected date be initially focusable', () => {
      expect(findFocusableDateText(wrapper)).toBe('May');
    });

    test('should go to the next month', () => {
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
      expect(findFocusableDateText(wrapper)).toBe('Jun');
    });

    test('should go to the previous month', () => {
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
      expect(findFocusableDateText(wrapper)).toBe('Apr');
    });

    test('should go to the month below', () => {
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.down);
      expect(findFocusableDateText(wrapper)).toBe('Aug');
    });

    test('should go to the month above', () => {
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.up);
      expect(findFocusableDateText(wrapper)).toBe('Feb');
    });

    test('should go to the previous year by going up', () => {
      wrapper = openDatePicker({ value: '2024-02' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.up);
      expect(findFocusableDateText(wrapper)).toBe('Nov');
      expect(findCalendarHeaderText(wrapper)).toBe('2023');
    });

    test('should go to the previous year by going left', () => {
      wrapper = openDatePicker({ value: '2024-01' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
      expect(findFocusableDateText(wrapper)).toBe('Dec');
      expect(findCalendarHeaderText(wrapper)).toBe('2023');
    });

    test('should go to the next year by going down', () => {
      wrapper = openDatePicker({ value: '2024-11' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.down);
      expect(findFocusableDateText(wrapper)).toBe('Feb');
      expect(findCalendarHeaderText(wrapper)).toBe('2025');
    });

    test('should go to the next year by going right', () => {
      wrapper = openDatePicker({ value: '2024-12' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
      expect(findFocusableDateText(wrapper)).toBe('Jan');
      expect(findCalendarHeaderText(wrapper)).toBe('2025');
    });

    test('should focus next available month if the first month of the year is disabled', () => {
      const isDateEnabled = (date: Date) => date.getMonth() > 0;
      wrapper = openDatePicker({ value: '2024-01', isDateEnabled });
      expect(findFocusableDateText(wrapper)).toBe('Feb');
      expect(findCalendarHeaderText(wrapper)).toBe('2024');
    });

    test('should focus next available month if available months are spread across different years', () => {
      const isDateEnabled = (date: any) => {
        const formattedDate = [date.getFullYear(), padLeftZeros((date.getMonth() + 1).toString(), 2)].join('-');
        return ['2022-02', '2023-04', '2024-03'].includes(formattedDate);
      };
      wrapper = openDatePicker({ value: '2022-02', isDateEnabled });
      expect(findFocusableDateText(wrapper)).toBe('Feb');
      expect(findCalendarHeaderText(wrapper)).toBe('2022');
      // Navigate to future available dates across different years
      wrapper.findCalendar()!.keydown(KeyCode.tab);
      wrapper.findCalendar()!.keydown(KeyCode.tab);
      wrapper.findCalendar()!.keydown(KeyCode.tab);
      findFocusedDate(wrapper)!.keydown(KeyCode.right);
      expect(findFocusableDateText(wrapper)).toBe('Apr');
      expect(findCalendarHeaderText(wrapper)).toBe('2023');
      findFocusedDate(wrapper)!.keydown(KeyCode.right);
      expect(findFocusableDateText(wrapper)).toBe('Mar');
      expect(findCalendarHeaderText(wrapper)).toBe('2024');
      // Navigate to past available dates across differnet years
      findFocusedDate(wrapper)!.keydown(KeyCode.left);
      expect(findFocusableDateText(wrapper)).toBe('Apr');
      expect(findCalendarHeaderText(wrapper)).toBe('2023');
      findFocusedDate(wrapper)!.keydown(KeyCode.left);
      expect(findFocusableDateText(wrapper)).toBe('Feb');
      expect(findCalendarHeaderText(wrapper)).toBe('2022');
    });

    test('should jump over a disabled date in the future', () => {
      const isDateEnabled = (date: Date) => date.getMonth() !== 3;
      const wrapper = openDatePicker({ isDateEnabled, value: '2018-03' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
      expect(findFocusableDateText(wrapper)).toBe('May');
    });

    test('should jump over a disabled date in the past', () => {
      const isDateEnabled = (date: Date) => date.getMonth() !== 1;
      const wrapper = openDatePicker({ isDateEnabled, value: '2018-03' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
      expect(findFocusableDateText(wrapper)).toBe('Jan');
    });

    test('should jump to the next year when all remaining months in the year are disabled', () => {
      const isDateEnabled = (date: Date) => date.getMonth() < 3;
      const wrapper = openDatePicker({ isDateEnabled, value: '2018-03' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
      expect(findFocusableDateText(wrapper)).toBe('Jan');
      expect(findCalendarHeaderText(wrapper)).toBe('2019');
    });

    test('should jump to the previous year when all remaining previous months in the year are disabled', () => {
      const isDateEnabled = (date: Date) => date.getMonth() > 1;
      const wrapper = openDatePicker({ isDateEnabled, value: '2018-03' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
      expect(findFocusableDateText(wrapper)).toBe('Dec');
      expect(findCalendarHeaderText(wrapper)).toBe('2017');
    });

    test('should not move focus forward if there are no more enabled dates in the future', () => {
      const maxDate = new Date(2018, 3, 1).getTime(); // April 1st
      const isDateEnabled = (date: Date) => date.getTime() < maxDate;
      const wrapper = openDatePicker({ isDateEnabled, value: '2018-03' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
      expect(findFocusableDateText(wrapper)).toBe('Mar');
      expect(findCalendarHeaderText(wrapper)).toBe('2018');
    });

    test('should not move focus backward if there are no more enabled dates in the past', () => {
      const minDate = new Date(2018, 1, 28).getTime(); // February 28th
      const isDateEnabled = (date: Date) => date.getTime() > minDate;
      const wrapper = openDatePicker({ isDateEnabled, value: '2018-03' });
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
      expect(findFocusableDateText(wrapper)).toBe('Mar');
      expect(findCalendarHeaderText(wrapper)).toBe('2018');
    });

    test('should display the current year with current selection but without focusable months if there is no enabled month in it', () => {
      const minDate = new Date(2019, 0, 1).getTime(); // January 1st
      const isDateEnabled = (date: Date) => date.getTime() > minDate;
      const wrapper = openDatePicker({ value: '2018-03', isDateEnabled });
      expect(findCalendarHeaderText(wrapper)).toBe('2018');
      expect(
        wrapper.findCalendar()!.findSelectedDate()?.find(`:not(.${screenreaderOnlyStyles.root}`)?.getElement()
          .textContent
      ).toBe('Mar');
      expect(findFocusableDateText(wrapper)).toBeNull();
    });

    test('does not focus anything if all dates are disabled', () => {
      const isDateEnabled = () => false;
      const wrapper = openDatePicker({ isDateEnabled });
      wrapper.setInputValue('2018/03');
      expect(findFocusableDateText(wrapper)).toBeNull();
    });
  });

  describe('disabled month', () => {
    // Enabled until May, disabled from June.
    const isDateEnabled = (date: Date) => date.getMonth() < 5;

    test('should be able to select enabled month', () => {
      const onChangeSpy = jest.fn();

      const wrapper = openDatePicker({
        value: '2018-03',
        isDateEnabled,
        onChange: onChangeSpy,
      });
      wrapper
        .findCalendar()!
        .findDateAt(2, 2) // May
        .click();

      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-05' } }));
    });

    test('should not select disabled month', () => {
      const wrapper = openDatePicker({ value: '2018-03', isDateEnabled });

      wrapper
        .findCalendar()!
        .findDateAt(2, 3) // June
        .click();

      expect(findFocusableDateText(wrapper)).toBe('Mar');
      expect(wrapper.findNativeInput().getElement().value).toBe('2018/03');
    });
  });

  describe('aria labels', () => {
    test('should add `currentMonthAriaLabel` to the current month in the calendar', () => {
      const wrapper = openDatePicker({
        value: undefined,
        i18nStrings: { currentMonthAriaLabel: 'TEST CURRENT MONTH' },
      });

      expect(findCurrentDate(wrapper).find(`.${screenreaderOnlyStyles.root}`)?.getElement().textContent).toMatch(
        'TEST CURRENT MONTH'
      );
    });

    test('should add aria-selected="true" to selected month in the calendar', () => {
      const wrapper = openDatePicker();
      expect(wrapper.findCalendar()!.findSelectedDate().getElement().getAttribute('aria-selected')).toBe('true');
    });

    test('should not set aria-selected when the date is disabled', () => {
      // Enabled until May, disabled from June.
      const isDateEnabled = (date: Date) => date.getMonth() < 5;
      const wrapper = openDatePicker({ isDateEnabled });
      const june = wrapper.findCalendar()!.findDateAt(2, 3);
      expect(june!.getElement().getAttribute('aria-selected')).toBe(null);
    });

    test('should add aria-current="date" to the current month in the calendar', () => {
      const wrapper = openDatePicker({ value: undefined });
      expect(findCurrentDate(wrapper).getElement()!.getAttribute('aria-current')).toBe('date');
    });

    test('should add `nextYearAriaLabel` to appropriate button in the calendar', () => {
      const wrapper = openDatePicker({
        i18nStrings: { nextYearAriaLabel: 'TEST NEXT YEAR' },
      });
      expect(wrapper.findCalendar()!.findNextMonthButton()!.getElement()!.getAttribute('aria-label')).toMatch(
        'TEST NEXT YEAR'
      );
    });

    test('should add `previousYearAriaLabel` to appropriate button in the calendar', () => {
      const wrapper = openDatePicker({
        i18nStrings: { previousYearAriaLabel: 'TEST PREVIOUS YEAR' },
      });
      expect(wrapper.findCalendar()!.findPreviousMonthButton()!.getElement()!.getAttribute('aria-label')).toMatch(
        'TEST PREVIOUS YEAR'
      );
    });

    test('should add date label to date in the calendar', () => {
      const wrapper = openDatePicker({ value: '2024-01' });
      expect(
        wrapper.findCalendar()!.findSelectedDate().find(':not([aria-hidden=true])')?.getElement().textContent
      ).toBe('January 2024');
    });
  });
});
