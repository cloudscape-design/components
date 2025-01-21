// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, FormField, Link } from '~components';

import AppContext from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import {
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  generatePlaceholder,
  generateRelativeOptions,
  i18nStrings,
  isValid,
} from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2018-01-09T12:34:56Z',
    endDate: '2018-01-19T15:30:00Z',
  });

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const absoluteFormat =
    urlParams.absoluteFormat ?? ('dateRangePickerDemoDefaults.absoluteFormat' as DateRangePickerProps.AbsoluteFormat);

  return (
    <Box padding="s">
      <h1>Date range picker with selected date</h1>
      <label>
        Absolute format{' '}
        <select
          value={absoluteFormat}
          onChange={event =>
            setUrlParams({
              absoluteFormat: event.currentTarget.value as DateRangePickerProps.AbsoluteFormat,
            })
          }
        >
          <option value="iso">Iso (Default)</option>
          <option value="long-localized">Long localized</option>
        </select>
      </label>
      <Checkbox
        disabled={monthOnly}
        checked={dateOnly}
        onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}
      >
        Date-only
      </Checkbox>
      <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
        Month-only
      </Checkbox>
      <br />
      <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
      <br />
      <br />
      <ScreenshotArea>
        <FormField label="Date Range Picker field">
          <DateRangePicker
            value={value}
            locale={'en-GB'}
            timeOffset={0}
            placeholder={generatePlaceholder(dateOnly, monthOnly)}
            onChange={e => setValue(e.detail.value)}
            dateOnly={dateOnly}
            granularity={monthOnly ? 'month' : 'day'}
            relativeOptions={generateRelativeOptions(dateOnly, monthOnly)}
            isValidRange={isValid}
            customRelativeRangeUnits={['second', 'minute', 'hour']}
            i18nStrings={i18nStrings}
            absoluteFormat={absoluteFormat}
          />
        </FormField>
        <br />
        <br />
        <div style={{ blockSize: 500 }} />
      </ScreenshotArea>
    </Box>
  );
}
