// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  Box,
  // Checkbox,
  // DateRangePicker,
  // DateRangePickerProps,
  // FormField,
  Link,
  // SegmentedControl,
  SpaceBetween,
} from '~components';
import RangeCalendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';

import {
  i18nStrings,
  i18nStringsDateOnly,
  //  isValid, relativeOptions
} from './common';

function RangeCalendarScenario() {
  const [value, setValue] = useState<DateRangePickerCalendarProps['value']>({
    start: { date: '2020-01-25', time: '' },
    end: { date: '2020-02-02', time: '' },
  });
  const [
    dateOnly,
    // setDateOnly
  ] = useState(false);

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Range calendar</h1>

        <Link id="focusable-before">Focusable element before the range calendar</Link>

        <RangeCalendar
          value={value}
          setValue={setValue}
          locale="en-GB"
          i18nStrings={dateOnly ? i18nStringsDateOnly : i18nStrings}
          dateOnly={dateOnly}
          timeInputFormat="hh:mm"
          isDateEnabled={date => date.getDate() !== 15}
          customAbsoluteRangeControl={undefined}
          granularity="month"
        />

        <Link id="focusable-after">Focusable element after the range calendar</Link>
      </SpaceBetween>
    </Box>
  );
}

export default function DatePickerScenario() {
  // const [showRelativeOptions, setShowRelativeOptions] = useState(true);
  // const [dateOnly, setDateOnly] = useState(false);
  // const [invalid, setInvalid] = useState(false);
  // const [warning, setWarning] = useState(false);
  // const [rangeSelectorMode, setRangeSelectorMode] = useState<DateRangePickerProps.RangeSelectorMode>('default');
  // const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  return (
    <Box padding="s">
      {/* <SpaceBetween direction="vertical" size="m">
        <h1>Date range picker simple version</h1>
        <SegmentedControl
          selectedId={rangeSelectorMode}
          options={[
            { id: 'default', text: 'default' },
            { id: 'absolute-only', text: 'absolute-only' },
            { id: 'relative-only', text: 'relative-only' },
          ]}
          onChange={e => setRangeSelectorMode(e.detail.selectedId as DateRangePickerProps.RangeSelectorMode)}
        />
        <SpaceBetween direction="horizontal" size="s">
          <Checkbox checked={showRelativeOptions} onChange={event => setShowRelativeOptions(event.detail.checked)}>
            Show relative options
          </Checkbox>
          <Checkbox checked={dateOnly} onChange={event => setDateOnly(event.detail.checked)}>
            Date-only
          </Checkbox>
          <Checkbox checked={invalid} onChange={event => setInvalid(event.detail.checked)}>
            Invalid
          </Checkbox>
          <Checkbox checked={warning} onChange={event => setWarning(event.detail.checked)}>
            Warning
          </Checkbox>
        </SpaceBetween>
        <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
        <FormField label="Date Range Picker field">
          <DateRangePicker
            value={value}
            locale="en-GB"
            i18nStrings={dateOnly ? i18nStringsDateOnly : i18nStrings}
            placeholder={'Filter by a date and time range'}
            onChange={e => setValue(e.detail.value)}
            relativeOptions={showRelativeOptions ? relativeOptions : []}
            isValidRange={isValid}
            dateOnly={dateOnly}
            timeInputFormat="hh:mm"
            rangeSelectorMode={rangeSelectorMode}
            isDateEnabled={date => date.getDate() !== 14 && date.getDate() !== 15}
            dateDisabledReason={date => (date.getDate() === 14 || date.getDate() === 15 ? 'Disabled reason' : '')}
            getTimeOffset={date => -1 * date.getTimezoneOffset()}
            invalid={invalid}
            warning={warning}
            granularity="month"
          />
        </FormField>
        <Link id="focusable-element-after-date-picker">Focusable element after the date range picker</Link>
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
      <br />
      <br />
      <br /> */}
      <RangeCalendarScenario />
    </Box>
  );
}
