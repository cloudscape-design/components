// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Checkbox, Link, SpaceBetween } from '~components';
import RangeCalendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';

import AppContext from '../app/app-context';
import {
  applyDisabledReason,
  checkIfDisabled,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  DisabledDate,
  generateI18nStrings,
} from './common';

export default function RangeCalendarScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerCalendarProps['value']>({
    start: { date: '2020-01-25', time: '' },
    end: { date: '2020-02-02', time: '' },
  });
  const monthOnly = false;
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;
  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Range calendar</h1>
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
            <option value="middle-of-page">Middle of {monthOnly ? 'year' : 'month'}</option>
            <option value="end-of-page">End of {monthOnly ? 'year' : 'month'}</option>
            <option value="start-of-page">Start of {monthOnly ? 'year' : 'month'}</option>
            <option value="overlapping-pages">Overlapping {monthOnly ? 'years' : 'months'}</option>
          </select>
        </label>
        <Checkbox
          checked={withDisabledReason}
          onChange={({ detail }) => setUrlParams({ withDisabledReason: detail.checked })}
        >
          Disabled reasons
        </Checkbox>
        <Checkbox
          disabled={monthOnly}
          checked={dateOnly}
          onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}
        >
          Date-only
        </Checkbox>
        <Link id="focusable-before">Focusable element before the range calendar</Link>

        <RangeCalendar
          value={value}
          setValue={setValue}
          locale="en-GB"
          i18nStrings={generateI18nStrings(false, monthOnly)}
          dateOnly={dateOnly}
          timeInputFormat="hh:mm"
          customAbsoluteRangeControl={undefined}
          isDateEnabled={(date: Date) => checkIfDisabled(date, disabledDates, monthOnly)}
          dateDisabledReason={(date: Date) => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
        />

        <Link id="focusable-after">Focusable element after the range calendar</Link>
      </SpaceBetween>
    </Box>
  );
}
