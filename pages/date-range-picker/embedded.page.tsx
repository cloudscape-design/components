// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DateRangePickerProps, Link, SpaceBetween, FormField } from '~components';
import { DateRangePickerEmbedded } from '~components/date-range-picker/embedded';
import { i18nStrings, relativeOptions } from './common';

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2018-01-09T12:34:56Z',
    endDate: '2018-01-19T15:30:00',
  });

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Date range picker editor version</h1>
        <Link id="focusable-element-before-date-range-picker">Focusable element before the date range picker</Link>
        <FormField label="Date Range Picker field">
          <DateRangePickerEmbedded
            startOfWeek={0}
            isDateEnabled={() => true}
            value={value}
            locale={'en-EN'}
            i18nStrings={i18nStrings}
            relativeOptions={relativeOptions}
            dateOnly={false}
            timeInputFormat="hh:mm:ss"
            rangeSelectorMode={'default'}
            onChange={e => setValue(e.detail.value)}
          />
        </FormField>
        <Link id="focusable-element-after-date-range-picker">Focusable element after the date range picker</Link>
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
