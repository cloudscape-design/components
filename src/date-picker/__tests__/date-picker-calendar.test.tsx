// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MockDate from 'mockdate';
import DatePickerWrapper from '../../../lib/components/test-utils/dom/date-picker';
import { DatePickerProps } from '../../../lib/components/date-picker';
import calendarStyles from '../../../lib/components/calendar/styles.selectors.js';
import { KeyCode } from '../../../lib/components/internal/keycode';
import { NonCancelableEventHandler } from '../../../lib/components/internal/events';
import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.selectors.js';
import {
  findCalendarHeaderText,
  findCurrentDate,
  findFocusableDateText,
  findFocusedDate,
  outsideId,
  renderDatePicker,
} from './common';

describe('Date picker calendar', () => {
  const defaultProps: DatePickerProps = {
    i18nStrings: {
      todayAriaLabel: 'Today',
      nextMonthAriaLabel: 'next month',
      previousMonthAriaLabel: 'prev month',
    },
    value: '2018-03-22',
  };

  const findCalendarWeekdays = (wrapper: DatePickerWrapper) => {
    return wrapper
      .findCalendar()!
      .findAll(`.${calendarStyles['calendar-date-header']} :not(.${screenreaderOnlyStyles.root})`)
      .map(day => day.getElement().textContent!.trim());
  };

  beforeEach(() => {
    // Set default locale of the browser to en-US for more consistent tests
    const locale = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  describe('basic calendar interaction', () => {
    let wrapper: DatePickerWrapper, getByTestId: (selector: string) => HTMLElement;

    beforeEach(async () => {
      ({ wrapper, getByTestId } = renderDatePicker(defaultProps));
      wrapper.findOpenCalendarButton().click();
      await runPendingEvents();
    });

    test('should open calendar when clicking on the button', () => {
      expect(wrapper.findCalendar()).not.toBeNull();
    });

    test('should reset the date of the calendar when it is closed and reopened', () => {
      expect(wrapper.findCalendar()).not.toBeNull();
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
      const button = wrapper.findCalendar()!.findPreviousButton();
      button.click();
      button.click();
      button.click();

      expect(findCalendarHeaderText(wrapper)).toBe('December 2017');
      getByTestId(outsideId).click();
      expect(wrapper.findCalendar()).toBeNull();
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
    });

    test('should close when a date is selected', () => {
      expect(wrapper.findCalendar()).not.toBeNull();
      wrapper.findCalendar()!.findDateAt(3, 3).click();
      expect(wrapper.findCalendar()).toBeNull();
    });

    test('should reopen after selection if clicked', () => {
      wrapper.findCalendar()!.findDateAt(3, 3).click();

      wrapper.findOpenCalendarButton().click();

      expect(wrapper.findCalendar()).not.toBeNull();
    });

    describe('with readonly and disabled state', () => {
      test('should not open calendar if input is readonly', () => {
        const { wrapper } = renderDatePicker({ ...defaultProps, readOnly: true });
        wrapper.findOpenCalendarButton().click();
        expect(wrapper.findCalendar()).toBeNull();
      });

      test('should not open calendar if input is disabled', () => {
        const { wrapper } = renderDatePicker({ ...defaultProps, disabled: true });
        wrapper.findOpenCalendarButton().click();
        expect(wrapper.findCalendar()).toBeNull();
      });
    });
  });

  describe('localization', () => {
    test('should render calendar with the default locale', () => {
      const { wrapper } = renderDatePicker(defaultProps);
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
      expect(findCalendarWeekdays(wrapper)).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });

    test('should allow country override', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, locale: 'en-GB' });
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
      expect(findCalendarWeekdays(wrapper)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    });

    test('should allow locale override', () => {
      const locale = 'de-DE';
      const localStringMock = jest.fn().mockReturnValue('März 2018');
      const oldImpl = window.Date.prototype.toLocaleDateString;
      window.Date.prototype.toLocaleDateString = localStringMock;

      const { wrapper } = renderDatePicker({ ...defaultProps, locale });
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe('März 2018');
      // we render 2018/03/22 which results in
      // -> 35 (5 weeks á 7 days) + 7 (weekday names) * 2 + 1 (month name)
      expect(localStringMock).toHaveBeenCalledTimes(51);
      expect(localStringMock).toHaveBeenCalledWith(locale, expect.any(Object));
      window.Date.prototype.toLocaleDateString = oldImpl;
    });

    test('should override start day of week', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, startOfWeek: 4 });
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
      expect(findCalendarWeekdays(wrapper)).toEqual(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']);
    });
  });

  describe('input -> calendar binding', () => {
    beforeEach(() => {
      MockDate.set(new Date(2017, 0, 5));
    });

    afterEach(() => {
      MockDate.reset();
    });

    const checkMonthAndYear = (value: string, monthYear: string) => {
      const { wrapper } = renderDatePicker({ ...defaultProps, value: value });
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe(monthYear);
    };

    test('should open with the current month/year if input is empty', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, value: '' });
      wrapper.findOpenCalendarButton().click();
      expect(findCalendarHeaderText(wrapper)).toBe('January 2017');
    });

    describe('retain the current month/year until a full year is entered', () => {
      it.each([
        ['2', 'January 2017'],
        ['20', 'January 2017'],
        ['201', 'January 2017'],
        ['2015', 'January 2015'],
      ])("for input '%s', '%s' is expected", checkMonthAndYear);
    });

    describe('should display january until a full month is entered', () => {
      it.each([
        ['2012-', 'January 2012'],
        ['2012-0', 'January 2012'],
        ['2012-02', 'February 2012'],
        ['2012-1', 'January 2012'],
        ['2012-11', 'November 2012'],
      ])("for input '%s', '%s' is expected", checkMonthAndYear);
    });
  });

  describe('keyboard navigation', () => {
    describe('without default props', () => {
      let wrapper: DatePickerWrapper;
      let onChangeSpy: jest.Mock<NonCancelableEventHandler<DatePickerProps.ChangeDetail>>;

      const selectionKeys: ReadonlyArray<'enter' | 'space'> = ['enter', 'space'];

      beforeEach(() => {
        onChangeSpy = jest.fn();
        ({ wrapper } = renderDatePicker({ ...defaultProps, onChange: onChangeSpy }));
        wrapper.focus();
        wrapper.findOpenCalendarButton().click();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      test('should have the selected date be initially focusable', () => {
        expect(findFocusableDateText(wrapper)).toBe('22');
      });

      test('should go to the next day', () => {
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
        expect(findFocusableDateText(wrapper)).toBe('23');
      });

      test('should go to the previous day', () => {
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
        expect(findFocusableDateText(wrapper)).toBe('21');
      });

      test('should go to the previous week', () => {
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.up);
        expect(findFocusableDateText(wrapper)).toBe('15');
      });

      test('should go to the next week', () => {
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.down);
        expect(findFocusableDateText(wrapper)).toBe('29');
      });

      test('should go to the previous month', () => {
        const { wrapper } = renderDatePicker({ ...defaultProps, onChange: onChangeSpy, value: '2018-03-03' });
        wrapper.focus();
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.up);

        expect(findFocusableDateText(wrapper)).toBe('24');
        expect(findCalendarHeaderText(wrapper)).toBe('February 2018');
      });

      test('should go to the next month', () => {
        const { wrapper } = renderDatePicker({ ...defaultProps, onChange: onChangeSpy, value: '2018-03-29' });
        wrapper.focus();
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.down);

        expect(findFocusableDateText(wrapper)).toBe('5');
        expect(findCalendarHeaderText(wrapper)).toBe('April 2018');
      });

      test.each(selectionKeys)('should allow initially selected date to be re-selected with %s', key => {
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode[key]);
        expect(document.activeElement).toBe(wrapper.findOpenCalendarButton().getElement());
        expect(wrapper.findCalendar()).toBeNull();
      });

      test.each(selectionKeys)('should not change the selected date before %s is pressed', key => {
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.down);
        expect(wrapper.findNativeInput().getElement().value).toBe('2018/03/22');
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode[key]);
        expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-03-29' } }));
      });

      test.each(selectionKeys)(
        'should close the dropdown and focus the "open calendar" button when %s is pressed',
        key => {
          const date = wrapper.findCalendar()!.findSelectedDate();
          date.keydown(KeyCode.down);
          date.keydown(KeyCode[key]);
          expect(document.activeElement).toBe(wrapper.findOpenCalendarButton().getElement());
          expect(wrapper.findCalendar()).toBeNull();
        }
      );

      test('should close the dropdown and focus the "open calendar" button when escape is pressed', () => {
        wrapper.findCalendar()!.keydown(KeyCode.escape);
        expect(document.activeElement).toBe(wrapper.findOpenCalendarButton().getElement());
        expect(wrapper.findCalendar()).toBeNull();
      });

      test('should close the dropdown and focus the "open calendar" button when escape is pressed after keyboard navigation', () => {
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        wrapper.findCalendar()!.keydown(KeyCode.right);
        wrapper.findCalendar()!.keydown(KeyCode.escape);
        expect(document.activeElement).toBe(wrapper.findOpenCalendarButton().getElement());
        expect(wrapper.findCalendar()).toBeNull();
      });

      test('should allow first date to be focused after moving dates then navigating between months', () => {
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        wrapper.findCalendar()!.keydown(KeyCode.tab);

        // focus a new date
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
        // navigate to previous month
        wrapper.findCalendar()!.findPreviousButton().click();
        expect(findFocusableDateText(wrapper)).toBe('1');
      });

      test('should focus next available date if the first day of the month is disabled', () => {
        const isDateEnabled = (date: Date) => date.getDate() > 1;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findNextButton().click();
        expect(findFocusableDateText(wrapper)).toBe('2');
      });

      test('should focus next available date if available dates are spread across different months in the same year', () => {
        const isDateEnabled = (date: any) => {
          return ['2022-01-14', '2022-02-14', '2022-04-14'].includes(date.toISOString().slice(0, 10));
        };
        const { wrapper } = renderDatePicker({ ...defaultProps, value: '2022-01-14', isDateEnabled });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        // Navigate to future available dates in same year
        expect(findCalendarHeaderText(wrapper)).toBe('January 2022');
        findFocusedDate(wrapper)!.keydown(KeyCode.right);
        expect(findCalendarHeaderText(wrapper)).toBe('February 2022');
        findFocusedDate(wrapper)!.keydown(KeyCode.right);
        expect(findCalendarHeaderText(wrapper)).toBe('April 2022');
        // Navigate to past available dates in same year
        findFocusedDate(wrapper)!.keydown(KeyCode.left);
        expect(findCalendarHeaderText(wrapper)).toBe('February 2022');
        findFocusedDate(wrapper)!.keydown(KeyCode.left);
        expect(findCalendarHeaderText(wrapper)).toBe('January 2022');
      });

      test('should focus next available date if available dates are spread across different different years', () => {
        const isDateEnabled = (date: any) => {
          return ['2022-01-14', '2023-01-14', '2024-01-14'].includes(date.toISOString().slice(0, 10));
        };
        const { wrapper } = renderDatePicker({ ...defaultProps, value: '2022-01-14', isDateEnabled });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        wrapper.findCalendar()!.keydown(KeyCode.tab);
        // Navigate to future available dates in different years
        expect(findCalendarHeaderText(wrapper)).toBe('January 2022');
        findFocusedDate(wrapper)!.keydown(KeyCode.right);
        expect(findCalendarHeaderText(wrapper)).toBe('January 2023');
        findFocusedDate(wrapper)!.keydown(KeyCode.right);
        expect(findCalendarHeaderText(wrapper)).toBe('January 2024');
        // Navigate to past available dates in different years
        findFocusedDate(wrapper)!.keydown(KeyCode.left);
        expect(findCalendarHeaderText(wrapper)).toBe('January 2023');
        findFocusedDate(wrapper)!.keydown(KeyCode.left);
        expect(findCalendarHeaderText(wrapper)).toBe('January 2022');
      });

      test('should jump over the disabled date in future', () => {
        const isDateEnabled = (date: Date) => date.getDate() !== 22;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled, value: '2018-03-21' });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
        expect(findFocusableDateText(wrapper)).toBe('23');
      });

      test('should jump over the disabled date in past', () => {
        const isDateEnabled = (date: Date) => date.getDate() !== 20;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled, value: '2018-03-21' });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
        expect(findFocusableDateText(wrapper)).toBe('19');
      });

      test('should jump to the next month when the date is disabled', () => {
        const isDateEnabled = (date: Date) => date.getDate() < 22;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled, value: '2018-03-21' });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
        expect(findFocusableDateText(wrapper)).toBe('1');
        expect(findCalendarHeaderText(wrapper)).toBe('April 2018');
      });

      test('should jump to the previous month when the date is disabled', () => {
        const isDateEnabled = (date: Date) => date.getDate() > 20;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled, value: '2018-03-21' });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
        expect(findFocusableDateText(wrapper)).toBe('28');
        expect(findCalendarHeaderText(wrapper)).toBe('February 2018');
      });

      test('should not switch if there are no enabled dates in future', () => {
        const maxDate = new Date(2018, 2, 22).getTime();
        const isDateEnabled = (date: Date) => date.getTime() < maxDate;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled, value: '2018-03-21' });
        wrapper.findOpenCalendarButton().click();
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.right);
        expect(findFocusableDateText(wrapper)).toBe('21');
        expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
      });

      test('should not switch if there are no enabled dates in past', () => {
        const minDate = new Date(2018, 2, 20).getTime();
        const isDateEnabled = (date: Date) => date.getTime() > minDate;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled });
        wrapper.findOpenCalendarButton().click();
        wrapper.setInputValue('2018/03/21');
        wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.left);
        expect(findFocusableDateText(wrapper)).toBe('21');
        expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
      });

      test('should display the current month if there is no enabled date in the current', () => {
        const dateLimit = new Date(2018, 3, 10).getTime();
        const isDateEnabled = (date: Date) => date.getTime() > dateLimit;
        const { wrapper } = renderDatePicker({ ...defaultProps, value: '2018-03-21', isDateEnabled });
        wrapper.findOpenCalendarButton().click();
        expect(findCalendarHeaderText(wrapper)).toBe('March 2018');
        expect(
          wrapper.findCalendar()!.findSelectedDate()?.find(`:not(.${screenreaderOnlyStyles.root}`)?.getElement()
            .textContent
        ).toBe('21');
        expect(findFocusableDateText(wrapper)).toBeNull();
      });

      test('does not focus anything if all dates are disabled', () => {
        const isDateEnabled = () => false;
        const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled });
        wrapper.findOpenCalendarButton().click();
        wrapper.setInputValue('2018/03/21');
        expect(findFocusableDateText(wrapper)).toBeNull();
      });
    });
  });

  describe('disabled date', () => {
    const isDateEnabled = (date: Date) => date.getDate() < 15;

    test('should be able to select enabled date', () => {
      const onChangeSpy = jest.fn();
      const { wrapper } = renderDatePicker({
        ...defaultProps,
        value: '2018-03-01',
        isDateEnabled,
        onChange: onChangeSpy,
      });
      wrapper.findOpenCalendarButton().click();
      wrapper
        .findCalendar()!
        .findDateAt(2, 1) // March, 4th
        .click();

      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-03-04' } }));
    });

    test('should not select disabled date', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, value: '2018-03-01', isDateEnabled });
      wrapper.findOpenCalendarButton().click();

      wrapper
        .findCalendar()!
        .findDateAt(4, 1) // March, 18th
        .click();

      expect(findFocusableDateText(wrapper)).toBe('1');
      expect(wrapper.findNativeInput().getElement().value).toBe('2018/03/01');
    });
  });

  describe('aria labels', () => {
    describe('should add `todayAriaLabel` to today in the calendar', () => {
      test('from i18nStrings', () => {
        const { wrapper } = renderDatePicker({
          ...defaultProps,
          value: '',
          i18nStrings: { todayAriaLabel: 'TEST TODAY' },
        });
        wrapper.findOpenCalendarButton().click();
        expect(findCurrentDate(wrapper).find(`.${screenreaderOnlyStyles.root}`)?.getElement().textContent).toMatch(
          'TEST TODAY'
        );
      });

      test('from deprecated top-level property', () => {
        const { wrapper } = renderDatePicker({ value: '', todayAriaLabel: 'TEST TODAY' });
        wrapper.findOpenCalendarButton().click();
        expect(findCurrentDate(wrapper).find(`.${screenreaderOnlyStyles.root}`)?.getElement().textContent).toMatch(
          'TEST TODAY'
        );
      });
    });

    test('should add aria-selected="true" to selected date in the calendar', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, value: '2017-05-06' });
      wrapper.findOpenCalendarButton().click();
      expect(wrapper.findCalendar()!.findSelectedDate().getElement().getAttribute('aria-selected')).toBe('true');
    });

    test('should not set aria-selected when the date is disabled', () => {
      const isDateEnabled = (date: Date) => date.getDate() !== 4;
      const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled, value: '2017-05-06' });
      wrapper.findOpenCalendarButton().click();
      expect(wrapper.findCalendar()!.findDateAt(1, 5)?.getElement().getAttribute('aria-selected')).toBe(null);
    });

    test('should add aria-current="date" to the date of today in the calendar', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, value: '' });
      wrapper.findOpenCalendarButton().click();
      expect(findCurrentDate(wrapper).getElement()!.getAttribute('aria-current')).toBe('date');
    });

    describe('should add `nextMonthAriaLabel` to appropriate button in the calendar', () => {
      test('from i18nStrings', () => {
        const { wrapper } = renderDatePicker({
          ...defaultProps,
          i18nStrings: { nextMonthAriaLabel: 'TEST NEXT MONTH' },
        });
        wrapper.findOpenCalendarButton().click();
        expect(wrapper.findCalendar()!.findNextButton().getElement()!.getAttribute('aria-label')).toMatch(
          'TEST NEXT MONTH'
        );
      });

      test('from deprecated top-level property', () => {
        const { wrapper } = renderDatePicker({ value: '2018-03-22', nextMonthAriaLabel: 'TEST NEXT MONTH' });
        wrapper.findOpenCalendarButton().click();
        expect(wrapper.findCalendar()!.findNextButton().getElement()!.getAttribute('aria-label')).toMatch(
          'TEST NEXT MONTH'
        );
      });
    });

    describe('should add `previousMonthAriaLabel` to appropriate button in the calendar', () => {
      test('from i18nStrings', () => {
        const { wrapper } = renderDatePicker({
          ...defaultProps,
          i18nStrings: { previousMonthAriaLabel: 'TEST PREV MONTH' },
        });
        wrapper.findOpenCalendarButton().click();
        expect(wrapper.findCalendar()!.findPreviousButton().getElement()!.getAttribute('aria-label')).toMatch(
          'TEST PREV MONTH'
        );
      });

      test('from deprecated top-level property', () => {
        const { wrapper } = renderDatePicker({ value: '2018-03-22', previousMonthAriaLabel: 'TEST PREV MONTH' });
        wrapper.findOpenCalendarButton().click();
        expect(wrapper.findCalendar()!.findPreviousButton().getElement()!.getAttribute('aria-label')).toMatch(
          'TEST PREV MONTH'
        );
      });
    });

    test('should add date label to date in the calendar', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, value: '2022-02-10' });
      wrapper.findOpenCalendarButton().click();
      expect(
        wrapper.findCalendar()!.findSelectedDate().find(':not([aria-hidden=true])')?.getElement().textContent
      ).toBe('February 10, 2022');
    });
  });

  describe('keyboard navigation with no entered value', () => {
    test('should have today as the first focusable date', () => {
      const today = new Date();
      const { wrapper } = renderDatePicker({ ...defaultProps, value: '' });
      wrapper.findOpenCalendarButton().click();
      expect(findFocusableDateText(wrapper)).toBe(today.getDate().toString());
      expect(findCalendarHeaderText(wrapper)).toBe(today.toLocaleDateString('en', { month: 'long', year: 'numeric' }));
    });

    test('should have the first of the month as the first focusable date in non-current months', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, value: '2018-02' });
      wrapper.findOpenCalendarButton().click();
      expect(findFocusableDateText(wrapper)).toBe('1');
    });
  });

  describe('change event', () => {
    let onChangeSpy: jest.Mock<NonCancelableEventHandler<DatePickerProps.ChangeDetail>>;
    let wrapper: DatePickerWrapper;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      ({ wrapper } = renderDatePicker({
        ...defaultProps,
        value: '2018-03-01',
        onChange: onChangeSpy,
      }));
      wrapper.findOpenCalendarButton().click();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should fire change event when selecting date with mouse', done => {
      wrapper.findCalendar()!.findDateAt(3, 3).click();

      setTimeout(() => {
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-03-13' } }));
        done();
      }, 1000);
    });

    test('should fire change event when selecting date with keyboard', () => {
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.down);
      wrapper.findCalendar()!.findSelectedDate().keydown(KeyCode.enter);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '2018-03-08',
          },
        })
      );
    });
  });
});

/**
 * This function causes a zero-time delay in order
 * to allow events that are queued in the event loop
 * (such as setTimeout calls in components) to run.
 */
async function runPendingEvents() {
  await new Promise(r => setTimeout(r, 0));
}
