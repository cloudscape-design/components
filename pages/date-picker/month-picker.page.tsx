// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import MockDate from 'mockdate';
import { Box, DatePicker } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

// Mock the date in order to have the current day styling in place for screenshot testing.
MockDate.set(new Date(2024, 1, 16));

export default function () {
  const [value, setValue] = useState('2024-01');

  return (
    <Box padding="s">
      <h1>Date picker with month granularity</h1>
      <ScreenshotArea style={{ blockSize: 300 }}>
        <DatePicker
          value={value}
          locale="en-GB"
          placeholder={'YYYY/MM'}
          onChange={event => setValue(event.detail.value)}
          openCalendarAriaLabel={selectedDate =>
            'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
          }
          isDateEnabled={date => date <= new Date('2024-06')}
          granularity="month"
          i18nStrings={{
            previousYearAriaLabel: 'Previous year',
            nextYearAriaLabel: 'Next year',
            currentMonthAriaLabel: 'Current month',
          }}
        />
      </ScreenshotArea>
    </Box>
  );
}
