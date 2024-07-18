// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, DatePicker, Link } from '~components';

import i18nStrings from './i18n-strings';

export default function DatePickerScenario() {
  const [value, setValue] = useState('2018-01-02');

  return (
    <Box padding="s">
      <h1>Date picker with a default date</h1>
      <Link id="focus-dismiss-helper">Focusable element</Link>
      <br />
      <br />
      <DatePicker
        value={value}
        name={'date-picker-name'}
        ariaLabel={'date-picker-label'}
        locale="en-GB"
        i18nStrings={i18nStrings}
        placeholder={'YYYY/MM/DD'}
        onChange={event => setValue(event.detail.value)}
        openCalendarAriaLabel={selectedDate =>
          'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
        }
      />
    </Box>
  );
}
