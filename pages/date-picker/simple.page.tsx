// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DatePicker, FormField, Link } from '~components';
import i18nStrings from './i18n-strings';

export default function DatePickerScenario() {
  const [value, setValue] = useState('');

  return (
    <Box padding="s">
      <h1>Date picker simple version</h1>
      <Link id="focus-dismiss-helper">Focusable element before the date picker</Link>
      <br />
      <FormField label="Certificate expiry date" constraintText="Use YYYY/MM/DD format.">
        <DatePicker
          value={value}
          name={'date-picker-name'}
          locale="en-GB"
          i18nStrings={i18nStrings}
          openCalendarAriaLabel={selectedDate =>
            'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
          }
          placeholder={'YYYY/MM/DD'}
          onChange={event => setValue(event.detail.value)}
        />
      </FormField>
      <br />
      <br />
      <Link id="focusable-element-after-date-picker">Focusable element after the date picker</Link>
    </Box>
  );
}
