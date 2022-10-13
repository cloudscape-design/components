// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';
import Calendar, { CalendarProps } from '../../../lib/components/calendar';
import styles from '../../../lib/components/calendar/styles.selectors.js';
import createWrapper, { CalendarWrapper } from '../../../lib/components/test-utils/dom';
import '../../__a11y__/to-validate-a11y';
import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

// The calendar is mostly tested here: src/date-picker/__tests__/date-picker-calendar.test.tsx

const defaultProps: CalendarProps = {
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'next month',
  previousMonthAriaLabel: 'prev month',
  value: '',
};

function renderCalendar(props: CalendarProps = defaultProps) {
  const { container } = render(<Calendar {...props} />);
  const wrapper = createWrapper(container).findCalendar()!;
  return { container, wrapper };
}

function findCalendarWeekdays(wrapper: CalendarWrapper) {
  return wrapper
    .findAll(`.${styles['calendar-day-header']} :not(.${screenreaderOnlyStyles.root})`)
    .map(day => day.getElement().textContent!.trim());
}

describe('Calendar', () => {
  test('check a11y', async () => {
    const { container } = renderCalendar();
    await expect(container).toValidateA11y();
  });
});

describe('Calendar locale US', () => {
  beforeEach(() => {
    const locale = new Intl.DateTimeFormat('en-US', { timeZone: 'EST' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  test('start of the week is Sunday', () => {
    const { wrapper } = renderCalendar();
    expect(findCalendarWeekdays(wrapper)[0]).toBe('Sun');
  });
});

describe('Calendar locale DE', () => {
  beforeEach(() => {
    const locale = new Intl.DateTimeFormat('de-DE', { timeZone: 'GMT' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  test('start of the week is Monday', () => {
    const { wrapper } = renderCalendar();
    expect(findCalendarWeekdays(wrapper)[0]).toBe('Mo');
  });
});
