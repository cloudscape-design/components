// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import DatePicker, { DatePickerProps } from '../../../lib/components/date-picker';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultProps: DatePickerProps = {
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'Next Month',
  previousMonthAriaLabel: 'Previous Month',
  value: '2018-03-01',
  onChange: () => {},
  openCalendarAriaLabel: selectedDate => 'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : ''),
};

function renderDatePicker(props: DatePickerProps = defaultProps) {
  const { container } = render(
    <div>
      <button data-testid="outside" />
      <DatePicker {...props} />
    </div>
  );
  const wrapper = createWrapper(container).findDatePicker()!;
  return { wrapper };
}

describe('DatePicker - disabling specific dates and date ranges', () => {
  // Disable a contiguous range (a "date range"): March 10th–20th, 2018.
  const rangeStart = new Date(2018, 2, 10);
  const rangeEnd = new Date(2018, 2, 20);
  const isOutsideRange: DatePickerProps.IsDateEnabledFunction = date => date < rangeStart || date > rangeEnd;

  test('cannot select a date inside a disabled range', () => {
    const onChangeSpy = jest.fn();
    const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled: isOutsideRange, onChange: onChangeSpy });
    wrapper.findOpenCalendarButton().click();

    // March 15th, 2018 falls inside the disabled range.
    wrapper.findCalendar()!.findDateAt(3, 5).click();

    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(wrapper.findNativeInput().getElement().value).toBe('2018/03/01');
  });

  test('can select a date outside a disabled range', () => {
    const onChangeSpy = jest.fn();
    const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled: isOutsideRange, onChange: onChangeSpy });
    wrapper.findOpenCalendarButton().click();

    // March 25th, 2018 (row 5, Sunday) falls after the disabled range and is selectable.
    wrapper.findCalendar()!.findDateAt(5, 1).click();

    expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-03-25' } }));
  });

  test('marks disabled dates with aria-disabled and enabled dates without it', () => {
    const { wrapper } = renderDatePicker({ ...defaultProps, isDateEnabled: isOutsideRange });
    wrapper.findOpenCalendarButton().click();

    // March 15th (row 3) is disabled, March 25th (row 5) is enabled.
    expect(wrapper.findCalendar()!.findDateAt(3, 5).getElement()).toHaveAttribute('aria-disabled', 'true');
    expect(wrapper.findCalendar()!.findDateAt(5, 1).getElement()).toHaveAttribute('aria-disabled', 'false');
  });

  describe('dateDisabledReason contract', () => {
    test('is not invoked for enabled dates and is invoked for disabled dates', () => {
      const dateDisabledReason = jest.fn<string, [Date]>(() => 'Unavailable');
      const { wrapper } = renderDatePicker({
        ...defaultProps,
        isDateEnabled: isOutsideRange,
        dateDisabledReason,
      });
      wrapper.findOpenCalendarButton().click();

      // Every date the reason function was asked about must be a disabled one.
      expect(dateDisabledReason).toHaveBeenCalled();
      for (const [date] of dateDisabledReason.mock.calls) {
        expect(isOutsideRange(date)).toBe(false);
      }
    });

    test('exposes the disabled reason on a disabled date within the range', () => {
      const { wrapper } = renderDatePicker({
        ...defaultProps,
        isDateEnabled: isOutsideRange,
        dateDisabledReason: () => 'Unavailable during maintenance',
      });
      wrapper.findOpenCalendarButton().click();

      const disabledCell = wrapper.findCalendar()!.findDateAt(3, 5);
      disabledCell.focus();
      expect(disabledCell.findDisabledReason()!.getElement()).toHaveTextContent('Unavailable during maintenance');
    });
  });
});
