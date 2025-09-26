// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render as rtlRender } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';
import {
  i18nMessages as i18nMessagesFallback,
  i18nMessagesWithExtraFormatConstraints as i18nMessages,
  i18nStrings as i18nStringsFallback,
  i18nStringsWithExtraFormatConstraints as i18nStrings,
} from './i18n-strings';

const defaultProps: DateRangePickerProps = {
  locale: 'en-US',
  value: { type: 'absolute', startDate: '2020-01-01T12:13:14', endDate: '2020-01-01T12:13:14' },
  onChange: () => {},
  relativeOptions: [],
  isValidRange: () => ({ valid: true }),
};

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

type RenderProps = Partial<DateRangePickerProps> & { i18nMessages?: Record<string, Record<string, string>> };

function renderDateRangePicker(props: RenderProps) {
  function Component(props: RenderProps) {
    return (
      <TestI18nProvider messages={props.i18nMessages ?? {}}>
        <DateRangePicker {...defaultProps} {...props} />
      </TestI18nProvider>
    );
  }
  const { container, rerender } = rtlRender(<Component {...props} />);
  const wrapper = createWrapper(container).findDateRangePicker()!;
  const rerenderWrapper = (props: RenderProps) => rerender(<Component {...props} />);

  wrapper.openDropdown();

  const dropdown = wrapper.findDropdown()!;
  const startDateInput = dropdown!.findStartDateInput()!;
  const endDateInput = dropdown!.findEndDateInput()!;
  const randomDateInput = randomItem([startDateInput, endDateInput]);
  const startTimeInput = dropdown!.findStartTimeInput()!;
  const endTimeInput = dropdown!.findEndTimeInput()!;
  const randomTimeInput = randomItem([startTimeInput, endTimeInput]);

  return { dropdown, randomDateInput, randomTimeInput, rerender: rerenderWrapper };
}

function randomAbsoluteFormat() {
  return randomItem([undefined, 'iso', 'slashed', 'long-localized'] as const);
}

const isoDateProps: {
  absoluteFormat: undefined | DateRangePickerProps.AbsoluteFormat;
  dateInputFormat: undefined | DateRangePickerProps.DateInputFormat;
}[] = [{ absoluteFormat: randomAbsoluteFormat(), dateInputFormat: 'iso' }];

const slashedDateProps: {
  absoluteFormat: undefined | DateRangePickerProps.AbsoluteFormat;
  dateInputFormat: undefined | DateRangePickerProps.DateInputFormat;
}[] = [
  { absoluteFormat: randomAbsoluteFormat(), dateInputFormat: undefined },
  { absoluteFormat: randomAbsoluteFormat(), dateInputFormat: 'slashed' },
];

