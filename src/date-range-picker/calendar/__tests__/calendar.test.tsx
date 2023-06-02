// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Mockdate from 'mockdate';
import { act, render } from '@testing-library/react';
import DateRangePickerWrapper from '../../../../lib/components/test-utils/dom/date-range-picker';
import DateRangePicker, { DateRangePickerProps } from '../../../../lib/components/date-range-picker';
import styles from '../../../../lib/components/date-range-picker/styles.selectors.js';
import gridDayStyles from '../../../../lib/components/date-range-picker/calendar/grids/styles.selectors.js';
import { KeyCode } from '../../../../lib/components/internal/keycode';
import { NonCancelableEventHandler } from '../../../../lib/components/internal/events';
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { i18nStrings } from '../../__tests__/i18n-strings';
import { changeMode } from '../../__tests__/change-mode';
import { isValidRange } from '../../__tests__/is-valid-range';
import screenreaderOnlyStyles from '../../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

beforeEach(() => Mockdate.set(new Date('2020-10-20T12:30:20')));
afterEach(() => Mockdate.reset());

describe('Date range picker calendar', () => {
  const outsideId = 'outside';
  const defaultProps: DateRangePickerProps & Pick<Required<DateRangePickerProps>, 'i18nStrings'> = {
    i18nStrings,
    relativeOptions: [
      { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
      { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
      { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
    ],
    value: { type: 'absolute', startDate: '2018-03-22T00:00:00', endDate: '2019-05-25T12:30:25' },
    onChange: () => {},
    isValidRange: isValidRange,
  };

  function renderDateRangePicker(props: DateRangePickerProps = defaultProps) {
    const { container, getByTestId } = render(
      <div>
        <button value={'Used to change the focus in this testsuite'} data-testid={outsideId} />
        <br />
        <DateRangePicker {...props} />
      </div>
    );

    const wrapper = createWrapper(container).findDateRangePicker()!;
    act(() => wrapper.findTrigger().click());
    return {
      wrapper,
      getByTestId,
    };
  }

  const findFocusableDate = (wrapper: DateRangePickerWrapper) => {
    return wrapper
      .findDropdown()!
      .find(`.${gridDayStyles.day}[tabIndex="0"]`)
      ?.find(`:not(.${screenreaderOnlyStyles.root}`);
  };

  const findFocusableDateText = (wrapper: DateRangePickerWrapper) => {
    const focusableItem = findFocusableDate(wrapper);
    return focusableItem ? focusableItem.getElement().textContent!.trim() : null;
  };

  const findCalendarHeaderText = (wrapper: DateRangePickerWrapper) => {
    return wrapper.findDropdown()!.findHeader()!.getElement().textContent!.trim();
  };

  const findDropdownWeekdays = (wrapper: DateRangePickerWrapper) => {
    return wrapper
      .findDropdown()!
      .findAll(`.${gridDayStyles['day-header']} :not(.${screenreaderOnlyStyles.root})`)
      .map(day => day.getElement().textContent!.trim());
  };

  const findToday = (wrapper: DateRangePickerWrapper): ElementWrapper<HTMLElement> => {
    return wrapper.findDropdown()!.findByClassName(gridDayStyles.today)!;
  };

  const findLiveAnnouncement = (wrapper: DateRangePickerWrapper) => {
    return wrapper.findDropdown()!.findByClassName(styles['calendar-aria-live'])!.getElement();
  };

  beforeEach(() => {
    // Set default locale of the browser to en-US for more consistent tests
    const locale = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  describe('localization', () => {
    test('should render calendar with the default locale', () => {
      const { wrapper } = renderDateRangePicker();
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      expect(findDropdownWeekdays(wrapper)).toEqual([
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ]);
    });

    test('should allow country override', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, locale: 'en-GB' });
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      expect(findDropdownWeekdays(wrapper)).toEqual([
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
      ]);
    });

    test('should allow locale override', () => {
      const locale = 'de-DE';
      const localStringMock = jest.fn().mockReturnValueOnce('März 2018');
      const oldImpl = window.Date.prototype.toLocaleDateString;
      window.Date.prototype.toLocaleDateString = localStringMock;
      try {
        const { wrapper } = renderDateRangePicker({ ...defaultProps, locale });
        expect(findCalendarHeaderText(wrapper)).toBe('März 2018');
      } finally {
        window.Date.prototype.toLocaleDateString = oldImpl;
      }
    });

    test('should override start day of week', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, startOfWeek: 4 });
      expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      expect(findDropdownWeekdays(wrapper)).toEqual([
        'Thu',
        'Fri',
        'Sat',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
      ]);
    });
  });

  describe('keyboard navigation', () => {
    describe('without default props', () => {
      let wrapper: DateRangePickerWrapper;
      let onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>>;

      beforeEach(() => {
        onChangeSpy = jest.fn();
        ({ wrapper } = renderDateRangePicker({ ...defaultProps, onChange: onChangeSpy }));
        changeMode(wrapper, 'absolute');
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      test('should have the current date focusable if no date is selected', () => {
        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });
        changeMode(wrapper, 'absolute');
        expect(findToday(wrapper)!.getElement()).toContainElement(findFocusableDate(wrapper)!.getElement());
        expect(findFocusableDateText(wrapper)).toBe('20');
      });

      test('should have the selected date be initially focusable', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: { type: 'absolute', startDate: '2020-10-22T00:00:00', endDate: '2020-10-25T00:00:00' },
        });
        expect(findFocusableDateText(wrapper)).toBe('22');
      });

      test('should go to the next day', () => {
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.right));
        expect(findFocusableDateText(wrapper)).toBe('23');
      });

      test('should go to the previous day', () => {
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.left));
        expect(findFocusableDateText(wrapper)).toBe('21');
      });

      test('should go to the previous week', () => {
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.up));
        expect(findFocusableDateText(wrapper)).toBe('15');
      });

      test('should go to the next week', () => {
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.down));
        expect(findFocusableDateText(wrapper)).toBe('29');
      });

      test('should go to the previous month', () => {
        Mockdate.set(new Date('2018-03-03T12:30:20'));

        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.up));
        expect(findFocusableDateText(wrapper)).toBe('24');
        expect(findCalendarHeaderText(wrapper)).toBe('February 2018March 2018');
      });

      test('should go to the next month', () => {
        Mockdate.set(new Date('2018-03-29T12:30:20'));

        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.down));

        expect(findFocusableDateText(wrapper)).toBe('5');
        expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      });

      test('should allow first date to be focused after moving dates then navigating between months', () => {
        act(() => wrapper.findDropdown()!.findNextMonthButton().click());
        act(() => wrapper.findDropdown()!.findNextMonthButton().click());

        // focus a new date
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.right));
        // navigate to previous month
        act(() => wrapper.findDropdown()!.findPreviousMonthButton()!.click());
        act(() => wrapper.findDropdown()!.findPreviousMonthButton()!.click());

        expect(findFocusableDateText(wrapper)).toBe('1');
      });

      test('should focus next available date if the first day of the month is disabled', () => {
        const isDateEnabled = (date: Date) => date.getDate() > 1;
        const { wrapper } = renderDateRangePicker({ ...defaultProps, isDateEnabled });

        changeMode(wrapper, 'absolute');
        act(() => wrapper.findDropdown()!.findNextMonthButton()!.click());
        act(() => wrapper.findDropdown()!.findNextMonthButton()!.click());

        expect(findFocusableDateText(wrapper)).toBe('2');
      });

      test('should jump over the disabled date in future', () => {
        const isDateEnabled = (date: Date) => date.getDate() !== 22;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });

        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.right));
        expect(findFocusableDateText(wrapper)).toBe('23');
      });

      test('should jump over the disabled date in past', () => {
        const isDateEnabled = (date: Date) => date.getDate() !== 20;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.left));
        expect(findFocusableDateText(wrapper)).toBe('19');
      });

      test('should jump to the next month when the date is disabled', () => {
        const isDateEnabled = (date: Date) => date.getDate() < 22;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.right));
        expect(findFocusableDateText(wrapper)).toBe('1');
        expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      });

      test('should jump to the previous month when the date is disabled', () => {
        const isDateEnabled = (date: Date) => date.getDate() > 20;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.left));
        expect(findFocusableDateText(wrapper)).toBe('28');
        expect(findCalendarHeaderText(wrapper)).toBe('February 2018March 2018');
      });

      test('should not switch if there are no enabled dates in future', () => {
        const maxDate = new Date(2018, 2, 22).getTime();
        const isDateEnabled = (date: Date) => date.getTime() < maxDate;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.right));
        expect(findFocusableDateText(wrapper)).toBe('21');
        expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      });

      test('should not switch if there are no enabled dates in past', () => {
        const minDate = new Date(2018, 2, 20).getTime();
        const isDateEnabled = (date: Date) => date.getTime() > minDate;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        act(() => findFocusableDate(wrapper)!.keydown(KeyCode.left));
        expect(findFocusableDateText(wrapper)).toBe('21');
        expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      });

      test('does not focus anything if all dates are disabled', () => {
        const isDateEnabled = () => false;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        expect(findFocusableDateText(wrapper)).toBeNull();
      });
    });
  });

  describe('disabled date', () => {
    const isDateEnabled = (date: Date) => date.getDate() < 15;

    test('should be able to select enabled date', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
        isDateEnabled,
      });
      changeMode(wrapper, 'absolute');
      act(() => {
        wrapper
          .findDropdown()!
          .findDateAt('left', 2, 1) // March 4th
          .click();
      });
      expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent('4');
      expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement().value).toBe('2018/03/04');
    });

    test('should not select disabled date', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
        isDateEnabled,
      });
      changeMode(wrapper, 'absolute');
      act(() => {
        wrapper
          .findDropdown()!
          .findDateAt('left', 4, 1) // March, 18th
          .click();
      });
      expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent('1');
      expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement().value).toBe('2018/03/01');
    });
  });

  describe('aria labels', () => {
    test('should add `todayAriaLabel` to today in the calendar', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null, i18nStrings });
      changeMode(wrapper, 'absolute');
      expect(findToday(wrapper).find(`.${screenreaderOnlyStyles.root}`)?.getElement().textContent).toMatch(
        'TEST TODAY'
      );
    });

    test('should add aria-selected="true" to selected range in the calendar', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        value: { type: 'absolute', startDate: '2017-05-06T00:00:00', endDate: '2017-05-09T00:00:00' },
      });
      changeMode(wrapper, 'absolute');
      expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement().getAttribute('aria-selected')).toBe('true');
      expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement().getAttribute('aria-selected')).toBe('true');
      expect(wrapper.findDropdown()!.findDateAt('left', 2, 1).getElement().getAttribute('aria-selected')).toBe('true');
    });

    test('should add `nextMonthAriaLabel` to appropriate button in the calendar', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, i18nStrings });
      changeMode(wrapper, 'absolute');
      expect(wrapper.findDropdown()!.findNextMonthButton()!.getElement()!.getAttribute('aria-label')).toMatch(
        'TEST NEXT MONTH'
      );
    });

    test('should add `previousMonthAriaLabel` to appropriate button in the calendar', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, i18nStrings });
      changeMode(wrapper, 'absolute');
      expect(wrapper.findDropdown()!.findPreviousMonthButton()!.getElement()!.getAttribute('aria-label')).toMatch(
        'TEST PREVIOUS MONTH'
      );
    });

    test('date/time inputs should have ariaDescribedby attribute when constriantText is available', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, i18nStrings });
      const constraindId = wrapper
        .findDropdown()!
        .findStartDateInput()!
        .find('input')!
        .getElement()!
        .getAttribute('aria-describedby');
      expect(wrapper.find(`#${constraindId}`)!.getElement()).toContainHTML(
        defaultProps.i18nStrings.dateTimeConstraintText || ''
      );
      expect(
        wrapper.findDropdown()!.findStartTimeInput()!.find('input')!.getElement()!.getAttribute('aria-describedby')
      ).toBe(constraindId);
      expect(
        wrapper.findDropdown()!.findEndDateInput()!.find('input')!.getElement()!.getAttribute('aria-describedby')
      ).toBe(constraindId);
      expect(
        wrapper.findDropdown()!.findEndTimeInput()!.find('input')!.getElement()!.getAttribute('aria-describedby')
      ).toBe(constraindId);
    });

    test('add aria-live when date is selected', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        rangeSelectorMode: 'absolute-only',
        value: null,
      });
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent('');
      act(() => {
        wrapper.findDropdown()!.findDateAt('left', 2, 1).click();
      });
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));
      act(() => {
        wrapper.findDropdown()!.findDateAt('left', 2, 2).click();
      });
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.endDateLabel!));
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent(
        new RegExp(i18nStrings!.renderSelectedAbsoluteRangeAriaLive!('', ''))
      );
      act(() => {
        wrapper.findDropdown()!.findDateAt('left', 3, 2).click();
      });
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));
      act(() => {
        wrapper.findDropdown()!.findDateAt('left', 3, 1).click();
      });
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent(
        new RegExp(i18nStrings.renderSelectedAbsoluteRangeAriaLive!('', ''))
      );
    });

    test('renders default range announcement when i18n string is not provided', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        i18nStrings: { ...defaultProps.i18nStrings, renderSelectedAbsoluteRangeAriaLive: undefined },
        rangeSelectorMode: 'absolute-only',
        value: null,
      });
      // select start
      act(() => {
        wrapper.findDropdown()!.findDateAt('left', 2, 1).click();
      });
      // select end
      act(() => {
        wrapper.findDropdown()!.findDateAt('left', 2, 2).click();
      });
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.endDateLabel!));
      expect(findLiveAnnouncement(wrapper)).toHaveTextContent('Sunday, September 6, 2020 – Monday, September 7, 2020');
    });

    test('should set aria-disabled="true" and unset aria-selected to disabled date', () => {
      const isDateEnabled = (date: Date) => date.getDate() !== 15;
      const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null, i18nStrings, isDateEnabled });
      changeMode(wrapper, 'absolute');
      expect(wrapper.findDropdown()!.findDateAt('left', 3, 3).getElement().getAttribute('aria-disabled')).toBe('true');
      expect(wrapper.findDropdown()!.findDateAt('left', 3, 3).getElement().getAttribute('aria-selected')).toBe(null);
    });
  });
});
