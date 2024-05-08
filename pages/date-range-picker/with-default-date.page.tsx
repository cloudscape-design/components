// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DateRangePicker, DateRangePickerProps, Link, FormField } from '~components';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings, relativeOptions, isValid } from './common';

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2018-01-09T12:34:56Z',
    endDate: '2018-01-19T15:30:00Z',
  });

  return (
    <Box padding="s">
      <h1>Date range picker with selected date</h1>
      <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
      <br />
      <br />
      <ScreenshotArea>
        <FormField label="Date Range Picker field">
          <DateRangePicker
            value={value}
            locale={'en-GB'}
            i18nStrings={i18nStrings}
            timeOffset={0}
            placeholder={'Filter by a date and time range'}
            onChange={e => setValue(e.detail.value)}
            relativeOptions={relativeOptions}
            isValidRange={isValid}
          />
        </FormField>
        <br />
        <br />
        <div style={{ blockSize: 500 }} />
      </ScreenshotArea>
    </Box>
  );
}
