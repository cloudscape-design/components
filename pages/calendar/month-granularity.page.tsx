// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box } from '~components';
import Calendar from '~components/calendar';

export default function () {
  const [value, setValue] = useState('2022-01-01');

  return (
    <Box padding="s">
      <h1>Calendar with month granularity</h1>
      <Calendar
        value={value}
        locale="en-GB"
        i18nStrings={{
          currentMonthAriaLabel: 'Current month',
          nextYearAriaLabel: 'Next year',
          previousYearAriaLabel: 'Previous year',
        }}
        onChange={event => setValue(event.detail.value)}
        isDateEnabled={date => date <= new Date()}
        granularity="month"
      />
    </Box>
  );
}
