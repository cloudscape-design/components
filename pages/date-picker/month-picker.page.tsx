// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DatePicker, Link } from '~components';

export default function () {
  const [value, setValue] = useState('2023-02');

  return (
    <Box padding="s">
      <h1>Date picker with month granularity</h1>
      <Link id="focus-dismiss-helper">Focusable element</Link>
      <br />
      <br />
      <DatePicker
        value={value}
        locale="en-GB"
        placeholder={'YYYY/MM'}
        onChange={event => setValue(event.detail.value)}
        openCalendarAriaLabel={selectedDate =>
          'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
        }
        isDateEnabled={date => date <= new Date('2023-05')}
        granularity="month"
        i18nStrings={{
          previousYearAriaLabel: 'Previous year',
          nextYearAriaLabel: 'Next year',
          currentMonthAriaLabel: 'Current month',
        }}
      />
    </Box>
  );
}
