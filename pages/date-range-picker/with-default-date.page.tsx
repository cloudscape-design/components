// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, FormField, Link } from '~components';

import AppContext from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import {
  applyDisabledIfEven,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  evenDisabledMsg,
  i18nStrings,
  isValid,
  relativeOptions,
} from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2018-01-09T12:34:56Z',
    endDate: '2018-01-19T15:30:00Z',
  });

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const disableEven = urlParams.disableEven ?? dateRangePickerDemoDefaults.disableEven;

  return (
    <Box padding="s">
      <h1>Date range picker with selected date</h1>
      <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
      <br />
      <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
        Month-only
      </Checkbox>
      <Checkbox checked={disableEven} onChange={({ detail }) => setUrlParams({ disableEven: detail.checked })}>
        Disable even dates
      </Checkbox>
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
            customRelativeRangeUnits={['second', 'minute', 'hour']}
            granularity={monthOnly ? 'month' : 'day'}
            isDateEnabled={(date: Date) => applyDisabledIfEven(date, !disableEven, monthOnly)}
            dateDisabledReason={(date: Date) =>
              applyDisabledIfEven(date, !disableEven, monthOnly) ? '' : evenDisabledMsg
            }
          />
        </FormField>
        <br />
        <br />
        <div style={{ blockSize: 500 }} />
      </ScreenshotArea>
    </Box>
  );
}
