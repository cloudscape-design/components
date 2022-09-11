// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';
import Calendar, { CalendarProps } from '../../../lib/components/calendar';
import createWrapper from '../../../lib/components/test-utils/dom';
import '../../__a11y__/to-validate-a11y';

// The calendar is mostly tested here: src/date-picker/__tests__/date-picker-calendar.test.tsx

describe('Calendar', () => {
  const defaultProps: CalendarProps = {
    todayAriaLabel: 'Today',
    nextMonthAriaLabel: 'next month',
    previousMonthAriaLabel: 'prev month',
    value: '2018-03-22',
  };

  function renderCalendar(props: CalendarProps = defaultProps) {
    const { container, getByTestId } = render(<Calendar {...props} />);
    const wrapper = createWrapper(container).findCalendar()!;
    return { container, wrapper, getByTestId };
  }

  test('check a11y', async () => {
    const { container } = renderCalendar();
    await expect(container).toValidateA11y();
  });
});
