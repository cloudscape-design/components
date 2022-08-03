// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, Link } from '~components';
import { DatePickerEmbedded } from '~components/date-picker/embedded';

export default function DatePickerEditorScenario() {
  const [value, setValue] = useState('2022-01-01');

  return (
    <Box padding="s">
      <h1>Date picker embedded version</h1>
      <Link id="focusable-element-before-date-picker">Focusable element before the date picker</Link>
      <br />
      <DatePickerEmbedded
        value={value}
        locale={'en-EN'}
        previousMonthAriaLabel={'Previous month'}
        nextMonthAriaLabel={'Next month'}
        todayAriaLabel="Today"
        onChange={event => setValue(event.detail.value)}
      />
      <br />
      <br />
      <Link id="focusable-element-after-date-picker">Focusable element after the date picker</Link>
    </Box>
  );
}
