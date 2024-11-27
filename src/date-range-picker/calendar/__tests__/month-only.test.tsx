// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import {
  // fireEvent,
  render,
} from '@testing-library/react';
import Mockdate from 'mockdate';

import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import DateRangePicker, { DateRangePickerProps } from '../../../../lib/components/date-range-picker';
import { NonCancelableEventHandler } from '../../../../lib/components/internal/events';
// import { KeyCode } from '../../../../lib/components/internal/keycode';
import createWrapper from '../../../../lib/components/test-utils/dom';
import DateRangePickerWrapper from '../../../../lib/components/test-utils/dom/date-range-picker';
import { changeMode } from '../../__tests__/change-mode';
import { i18nStrings } from '../../__tests__/i18n-strings';
import { isValidRange } from '../../__tests__/is-valid-range';

import gridStyles from '../../../../lib/components/date-range-picker/calendar/grids/styles.selectors.js';
// import styles from '../../../../lib/components/date-range-picker/styles.selectors.js';
import screenreaderOnlyStyles from '../../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

beforeEach(() => Mockdate.set(new Date('2020-10-20T12:30:20')));
afterEach(() => Mockdate.reset());

describe('Date range picker calendar with month granularity', () => {
  const outsideId = 'outside';
  const defaultProps: DateRangePickerProps & Pick<Required<DateRangePickerProps>, 'i18nStrings'> = {
    i18nStrings,
    // granularity: 'month',
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

  //util on day calendar actually selectes the header of the days in the thead calendar
  // const findDropdownMonths = (wrapper: DateRangePickerWrapper) => {
  //   return wrapper
  //     .findDropdown()!
  //     .findAll(`.${gridStyles['month-header']} :not(.${screenreaderOnlyStyles.root})`)
  //     .map(month => month.getElement().textContent!.trim());
  // };

  const findCurrentMonth = (wrapper: DateRangePickerWrapper): ElementWrapper<HTMLElement> => {
    return wrapper.findDropdown()!.findByClassName(gridStyles['this-month'])!;
  };

  // const findLiveAnnouncement = (wrapper: DateRangePickerWrapper) => {
  //   return wrapper.findDropdown()!.findByClassName(styles['calendar-aria-live'])!.getElement();
  // };

  beforeEach(() => {
    // Set default locale of the browser to en-US for more consistent tests
    const locale = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  describe('localization', () => {
    // test('should render calendar with the default locale', () => {
    //   const { wrapper } = renderDateRangePicker();
    //   expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
    //   expect(findDropdownMonths(wrapper)).toEqual([
    //     'Sun',
    //   ]);
    // });

    // test('should allow country override', () => {
    //   const { wrapper } = renderDateRangePicker({ ...defaultProps, locale: 'en-GB' });
    //   expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
    //   expect(findDropdownMonths(wrapper)).toEqual([
    //     'Mon',
    //   ]);
    // });

    test('should allow locale override', () => {
      const locale = 'de-DE';
      const mockedLocaleString = 'März 2018';
      const localStringMock = jest.fn().mockReturnValueOnce(mockedLocaleString);
      const oldImpl = window.Date.prototype.toLocaleDateString;
      window.Date.prototype.toLocaleDateString = localStringMock;
      try {
        const { wrapper } = renderDateRangePicker({ ...defaultProps, locale });
        expect(findCalendarHeaderText(wrapper)).toBe(mockedLocaleString);
      } finally {
        window.Date.prototype.toLocaleDateString = oldImpl;
      }
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
        expect(findCurrentMonth(wrapper)!.getElement()).toContainElement(findFocusableMonth(wrapper)!.getElement());
        expect(findFocusableMonthText(wrapper)).toBe('20');
      });

      //     test('should have the selected month be initially focusable', () => {
      //       const { wrapper } = renderDateRangePicker({
      //         ...defaultProps,
      //         value: {
      //           type: 'absolute',
      //           startDate: '2020-10-22T00:00:00',
      //           endDate: '2020-10-25T00:00:00'
      //         },
      //       });
      //       expect(findFocusableMonthText(wrapper)).toBe('Oct');
      //     });

      //     describe('Right key press', () => {
      //       test('should go to the next month in quarter', () => {
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.right);
      //         expect(findFocusableMonthText(wrapper)).toBe('23');
      //       });

      //       test('should allow first Month to be focused after moving dates then navigating between years', () => {
      //         wrapper.findDropdown()!.findNextYearButton().click();
      //         wrapper.findDropdown()!.findNextYearButton().click();

      //         // focus a new date
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.right);
      //         // navigate to previous month
      //         wrapper.findDropdown()!.findPreviousMonthButton()!.click();
      //         wrapper.findDropdown()!.findPreviousMonthButton()!.click();

      //         expect(findFocusableMonthText(wrapper)).toBe('1');
      //       });

      //       test('should jump over the disabled month in future', () => {
      //         const isDateEnabled = (date: Date) => date.getDate() !== 22;
      //         const { wrapper } = renderDateRangePicker({
      //           ...defaultProps,
      //           isDateEnabled,
      //           value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
      //         });

      //         changeMode(wrapper, 'absolute');
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.right);
      //         expect(findFocusableMonthText(wrapper)).toBe('23');
      //       });

      //       //todo look into this and its left equal
      //       test('should jump to the next month when the month is disabled', () => {
      //         const isDateEnabled = (date: Date) => date.getDate() < 22;
      //         const { wrapper } = renderDateRangePicker({
      //           ...defaultProps,
      //           isDateEnabled,
      //           value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
      //         });
      //         changeMode(wrapper, 'absolute');
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.right);
      //         expect(findFocusableMonthText(wrapper)).toBe('1');
      //         expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      //       });

      //       test('should not switch if there are no enabled dates in future', () => {
      //         const maxDate = new Date(2018, 2, 22).getTime();
      //         const isDateEnabled = (date: Date) => date.getTime() < maxDate;
      //         const { wrapper } = renderDateRangePicker({
      //           ...defaultProps,
      //           isDateEnabled,
      //           value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
      //         });
      //         changeMode(wrapper, 'absolute');
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.right);
      //         expect(findFocusableMonthText(wrapper)).toBe('21');
      //         expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      //       });
      //     })

      //     describe('Left key press',  () => {
      //       test('should go to the previous month in quarter with "Left" key press', () => {
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.left);
      //         expect(findFocusableMonthText(wrapper)).toBe('21');
      //       });

      //       test('should jump over the disabled month in past', () => {
      //         const isDateEnabled = (date: Date) => date.getDate() !== 20;
      //         const { wrapper } = renderDateRangePicker({
      //           ...defaultProps,
      //           isDateEnabled,
      //           value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
      //         });
      //         changeMode(wrapper, 'absolute');
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.left);
      //         expect(findFocusableMonthText(wrapper)).toBe('19');
      //       });

      //       test('should jump to the previous month when the date is disabled', () => {
      //         const isDateEnabled = (date: Date) => date.getDate() > 20;
      //         const { wrapper } = renderDateRangePicker({
      //           ...defaultProps,
      //           isDateEnabled,
      //           value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
      //         });
      //         changeMode(wrapper, 'absolute');
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.left);
      //         expect(findFocusableMonthText(wrapper)).toBe('28');
      //         expect(findCalendarHeaderText(wrapper)).toBe('February 2018March 2018');
      //       });

      //       test('should not switch if there are no enabled dates in past', () => {
      //         const minDate = new Date(2018, 2, 20).getTime();
      //         const isDateEnabled = (date: Date) => date.getTime() > minDate;
      //         const { wrapper } = renderDateRangePicker({
      //           ...defaultProps,
      //           isDateEnabled,
      //           value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
      //         });
      //         changeMode(wrapper, 'absolute');
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.left);
      //         expect(findFocusableMonthText(wrapper)).toBe('21');
      //         expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
      //       });
      //     });

      //     describe('Up key press', () => {
      //       test('should go to the previous quarter with "Up" key press', () => {
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.up);
      //         expect(findFocusableMonthText(wrapper)).toBe('15');
      //       });

      //       test('should focus next available month if the first month of the year is disabled', () => {
      //         const isDateEnabled = (date: Date) => date.getMonth() > 1;
      //         const { wrapper } = renderDateRangePicker({ ...defaultProps, isDateEnabled });

      //         changeMode(wrapper, 'absolute');
      //         wrapper.findDropdown()!.findNextMonthButton()!.click();
      //         wrapper.findDropdown()!.findNextMonthButton()!.click();

      //         expect(findFocusableMonthText(wrapper)).toBe('2');
      //       });

      //       test('should focus next available month in year if the month above it is disabled', () => {
      //         const isDateEnabled = (date: Date) => date.getDate() > 1;
      //         const { wrapper } = renderDateRangePicker({ ...defaultProps, isDateEnabled });

      //         changeMode(wrapper, 'absolute');
      //         wrapper.findDropdown()!.findNextYearButton()!.click();
      //         wrapper.findDropdown()!.findNextYearButton()!.click();

      //         expect(findFocusableMonthText(wrapper)).toBe('Feb');
      //       });

      //       test('should go to the previous year in calandar', () => {
      //         Mockdate.set(new Date('2018-03-03T12:30:20'));

      //         const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

      //         changeMode(wrapper, 'absolute');
      //         findFocusableMonth(wrapper)!.keydown(KeyCode.up);
      //         expect(findFocusableMonthText(wrapper)).toBe('24');
      //         expect(findCalendarHeaderText(wrapper)).toBe('February 2018March 2018');
      //       });
    });

    //     describe('Down key press', () => {
    //       test('should go to the next quarter with "Down" key press', () => {
    //         findFocusableMonth(wrapper)!.keydown(KeyCode.down);
    //         expect(findFocusableMonthText(wrapper)).toBe('29');
    //       });

    //       test('should go to the next month', () => {
    //         Mockdate.set(new Date('2018-03-29T12:30:20'));

    //         const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null });

    //         changeMode(wrapper, 'absolute');
    //         findFocusableMonth(wrapper)!.keydown(KeyCode.down);

    //         expect(findFocusableMonthText(wrapper)).toBe('5');
    //         expect(findCalendarHeaderText(wrapper)).toBe('March 2018April 2018');
    //       });
    //     });

    //   });
  });

  // describe('disabled date', () => {
  //   const isDateEnabled = (date: Date) => date.getDate() < 15;
  //   const disabledReasonText = 'Disabled with a reason';
  //   const dateDisabledReason = (date: Date) => (date.getDate() >= 15 ? disabledReasonText : '');

  //   test('should be able to select enabled month', () => {
  //     const { wrapper } = renderDateRangePicker({
  //       ...defaultProps,
  //       value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //       isDateEnabled,
  //     });
  //     changeMode(wrapper, 'absolute');

  //     wrapper
  //       .findDropdown()!
  //       .findDateAt('left', 2, 1) // March 4th
  //       .click();

  //     expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent('4');
  //     expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement().value).toBe('2018/03/04');
  //   });

  //   test('should not select disabled month', () => {
  //     const { wrapper } = renderDateRangePicker({
  //       ...defaultProps,
  //       value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //       isDateEnabled,
  //     });
  //     changeMode(wrapper, 'absolute');

  //     wrapper
  //       .findDropdown()!
  //       .findDateAt('left', 4, 1) // March, 18th
  //       .click();

  //     expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent('1');
  //     expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement().value).toBe('2018/03/01');
  //   });

  //   test('does not focus anything if all months are disabled', () => {
  //     const isDateEnabled = () => false;
  //     const { wrapper } = renderDateRangePicker({
  //       ...defaultProps,
  //       isDateEnabled,
  //       value: { type: 'absolute', startDate: '2018-03-21T00:00:00', endDate: '2018-03-21T00:00:00' },
  //     });
  //     changeMode(wrapper, 'absolute');
  //     expect(findFocusableMonthText(wrapper)).toBeNull();
  //   });

  //   describe('disabled with reason', () => {
  //     test('has no tooltip open by default', () => {
  //       const { wrapper } = renderDateRangePicker({
  //         ...defaultProps,
  //         value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //         isDateEnabled,
  //         dateDisabledReason,
  //       });
  //       changeMode(wrapper, 'absolute');

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()).toBe(null);
  //     });

  //     test('has no tooltip without disabledReason', () => {
  //       const { wrapper } = renderDateRangePicker({
  //         ...defaultProps,
  //         value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //         isDateEnabled,
  //       });
  //       changeMode(wrapper, 'absolute');

  //       // The calendar date handles two onFocus events to show the disabled reason popup: one to make the date focused, and the other to show the popup.
  //       // wrapper.findDropdown()!.findDateAt(...).focus() triggers only one of them
  //       fireEvent.focus(wrapper.findDropdown()!.findDateAt('left', 4, 1)!.getElement());

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()).toBe(null);
  //     });

  //     test('open tooltip on focus', () => {
  //       const { wrapper } = renderDateRangePicker({
  //         ...defaultProps,
  //         value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //         isDateEnabled,
  //         dateDisabledReason,
  //       });
  //       changeMode(wrapper, 'absolute');

  //       fireEvent.focus(wrapper.findDropdown()!.findDateAt('left', 4, 1)!.getElement());

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()!.getElement()).toHaveTextContent(
  //         disabledReasonText
  //       );
  //     });

  //     test('closes tooltip on blur', () => {
  //       const { wrapper } = renderDateRangePicker({
  //         ...defaultProps,
  //         value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //         isDateEnabled,
  //         dateDisabledReason,
  //       });
  //       changeMode(wrapper, 'absolute');

  //       fireEvent.focus(wrapper.findDropdown()!.findDateAt('left', 4, 1)!.getElement());

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()!.getElement()).toHaveTextContent(
  //         disabledReasonText
  //       );

  //       fireEvent.blur(wrapper.findDropdown()!.findDateAt('left', 4, 1)!.getElement());

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()).toBe(null);
  //     });

  //     test('open tooltip on mouseenter', () => {
  //       const { wrapper } = renderDateRangePicker({
  //         ...defaultProps,
  //         value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //         isDateEnabled,
  //         dateDisabledReason,
  //       });
  //       changeMode(wrapper, 'absolute');

  //       fireEvent.mouseEnter(wrapper.findDropdown()!.findDateAt('left', 4, 1).getElement());

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()!.getElement()).toHaveTextContent(
  //         disabledReasonText
  //       );
  //     });

  //     test('close tooltip on mouseleave', () => {
  //       const { wrapper } = renderDateRangePicker({
  //         ...defaultProps,
  //         value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //         isDateEnabled,
  //         dateDisabledReason,
  //       });
  //       changeMode(wrapper, 'absolute');

  //       fireEvent.mouseEnter(wrapper.findDropdown()!.findDateAt('left', 4, 1).getElement());

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()!.getElement()).toHaveTextContent(
  //         disabledReasonText
  //       );

  //       fireEvent.mouseLeave(wrapper.findDropdown()!.findDateAt('left', 4, 1).getElement());

  //       expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).findDisabledReason()).toBe(null);
  //     });

  //     // test('has no aria-describedby by default', () => {
  //     //   const { wrapper } = renderDateRangePicker({
  //     //     ...defaultProps,
  //     //     value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //     //   });
  //     //   changeMode(wrapper, 'absolute');

  //     //   expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).getElement()).not.toHaveAttribute('aria-describedby');
  //     // });

  //     // test('has no aria-describedby without disabledReason', () => {
  //     //   const { wrapper } = renderDateRangePicker({
  //     //     ...defaultProps,
  //     //     value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //     //     isDateEnabled,
  //     //   });
  //     //   changeMode(wrapper, 'absolute');

  //     //   expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).getElement()).not.toHaveAttribute('aria-describedby');
  //     // });

  //     // test('has aria-describedby with disabledReason', () => {
  //     //   const { wrapper } = renderDateRangePicker({
  //     //     ...defaultProps,
  //     //     value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //     //     isDateEnabled,
  //     //     dateDisabledReason,
  //     //   });
  //     //   changeMode(wrapper, 'absolute');

  //     //   expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).getElement()).toHaveAttribute('aria-describedby');
  //     // });

  //     // test('has hidden element (linked to aria-describedby) with disabledReason', () => {
  //     //   const { wrapper } = renderDateRangePicker({
  //     //     ...defaultProps,
  //     //     value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //     //     isDateEnabled,
  //     //     dateDisabledReason,
  //     //   });
  //     //   changeMode(wrapper, 'absolute');

  //     //   expect(wrapper.findDropdown()!.findDateAt('left', 4, 1).find('span[hidden]')!.getElement()).toHaveTextContent(
  //     //     'Disabled with a reason'
  //     //   );
  //     // });

  //     // test('disabled with reason start date can not be selected on space keydown', () => {
  //     //   const { wrapper } = renderDateRangePicker({
  //     //     ...defaultProps,
  //     //     value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //     //     isDateEnabled,
  //     //     dateDisabledReason,
  //     //   });
  //     //   changeMode(wrapper, 'absolute');

  //     //   expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue('2018/03/01');

  //     //   wrapper.findDropdown()!.findDateAt('left', 4, 1).focus();
  //     //   wrapper.findDropdown()!.findDateAt('left', 4, 1).keydown(KeyCode.space);

  //     //   // selected date remains the same
  //     //   expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue('2018/03/01');
  //     // });

  //     // test('disabled with reason start date can not be selected on enter keydown', () => {
  //     //   const { wrapper } = renderDateRangePicker({
  //     //     ...defaultProps,
  //     //     value: { type: 'absolute', startDate: '2018-03-01T00:00:00', endDate: '2018-03-01T00:00:00' },
  //     //     isDateEnabled,
  //     //     dateDisabledReason,
  //     //   });
  //     //   changeMode(wrapper, 'absolute');

  //     //   expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue('2018/03/01');

  //     //   wrapper.findDropdown()!.findDateAt('left', 4, 1).focus();
  //     //   wrapper.findDropdown()!.findDateAt('left', 4, 1).keydown(KeyCode.enter);

  //     //   // selected date remains the same
  //     //   expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue('2018/03/01');
  //     // });
  //   });
  // });

  // describe('aria labels', () => {
  //   test('should add `todayAriaLabel` to today in the calendar', () => {
  //     const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null, i18nStrings });
  //     changeMode(wrapper, 'absolute');
  //     expect(findCurrentMonth(wrapper).find(`.${screenreaderOnlyStyles.root}`)?.getElement().textContent).toMatch(
  //       'TEST THIS MONTH'
  //     );
  //   });

  //   test('should add aria-selected="true" to selected range in the calendar', () => {
  //     const { wrapper } = renderDateRangePicker({
  //       ...defaultProps,
  //       value: { type: 'absolute', startDate: '2017-05-06T00:00:00', endDate: '2017-05-09T00:00:00' },
  //     });
  //     changeMode(wrapper, 'absolute');
  //     expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement().getAttribute('aria-selected')).toBe('true');
  //     expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement().getAttribute('aria-selected')).toBe('true');
  //     expect(wrapper.findDropdown()!.findDateAt('left', 2, 1).getElement().getAttribute('aria-selected')).toBe('true');
  //   });

  //   test('should add `nextMonthAriaLabel` to appropriate button in the calendar', () => {
  //     const { wrapper } = renderDateRangePicker({ ...defaultProps, i18nStrings });
  //     changeMode(wrapper, 'absolute');
  //     expect(wrapper.findDropdown()!.findNextMonthButton()!.getElement()!.getAttribute('aria-label')).toMatch(
  //       'TEST NEXT MONTH'
  //     );
  //   });

  //   test('should add `previousMonthAriaLabel` to appropriate button in the calendar', () => {
  //     const { wrapper } = renderDateRangePicker({ ...defaultProps, i18nStrings });
  //     changeMode(wrapper, 'absolute');
  //     expect(wrapper.findDropdown()!.findPreviousMonthButton()!.getElement()!.getAttribute('aria-label')).toMatch(
  //       'TEST PREVIOUS MONTH'
  //     );
  //   });

  //   test('date/time inputs should have ariaDescribedby attribute when constriantText is available', () => {
  //     const { wrapper } = renderDateRangePicker({ ...defaultProps, i18nStrings });
  //     const constraindId = wrapper
  //       .findDropdown()!
  //       .findStartDateInput()!
  //       .find('input')!
  //       .getElement()!
  //       .getAttribute('aria-describedby');
  //     expect(wrapper.find(`#${constraindId}`)!.getElement()).toContainHTML(
  //       defaultProps.i18nStrings.dateTimeConstraintText || ''
  //     );
  //     expect(
  //       wrapper.findDropdown()!.findStartTimeInput()!.find('input')!.getElement()!.getAttribute('aria-describedby')
  //     ).toBe(constraindId);
  //     expect(
  //       wrapper.findDropdown()!.findEndDateInput()!.find('input')!.getElement()!.getAttribute('aria-describedby')
  //     ).toBe(constraindId);
  //     expect(
  //       wrapper.findDropdown()!.findEndTimeInput()!.find('input')!.getElement()!.getAttribute('aria-describedby')
  //     ).toBe(constraindId);
  //   });

  //   test('add aria-live when date is selected', () => {
  //     const { wrapper } = renderDateRangePicker({
  //       ...defaultProps,
  //       rangeSelectorMode: 'absolute-only',
  //       value: null,
  //     });
  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent('');
  //     wrapper.findDropdown()!.findDateAt('left', 2, 1).click();

  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));
  //     wrapper.findDropdown()!.findDateAt('left', 2, 2).click();

  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.endDateLabel!));
  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent(
  //       new RegExp(i18nStrings!.renderSelectedAbsoluteRangeAriaLive!('', ''))
  //     );

  //     wrapper.findDropdown()!.findDateAt('left', 3, 2).click();
  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));

  //     wrapper.findDropdown()!.findDateAt('left', 3, 1).click();
  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.startDateLabel!));
  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent(
  //       new RegExp(i18nStrings.renderSelectedAbsoluteRangeAriaLive!('', ''))
  //     );
  //   });

  //   test('renders default range announcement when i18n string is not provided', () => {
  //     const { wrapper } = renderDateRangePicker({
  //       ...defaultProps,
  //       i18nStrings: { ...defaultProps.i18nStrings, renderSelectedAbsoluteRangeAriaLive: undefined },
  //       rangeSelectorMode: 'absolute-only',
  //       value: null,
  //     });
  //     // select start
  //     wrapper.findDropdown()!.findDateAt('left', 2, 1).click();
  //     // select end
  //     wrapper.findDropdown()!.findDateAt('left', 2, 2).click();
  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent(new RegExp(i18nStrings.endDateLabel!));
  //     expect(findLiveAnnouncement(wrapper)).toHaveTextContent('Sunday, September 6, 2020 – Monday, September 7, 2020');
  //   });

  //   test('should set aria-disabled="true" and unset aria-selected to disabled date', () => {
  //     const isDateEnabled = (date: Date) => date.getDate() !== 15;
  //     const { wrapper } = renderDateRangePicker({ ...defaultProps, value: null, i18nStrings, isDateEnabled });
  //     changeMode(wrapper, 'absolute');
  //     expect(wrapper.findDropdown()!.findDateAt('left', 3, 3).getElement().getAttribute('aria-disabled')).toBe('true');
  //     expect(wrapper.findDropdown()!.findDateAt('left', 3, 3).getElement().getAttribute('aria-selected')).toBe(null);
  //   });
  // });
});
