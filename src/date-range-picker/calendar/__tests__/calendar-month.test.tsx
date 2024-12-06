// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Mockdate from 'mockdate';

import DateRangePicker, { DateRangePickerProps } from '../../../../lib/components/date-range-picker';
import { NonCancelableEventHandler } from '../../../../lib/components/internal/events';
import { KeyCode } from '../../../../lib/components/internal/keycode';
import createWrapper from '../../../../lib/components/test-utils/dom';
import DateRangePickerWrapper from '../../../../lib/components/test-utils/dom/date-range-picker';
import { changeMode } from '../../__tests__/change-mode';
import { i18nStrings } from '../../__tests__/i18n-strings';
import { isValidRange } from '../../__tests__/is-valid-range';

import gridStyles from '../../../../lib/components/date-range-picker/calendar/grids/styles.selectors.js';
import styles from '../../../../lib/components/date-range-picker/styles.selectors.js';
import screenreaderOnlyStyles from '../../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

beforeEach(() => Mockdate.set(new Date('2020-10-20T12:30:20')));
afterEach(() => Mockdate.reset());

describe('Date range picker calendar with month granularity', () => {
  const outsideId = 'outside';
  const defaultProps: DateRangePickerProps & Pick<Required<DateRangePickerProps>, 'i18nStrings'> = {
    i18nStrings,
    granularity: 'month',
    relativeOptions: [
      { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
      { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
      { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
    ],
    value: { type: 'absolute', startDate: '2023-03-01T00:00:00', endDate: '2024-05-01T12:30:25' },
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
    wrapper.findTrigger().click();
    return {
      wrapper,
      getByTestId,
    };
  }

  const findFocusableMonth = (wrapper: DateRangePickerWrapper) => {
    return wrapper
      .findDropdown()!
      .find(`.${gridStyles.month}[tabIndex="0"]`)
      ?.find(`:not(.${screenreaderOnlyStyles.root})`);
  };

  const findFocusableMonthText = (wrapper: DateRangePickerWrapper) => {
    const focusableItem = findFocusableMonth(wrapper);
    return focusableItem ? focusableItem.getElement().textContent!.trim() : null;
  };

  const findCalendarHeaderText = (wrapper: DateRangePickerWrapper) => {
    return wrapper.findDropdown()!.findHeader()!.getElement().textContent!.trim();
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
      expect(findCalendarHeaderText(wrapper)).toBe('20232024');
    });

    test('should allow country override', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, locale: 'en-GB' });
      expect(findCalendarHeaderText(wrapper)).toBe('20232024');
    });

    test('should allow locale override', () => {
      const locale = 'de-DE';

      const { wrapper } = renderDateRangePicker({ ...defaultProps, locale });
      changeMode(wrapper, 'absolute');
      expect(wrapper.findDropdown()!.findMonthAt('left', 4, 1)!.getElement().textContent!.trim()).toBe(
        'OktOktober 2023'
      );
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

      test('should have the current month focusable if no month is selected', () => {
        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });
        changeMode(wrapper, 'absolute');
        expect(wrapper.findDropdown()?.findCurrentMonth()!.getElement()).toContainElement(
          findFocusableMonth(wrapper)!.getElement()
        );
        expect(findFocusableMonthText(wrapper)).toBe('Oct');
      });

      test('should have the selected month be initially focusable', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: {
            type: 'absolute',
            startDate: '2020-10-01T00:00:00',
            endDate: '2020-10-01T00:00:00',
          },
        });
        expect(findFocusableMonthText(wrapper)).toBe('Oct');
      });

      test('should go to the next month', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: {
            type: 'absolute',
            startDate: '2020-02-01T00:00:00',
            endDate: '2020-02-01T00:00:00',
          },
        });
        findFocusableMonth(wrapper)!.keydown(KeyCode.right);
        expect(findFocusableMonthText(wrapper)).toBe('Mar');
      });

      test('should go to the previous month', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: {
            type: 'absolute',
            startDate: '2020-02-01T00:00:00',
            endDate: '2020-02-01T00:00:00',
          },
        });
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        expect(findFocusableMonthText(wrapper)).toBe('Jan');
      });

      test('should go to the next month in quarter via right key', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: {
            type: 'absolute',
            startDate: '2020-03-01T00:00:00',
            endDate: '2020-03-01T00:00:00',
          },
        });
        findFocusableMonth(wrapper)!.keydown(KeyCode.right);
        expect(findFocusableMonthText(wrapper)).toBe('Apr');
      });

      test('should go to the next month in quarter via down key', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: {
            type: 'absolute',
            startDate: '2020-03-01T00:00:00',
            endDate: '2020-03-01T00:00:00',
          },
        });
        findFocusableMonth(wrapper)!.keydown(KeyCode.down);
        expect(findFocusableMonthText(wrapper)).toBe('Jun');
      });

      test('should go to the prev month prev quarter via left key', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: {
            type: 'absolute',
            startDate: '2020-07-01T00:00:00',
            endDate: '2020-07-01T00:00:00',
          },
        });
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        expect(findFocusableMonthText(wrapper)).toBe('Jun');
      });

      test('should go to the prev quarter via up key', () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: {
            type: 'absolute',
            startDate: '2020-05-01T00:00:00',
            endDate: '2020-05-01T00:00:00',
          },
        });
        findFocusableMonth(wrapper)!.keydown(KeyCode.up);
        expect(findFocusableMonthText(wrapper)).toBe('Feb');
      });

      test('should go to the previous year via left', () => {
        Mockdate.set(new Date('2018-03-01T12:30:20'));

        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20172018');
        findFocusableMonth(wrapper)!.keydown(KeyCode.up);
        //onto left calendar
        expect(findFocusableMonthText(wrapper)).toBe('Dec');
        findFocusableMonth(wrapper)!.keydown(KeyCode.up);
        findFocusableMonth(wrapper)!.keydown(KeyCode.up);
        findFocusableMonth(wrapper)!.keydown(KeyCode.up);
        findFocusableMonth(wrapper)!.keydown(KeyCode.up);
        expect(findCalendarHeaderText(wrapper)).toBe('20162017');
        expect(findFocusableMonthText(wrapper)).toBe('Dec');
      });

      test('should go to the previous year via left', () => {
        Mockdate.set(new Date('2018-01-01T12:30:20'));

        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20172018');
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        //onto left calendar
        expect(findFocusableMonthText(wrapper)).toBe('Dec');
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        expect(findCalendarHeaderText(wrapper)).toBe('20162017');
        expect(findFocusableMonthText(wrapper)).toBe('Dec');
      });

      test('should go to the next year via right', () => {
        Mockdate.set(new Date('2018-12-01T12:30:20'));

        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20172018');
        expect(findFocusableMonthText(wrapper)).toBe('Dec');
        findFocusableMonth(wrapper)!.keydown(KeyCode.right);
        //onto left calendar
        expect(findFocusableMonthText(wrapper)).toBe('Jan');
        expect(findCalendarHeaderText(wrapper)).toBe('20182019');
      });

      test('should go to the next year via down', () => {
        Mockdate.set(new Date('2018-12-01T12:30:20'));

        const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20172018');
        expect(findFocusableMonthText(wrapper)).toBe('Dec');
        findFocusableMonth(wrapper)!.keydown(KeyCode.down);
        //onto left calendar
        expect(findFocusableMonthText(wrapper)).toBe('Mar');
        expect(findCalendarHeaderText(wrapper)).toBe('20182019');
      });

      //todo confirm this behavior is wanted
      test('should allow first Month to be focused after moving dates then navigating between years', () => {
        wrapper.findDropdown()!.findNextPageButton().click();
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
        wrapper.findDropdown()!.findNextPageButton().click();
        expect(findCalendarHeaderText(wrapper)).toBe('20252026');

        // focus a new date
        findFocusableMonth(wrapper)!.keydown(KeyCode.right);
        // navigate to previous month
        wrapper.findDropdown()!.findPreviousPageButton()!.click();
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
        wrapper.findDropdown()!.findPreviousPageButton()!.click();
        expect(findCalendarHeaderText(wrapper)).toBe('20232024');

        expect(findFocusableMonthText(wrapper)).toBe('Jan');
      });

      test('should jump over the disabled month in future', () => {
        const isDateEnabled = (date: Date) => date.getMonth() !== 3;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
        });

        changeMode(wrapper, 'absolute');
        findFocusableMonth(wrapper)!.keydown(KeyCode.right);
        expect(findFocusableMonthText(wrapper)).toBe('May');
      });

      test('should jump over the disabled month in past', () => {
        const isDateEnabled = (date: Date) => date.getMonth() !== 1;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2024-03-01T00:00:00', endDate: '2024-03-01T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        expect(findFocusableMonthText(wrapper)).toBe('Jan');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
      });

      test('should not switch if there are no enabled months in future', () => {
        const maxDate = new Date('2024-03-01').getTime();
        const isDateEnabled = (date: Date) => date.getTime() <= maxDate;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2024-03-01T00:00:00', endDate: '2024-03-01T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
        findFocusableMonth(wrapper)!.keydown(KeyCode.right);
        expect(findFocusableMonthText(wrapper)).toBe('Mar');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
        findFocusableMonth(wrapper)!.keydown(KeyCode.down);
        expect(findFocusableMonthText(wrapper)).toBe('Mar');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
      });

      test('should not switch if there are no enabled dates in past', () => {
        const minDate = new Date('2024-03-01').getTime();
        const isDateEnabled = (date: Date) => date.getTime() > minDate;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2024-04-01T00:00:00', endDate: '2024-04-01T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
        findFocusableMonth(wrapper)!.keydown(KeyCode.left);
        expect(findFocusableMonthText(wrapper)).toBe('Apr');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
        findFocusableMonth(wrapper)!.keydown(KeyCode.up);
        expect(findFocusableMonthText(wrapper)).toBe('Apr');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');
      });

      test('does not focus anything if all months are disabled', () => {
        const isDateEnabled = () => false;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          isDateEnabled,
          value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
        });
        changeMode(wrapper, 'absolute');
        expect(findFocusableMonthText(wrapper)).toBeNull();
      });
    });

    describe('disabled date', () => {
      test('should be able to select enabled month', () => {
        const isDateEnabled = () => true;
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: { type: 'absolute', startDate: '2024-03-01T00:00:00', endDate: '2024-03-01T00:00:00' },
          isDateEnabled,
        });
        changeMode(wrapper, 'absolute');
        expect(findCalendarHeaderText(wrapper)).toBe('20242025');

        wrapper
          .findDropdown()!
          .findMonthAt('left', 4, 3) //Dec 2024
          .click();

        expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent('Dec');
        expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement().value).toBe('2024/12');
      });

      test('should not select disabled month', () => {
        const isDateEnabled = (date: Date) => date.getMonth() !== 4;
        const dateDisabledReason = (date: Date) => (date.getMonth() === 4 ? 'Disabled with a reason' : '');
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          value: { type: 'absolute', startDate: '2024-03-01T00:00:00', endDate: '2024-03-01T00:00:00' },
          isDateEnabled,
          dateDisabledReason,
        });
        changeMode(wrapper, 'absolute');

        wrapper
          .findDropdown()!
          .findMonthAt('left', 2, 2) //May 2024
          .click();

        expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement().value).toBe('2024/03');
      });

      describe('disabled with reason', () => {
        const disabledReason = 'Disabled with a reason';

        test('has no tooltip open by default', () => {
          const isDateEnabled = () => true;
          const dateDisabledReason = () => '';

          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2024-03-01T00:00:00', endDate: '2024-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          expect(wrapper.findDropdown()!.findMonthAt('left', 4, 1).findDisabledReason()).toBe(null);
        });

        test('has no tooltip without disabledReason', () => {
          const isDateEnabled = () => false;
          const dateDisabledReason = () => '';
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          fireEvent.focus(wrapper.findDropdown()!.findMonthAt('left', 2, 1)!.getElement());

          expect(wrapper.findDropdown()!.findMonthAt('left', 2, 1).findDisabledReason()).toBe(null);
        });

        test('open tooltip on focus', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const dateDisabledReason = (date: Date) => (date.getMonth() === 8 ? disabledReason : '');
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          fireEvent.focus(wrapper.findDropdown()!.findMonthAt('left', 3, 3)!.getElement());

          expect(
            wrapper.findDropdown()!.findMonthAt('left', 3, 3).findDisabledReason()!.getElement()
          ).toHaveTextContent(disabledReason);
        });

        test('closes tooltip on blur', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const dateDisabledReason = (date: Date) => (date.getMonth() === 8 ? disabledReason : '');
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          fireEvent.focus(wrapper.findDropdown()!.findMonthAt('left', 3, 3)!.getElement());

          expect(
            wrapper.findDropdown()!.findMonthAt('left', 3, 3).findDisabledReason()!.getElement()
          ).toHaveTextContent(disabledReason);

          fireEvent.blur(wrapper.findDropdown()!.findMonthAt('left', 3, 3)!.getElement());

          expect(wrapper.findDropdown()!.findMonthAt('left', 3, 3).findDisabledReason()).toBe(null);
        });

        test('open tooltip on mouseenter', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const dateDisabledReason = (date: Date) => (date.getMonth() === 8 ? disabledReason : '');
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          fireEvent.mouseEnter(wrapper.findDropdown()!.findMonthAt('left', 3, 3)!.getElement());

          expect(
            wrapper.findDropdown()!.findMonthAt('left', 3, 3).findDisabledReason()!.getElement()
          ).toHaveTextContent(disabledReason);
        });

        test('close tooltip on mouseleave', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const dateDisabledReason = (date: Date) => (date.getMonth() === 8 ? disabledReason : '');
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          fireEvent.mouseEnter(wrapper.findDropdown()!.findMonthAt('left', 3, 3)!.getElement());

          expect(
            wrapper.findDropdown()!.findMonthAt('left', 3, 3).findDisabledReason()!.getElement()
          ).toHaveTextContent(disabledReason);

          fireEvent.mouseLeave(wrapper.findDropdown()!.findMonthAt('left', 3, 3).getElement());

          expect(wrapper.findDropdown()!.findMonthAt('left', 3, 3).findDisabledReason()).toBe(null);
        });

        test('has no aria-describedby by default', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const dateDisabledReason = () => '';
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            isDateEnabled,
            dateDisabledReason,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
          });
          changeMode(wrapper, 'absolute');

          expect(wrapper.findDropdown()!.findMonthAt('left', 3, 3).getElement()).not.toHaveAttribute(
            'aria-describedby'
          );
        });

        test('has no aria-describedby without disabledReason', () => {
          const isDateEnabled = () => false;
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
          });
          changeMode(wrapper, 'absolute');

          expect(wrapper.findDropdown()!.findMonthAt('left', 3, 3).getElement()).not.toHaveAttribute(
            'aria-describedby'
          );
        });

        test('has aria-describedby with disabledReason', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const dateDisabledReason = (date: Date) => (date.getMonth() === 8 ? disabledReason : '');
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          expect(wrapper.findDropdown()!.findMonthAt('left', 3, 3).getElement()).toHaveAttribute('aria-describedby');
        });

        test('has hidden element (linked to aria-describedby) with disabledReason', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const dateDisabledReason = (date: Date) => (date.getMonth() === 8 ? disabledReason : '');
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
            isDateEnabled,
            dateDisabledReason,
          });
          changeMode(wrapper, 'absolute');

          expect(
            wrapper.findDropdown()!.findMonthAt('left', 3, 3).find('span[hidden]')!.getElement()
          ).toHaveTextContent(disabledReason);
        });

        test('add aria-live when date is selected', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            rangeSelectorMode: 'absolute-only',
            value: null,
          });
          expect(findLiveAnnouncement(wrapper)).toHaveTextContent('');
          wrapper.findDropdown()!.findMonthAt('left', 2, 1).click();

          expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));
          wrapper.findDropdown()!.findMonthAt('left', 2, 2).click();

          expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.endDateLabel!));
          expect(findLiveAnnouncement(wrapper)).toHaveTextContent(
            new RegExp(i18nStrings!.renderSelectedAbsoluteRangeAriaLive!('', ''))
          );

          wrapper.findDropdown()!.findMonthAt('left', 3, 2).click();
          expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));

          wrapper.findDropdown()!.findMonthAt('left', 3, 1).click();
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
          wrapper.findDropdown()!.findMonthAt('left', 2, 1).click();
          // select end
          wrapper.findDropdown()!.findMonthAt('left', 2, 2).click();

          expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.endDateLabel!));
          //todo update announcement
          expect(findLiveAnnouncement(wrapper)).toHaveTextContent(
            'End date, Wednesday, May 1, 2019, End time, 11:59:59 PM. Monday, April 1, 2019 – Wednesday, May 1, 2019'
          );
        });

        test('should set aria-disabled="true" and unset aria-selected to disabled date', () => {
          const isDateEnabled = (date: Date) => date.getMonth() !== 8;
          const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null, i18nStrings, isDateEnabled });
          changeMode(wrapper, 'absolute');
          expect(wrapper.findDropdown()!.findMonthAt('left', 3, 3).getElement().getAttribute('aria-disabled')).toBe(
            'true'
          );
          expect(wrapper.findDropdown()!.findMonthAt('left', 3, 3).getElement().getAttribute('aria-selected')).toBe(
            null
          );
        });
      });
    });
  });
});
