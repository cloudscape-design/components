// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, Link } from '~components';
import Calendar from '~components/calendar';
import i18nStrings from './i18n-strings';

export default function DatePickerEditorScenario() {
  const [value, setValue] = useState('2022-01-01');

  return (
    <Box padding="s">
      <h1>Calendar</h1>
      <Link id="focusable-element-before-date-picker">Focusable element before the date picker</Link>
      <br />
      <Calendar
        value={value}
        locale="en-GB"
        i18nStrings={i18nStrings}
        onChange={event => setValue(event.detail.value)}
        isDateEnabled={date => date.getDate() !== 15}
      />
      <br />
      <br />
      <Link id="focusable-element-after-date-picker">Focusable element after the date picker</Link>
    </Box>
  );
}
