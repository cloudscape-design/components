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
  DisabledDate,
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
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);

  return (
    <Box padding="s">
      <h1>Date range picker with selected date</h1>
      <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
      <br />
      <label>
        Disabled dates{' '}
        <select
          value={disabledDates}
          onChange={event =>
            setUrlParams({
              disabledDates: event.currentTarget.value as DisabledDate,
            })
          }
        >
          <option value="none">None (Default)</option>
          <option value="all">All</option>
          <option value="only-even">Only even</option>
        </select>
      </label>
      <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
        Month-only
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
            isDateEnabled={(date: Date) => applyDisabledIfEven(date, disabledDates, monthOnly)}
            dateDisabledReason={(date: Date) =>
              applyDisabledIfEven(date, disabledDates, monthOnly) ? '' : evenDisabledMsg
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
