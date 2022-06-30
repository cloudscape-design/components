// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DatePicker, Link } from '~components';

export default function DatePickerScenario() {
  const [value, setValue] = useState('');

  return (
    <Box padding="s">
      <h1>Date picker simple version</h1>
      <Link id="focus-dismiss-helper">Focusable element before the date picker</Link>
      <br />
      <DatePicker
        value={value}
        name={'date-picker-name'}
        ariaLabel={'date-picker-label'}
        locale={'en-EN'}
        previousMonthAriaLabel={'Previous month'}
        nextMonthAriaLabel={'Next month'}
        todayAriaLabel={'TEST TODAY'}
        openCalendarAriaLabel={selectedDate =>
          'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
        }
        placeholder={'YYYY/MM/DD'}
        onChange={event => setValue(event.detail.value)}
      />
      <br />
      <br />
      <Link id="focusable-element-after-date-picker">Focusable element after the date picker</Link>
    </Box>
  );
}
