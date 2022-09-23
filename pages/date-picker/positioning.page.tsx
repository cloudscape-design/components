// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, DatePicker } from '~components';

export default function DatePickerScenario() {
  return (
    <Box padding="s">
      <h1>Date picker positioning</h1>
      <div
        style={{
          width: '180px',
          marginLeft: '300px',
          marginTop: '300px',
        }}
      >
        <DatePicker
          value={''}
          name={'date-picker-name'}
          ariaLabel={'date-picker-label'}
          locale="en-GB"
          previousMonthAriaLabel={'Previous month'}
          nextMonthAriaLabel={'Next month'}
          todayAriaLabel={'TEST TODAY'}
          openCalendarAriaLabel={selectedDate =>
            'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
          }
          placeholder={'YYYY/MM/DD'}
        />
      </div>
    </Box>
  );
}
