// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Checkbox, Link, SpaceBetween } from '~components';
import RangeCalendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';

import AppContext from '../app/app-context';
import {
  applyDisabledIfEven,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  evenDisabledMsg,
  i18nStrings,
  i18nStringsDateOnly,
} from './common';

export default function RangeCalendarScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerCalendarProps['value']>({
    start: { date: '2020-01-25', time: '' },
    end: { date: '2020-02-02', time: '' },
  });
  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const disableEven = urlParams.disableEven ?? dateRangePickerDemoDefaults.disableEven;

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Range calendar</h1>

        <Checkbox checked={dateOnly} onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}>
          Date-only
        </Checkbox>
        <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
          Month-only
        </Checkbox>
        <Checkbox checked={disableEven} onChange={({ detail }) => setUrlParams({ disableEven: detail.checked })}>
          Disable even dates
        </Checkbox>

        <Link id="focusable-before">Focusable element before the range calendar</Link>

        <RangeCalendar
          value={value}
          setValue={setValue}
          locale="en-GB"
          i18nStrings={dateOnly ? i18nStringsDateOnly : i18nStrings}
          dateOnly={dateOnly}
          granularity={monthOnly ? 'month' : 'day'}
          timeInputFormat="hh:mm"
          isDateEnabled={(date: Date) => applyDisabledIfEven(date, !disableEven, monthOnly)}
          dateDisabledReason={(date: Date) =>
            applyDisabledIfEven(date, !disableEven, monthOnly) ? '' : evenDisabledMsg
          }
          customAbsoluteRangeControl={undefined}
        />

        <Link id="focusable-after">Focusable element after the range calendar</Link>
      </SpaceBetween>
    </Box>
  );
}
