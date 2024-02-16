// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { render } from '@testing-library/react';
import styles from '../../../lib/components/calendar/styles.selectors.js';
import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.selectors.js';
import Calendar, { CalendarProps } from '../../../lib/components/calendar';
import createWrapper from '../../../lib/components/test-utils/dom';

import * as React from 'react';

const defaultProps: CalendarProps = {
  granularity: 'month',
  i18nStrings: {
    currentMonthAriaLabel: 'Current month',
    nextYearAriaLabel: 'Next year',
    previousYearAriaLabel: 'Previous year',
  },
  value: '',
};

function renderCalendar(props?: CalendarProps) {
  const { container } = render(<Calendar {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findCalendar()!;
  return { container, wrapper };
}

const getCurrentMonthLabelText = (container: HTMLElement) => {
  return container
    .querySelector(`.${styles['calendar-date-current']}`)!
    .querySelector(`.${screenreaderOnlyStyles.root}`)!.textContent;
};

describe('Calendar at month granularity', () => {
  describe('Calendar header', () => {
    test('previous button navigates to previous year', () => {
      const { wrapper } = renderCalendar({ value: '2022-01' });
      expect(wrapper.findHeader().getElement()).toHaveTextContent('2022');
      wrapper.findPreviousButton().click();
      expect(wrapper.findHeader().getElement()).toHaveTextContent('2021');
    });

    test('next button navigates to next year', () => {
      const { wrapper } = renderCalendar({ value: '2022-01' });
      expect(wrapper.findHeader().getElement()).toHaveTextContent('2022');
      wrapper.findNextButton().click();
      expect(wrapper.findHeader().getElement()).toHaveTextContent('2023');
    });
  });

  describe('ARIA labels', () => {
    test('should add `currentMonthAriaLabel` to current month', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          i18nStrings={{
            currentMonthAriaLabel: 'TEST CURRENT MONTH',
          }}
        />
      );
      expect(getCurrentMonthLabelText(container)).toMatch('TEST CURRENT MONTH');
    });

    test('does not add `undefined` if `currentMonthAriaLabel` is not provided', () => {
      const { container } = render(<Calendar {...defaultProps} i18nStrings={undefined} />);
      expect(getCurrentMonthLabelText(container)).not.toContain('undefined');
    });

    test('should add `nextYearAriaLabel` to appropriate button', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          i18nStrings={{
            nextYearAriaLabel: 'TEST NEXT YEAR',
          }}
        />
      );
      const wrapper = createWrapper(container);
      expect(wrapper.findCalendar()!.findNextButton()!.getElement()!.getAttribute('aria-label')).toMatch(
        'TEST NEXT YEAR'
      );
    });

    test('should add `previousYearAriaLabel` to appropriate button', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          i18nStrings={{
            previousYearAriaLabel: 'TEST PREVIOUS YEAR',
          }}
        />
      );
      const wrapper = createWrapper(container);
      expect(wrapper.findCalendar()!.findPreviousButton()!.getElement()!.getAttribute('aria-label')).toMatch(
        'TEST PREVIOUS YEAR'
      );
    });
  });
});
