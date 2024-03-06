// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import DatePicker, { DatePickerProps } from '../../../lib/components/date-picker';
import DatePickerWrapper from '../../../lib/components/test-utils/dom/date-picker';
import calendarStyles from '../../../lib/components/calendar/styles.selectors.js';
import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.selectors.js';
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import createWrapper from '../../../lib/components/test-utils/dom';

export const outsideId = 'outside';

export function renderDatePicker(props: DatePickerProps) {
  const { container, getByTestId } = render(
    <div>
      <button value={'Used to change the focus in this test suite'} data-testid={outsideId} />
      <br />
      <DatePicker {...props} />
    </div>
  );

  const wrapper = createWrapper(container).findDatePicker()!;
  const input = wrapper.findNativeInput().getElement();

  return {
    wrapper,
    input,
    getByTestId,
  };
}

export function findFocusedDate(wrapper: DatePickerWrapper) {
  return wrapper
    .findCalendar()!
    .find(`.${calendarStyles['calendar-date']}[tabIndex="0"]`)
    ?.find(`:not(.${screenreaderOnlyStyles.root}`);
}

export function findFocusableDateText(wrapper: DatePickerWrapper) {
  const focusedItem = findFocusedDate(wrapper);
  return focusedItem ? focusedItem.getElement().textContent!.trim() : null;
}

export function findCalendarHeaderText(wrapper: DatePickerWrapper) {
  return wrapper.findCalendar()!.findHeader()!.getElement().textContent!.trim();
}

export function findCalendarDates(wrapper: DatePickerWrapper) {
  return wrapper
    .findCalendar()!
    .findAll(`.${calendarStyles['calendar-date']} .${calendarStyles['date-inner']}`)
    .map(date => date.getElement().textContent!.trim());
}

export function findCurrentDate(wrapper: DatePickerWrapper): ElementWrapper<HTMLElement> {
  return wrapper.findCalendar()!.find(`.${calendarStyles['calendar-date-current']}`)!;
}