describe('Date range picker: absolute mode input formats', () => {
  describe('date input formats', () => {
    test.each(isoDateProps)('accepts iso date input with props: %s', props => {
      const { randomDateInput } = renderDateRangePicker({ ...props });
      expect(randomDateInput.getInputValue()).toBe('2020-01-01');

      randomDateInput.setInputValue('');
      randomDateInput.setInputValue('2021/02/03');
      expect(randomDateInput.getInputValue()).toBe('');

      randomDateInput.setInputValue('2021-02-03');
      expect(randomDateInput.getInputValue()).toBe('2021-02-03');
    });

    test.each(slashedDateProps)('accepts slashed date input with props: %s', props => {
      const { randomDateInput } = renderDateRangePicker({ ...props });
      expect(randomDateInput.getInputValue()).toBe('2020/01/01');

      randomDateInput.setInputValue('');
      randomDateInput.setInputValue('2021-02-03');
      expect(randomDateInput.getInputValue()).toBe('');

      randomDateInput.setInputValue('2021/02/03');
      expect(randomDateInput.getInputValue()).toBe('2021/02/03');
    });

    test('accepts iso input with granularity "month"', () => {
      const { randomDateInput } = renderDateRangePicker({ ...randomItem(isoDateProps), granularity: 'month' });
      expect(randomDateInput.getInputValue()).toBe('2020-01');

      randomDateInput.setInputValue('2021-02-03');
      expect(randomDateInput.getInputValue()).toBe('2021-02');
    });

    test('accepts slashed input with granularity "month"', () => {
      const { randomDateInput } = renderDateRangePicker({ ...randomItem(slashedDateProps), granularity: 'month' });
      expect(randomDateInput.getInputValue()).toBe('2020/01');

      randomDateInput.setInputValue('2021/02/03');
      expect(randomDateInput.getInputValue()).toBe('2021/02');
    });
  });

  describe('time input formats', () => {
    test.each([undefined, 'hh:mm:ss'] as const)('accepts hh:mm:ss input with format %s', timeInputFormat => {
      const { randomTimeInput } = renderDateRangePicker({ timeInputFormat });
      expect(randomTimeInput.getInputValue()).toBe('12:13:14');

      randomTimeInput.setInputValue('');
      randomTimeInput.setInputValue('13:14:15');
      expect(randomTimeInput.getInputValue()).toBe('13:14:15');
    });

    test('accepts hh:mm input with format hh:mm', () => {
      const { randomTimeInput } = renderDateRangePicker({ timeInputFormat: 'hh:mm' });
      expect(randomTimeInput.getInputValue()).toBe('12:13');

      randomTimeInput.setInputValue('');
      randomTimeInput.setInputValue('13:14:15');
      expect(randomTimeInput.getInputValue()).toBe('');

      randomTimeInput.setInputValue('13:14');
      expect(randomTimeInput.getInputValue()).toBe('13:14');
    });

    test('accepts hh input with format hh', () => {
      const { randomTimeInput } = renderDateRangePicker({ timeInputFormat: 'hh' });
      expect(randomTimeInput.getInputValue()).toBe('12');

      randomTimeInput.setInputValue('');
      randomTimeInput.setInputValue('13:14:15');
      expect(randomTimeInput.getInputValue()).toBe('');

      randomTimeInput.setInputValue('13:14');
      expect(randomTimeInput.getInputValue()).toBe('');

      randomTimeInput.setInputValue('13');
      expect(randomTimeInput.getInputValue()).toBe('13');
    });
  });

  describe('inputs i18n', () => {
    function assertInput(input: HTMLInputElement, placeholder: string, constraint: string) {
      expect(input.placeholder).toBe(placeholder);
      expect(input).toHaveAccessibleDescription(constraint);
    }
    function assertDateInput(placeholder: string, constraint: string) {
      const dropdown = createWrapper().findDateRangePicker()!.findDropdown()!;
      const input = Math.random() < 0.5 ? dropdown.findStartDateInput()! : dropdown.findEndDateInput()!;
      assertInput(input.findNativeInput().getElement(), placeholder, constraint);
    }
    function assertTimeInput(placeholder: string, constraint: string) {
      const dropdown = createWrapper().findDateRangePicker()!.findDropdown()!;
      const input = Math.random() < 0.5 ? dropdown.findStartTimeInput()! : dropdown.findEndTimeInput()!;
      assertInput(input.findNativeInput().getElement(), placeholder, constraint);
    }

    const messages = (caseOptions: { i18n: boolean; fallback: boolean }) => {
      switch (`${caseOptions.i18n}-${caseOptions.fallback}`) {
        case 'true-false':
          return { i18nMessages, i18nStrings: {} };
        case 'true-true':
          return { i18nMessages: i18nMessagesFallback, i18nStrings: {} };
        case 'false-false':
          return { i18nMessages, i18nStrings };
        case 'false-true':
        default:
          return { i18nMessages, i18nStrings: i18nStringsFallback };
      }
    };

    test('date only iso inputs use correct i18n strings', () => {
      const dateOnlyIsoProps = { ...randomItem(isoDateProps), dateOnly: true, value: null };
      const result = renderDateRangePicker({ ...dateOnlyIsoProps, ...messages({ i18n: true, fallback: false }) });
      assertDateInput('YYYY-MM-DD', '(i18n) For date, use YYYY-MM-DD.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: true, fallback: true }) });
      assertDateInput('YYYY-MM-DD', '(i18n) (fallback) For date, use YYYY-MM-DD.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: false, fallback: false }) });
      assertDateInput('YYYY-MM-DD', 'For date, use YYYY-MM-DD.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: false, fallback: true }) });
      assertDateInput('YYYY-MM-DD', '(fallback) For date, use YYYY-MM-DD.');
    });

    test.each(['hh:mm:ss', 'hh:mm', 'hh'] as const)(
      'date/time iso inputs use correct i18n strings, timeInputFormat=%s',
      timeInputFormat => {
        const dateTimeIsoProps = { ...randomItem(isoDateProps), dateOnly: false, value: null, timeInputFormat };
        const result = renderDateRangePicker({ ...dateTimeIsoProps, ...messages({ i18n: true, fallback: false }) });
        assertDateInput('YYYY-MM-DD', '(i18n) For date, use YYYY-MM-DD. For time, use 24 hour format.');
        assertTimeInput(timeInputFormat, '(i18n) For date, use YYYY-MM-DD. For time, use 24 hour format.');

        result.rerender({ ...dateTimeIsoProps, ...messages({ i18n: true, fallback: true }) });
        assertDateInput('YYYY-MM-DD', '(i18n) (fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');
        assertTimeInput(timeInputFormat, '(i18n) (fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');

        result.rerender({ ...dateTimeIsoProps, ...messages({ i18n: false, fallback: false }) });
        assertDateInput('YYYY-MM-DD', 'For date, use YYYY-MM-DD. For time, use 24 hour format.');
        assertTimeInput(timeInputFormat, 'For date, use YYYY-MM-DD. For time, use 24 hour format.');

        result.rerender({ ...dateTimeIsoProps, ...messages({ i18n: false, fallback: true }) });
        assertDateInput('YYYY-MM-DD', '(fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');
        assertTimeInput(timeInputFormat, '(fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');
      }
    );

    test('date only slashed inputs use correct i18n strings', () => {
      const dateOnlySlashedProps = { ...randomItem(slashedDateProps), dateOnly: true, value: null };
      const result = renderDateRangePicker({ ...dateOnlySlashedProps, ...messages({ i18n: true, fallback: false }) });
      assertDateInput('YYYY/MM/DD', '(i18n) For date, use YYYY/MM/DD.');

      result.rerender({ ...dateOnlySlashedProps, ...messages({ i18n: true, fallback: true }) });
      assertDateInput('YYYY/MM/DD', '(i18n) (fallback) For date, use YYYY-MM-DD.');

      result.rerender({ ...dateOnlySlashedProps, ...messages({ i18n: false, fallback: false }) });
      assertDateInput('YYYY/MM/DD', 'For date, use YYYY/MM/DD.');

      result.rerender({ ...dateOnlySlashedProps, ...messages({ i18n: false, fallback: true }) });
      assertDateInput('YYYY/MM/DD', '(fallback) For date, use YYYY-MM-DD.');
    });

    test('date/time slashed inputs use correct i18n strings', () => {
      const dateTimeSlashedProps = { ...randomItem(slashedDateProps), dateOnly: false, value: null };
      const result = renderDateRangePicker({ ...dateTimeSlashedProps, ...messages({ i18n: true, fallback: false }) });
      assertDateInput('YYYY/MM/DD', '(i18n) For date, use YYYY/MM/DD. For time, use 24 hour format.');
      assertTimeInput('hh:mm:ss', '(i18n) For date, use YYYY/MM/DD. For time, use 24 hour format.');

      result.rerender({ ...dateTimeSlashedProps, ...messages({ i18n: true, fallback: true }) });
      assertDateInput('YYYY/MM/DD', '(i18n) (fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');
      assertTimeInput('hh:mm:ss', '(i18n) (fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');

      result.rerender({ ...dateTimeSlashedProps, ...messages({ i18n: false, fallback: false }) });
      assertDateInput('YYYY/MM/DD', 'For date, use YYYY/MM/DD. For time, use 24 hour format.');
      assertTimeInput('hh:mm:ss', 'For date, use YYYY/MM/DD. For time, use 24 hour format.');

      result.rerender({ ...dateTimeSlashedProps, ...messages({ i18n: false, fallback: true }) });
      assertDateInput('YYYY/MM/DD', '(fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');
      assertTimeInput('hh:mm:ss', '(fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.');
    });

    test('month iso inputs use correct i18n strings', () => {
      const dateOnlyIsoProps = { ...randomItem(isoDateProps), granularity: 'month' as const, value: null };
      const result = renderDateRangePicker({ ...dateOnlyIsoProps, ...messages({ i18n: true, fallback: false }) });
      assertDateInput('YYYY-MM', '(i18n) For month, use YYYY-MM.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: true, fallback: true }) });
      assertDateInput('YYYY-MM', '(i18n) (fallback) For month, use YYYY-MM.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: false, fallback: false }) });
      assertDateInput('YYYY-MM', 'For month, use YYYY-MM.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: false, fallback: true }) });
      assertDateInput('YYYY-MM', '(fallback) For month, use YYYY-MM.');
    });

    test('month slashed inputs use correct i18n strings', () => {
      const dateOnlyIsoProps = { ...randomItem(slashedDateProps), granularity: 'month' as const, value: null };
      const result = renderDateRangePicker({ ...dateOnlyIsoProps, ...messages({ i18n: true, fallback: false }) });
      assertDateInput('YYYY/MM', '(i18n) For month, use YYYY/MM.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: true, fallback: true }) });
      assertDateInput('YYYY/MM', '(i18n) (fallback) For month, use YYYY-MM.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: false, fallback: false }) });
      assertDateInput('YYYY/MM', 'For month, use YYYY/MM.');

      result.rerender({ ...dateOnlyIsoProps, ...messages({ i18n: false, fallback: true }) });
      assertDateInput('YYYY/MM', '(fallback) For month, use YYYY-MM.');
    });
  });
});
