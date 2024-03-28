// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, DatePicker } from '~components';
import i18nStrings from './i18n-strings';

export default function DatePickerScenario() {
  return (
    <Box padding="s">
      <h1>Date picker positioning</h1>
      <div
        style={{
          inlineSize: '180px',
          marginInlineStart: '300px',
          marginBlockStart: '300px',
        }}
      >
        <DatePicker
          value={''}
          name={'date-picker-name'}
          ariaLabel={'date-picker-label'}
          locale="en-GB"
          i18nStrings={i18nStrings}
          openCalendarAriaLabel={selectedDate =>
            'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
          }
          placeholder={'YYYY/MM/DD'}
        />
      </div>
    </Box>
  );
}
