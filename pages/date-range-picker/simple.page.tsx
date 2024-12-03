// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import {
  Box,
  Checkbox,
  DateRangePicker,
  DateRangePickerProps,
  FormField,
  Link,
  SegmentedControl,
  SpaceBetween,
} from '~components';

import AppContext from '../app/app-context';
import { DateRangePickerDemoContext } from './common';
import { i18nStrings, i18nStringsDateOnly, isValid, relativeOptions } from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const monthOnly = urlParams.monthOnly ?? false;
  const showRelativeOptions = urlParams.showRelativeOptions ?? true;
  const dateOnly = urlParams.dateOnly ?? false;
  const invalid = urlParams.invalid ?? false;
  const warning = urlParams.warning ?? false;
  const rangeSelectorMode = urlParams.rangeSelectorMode ?? 'default';

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Date range picker simple version</h1>
        <SegmentedControl
          selectedId={rangeSelectorMode}
          options={[
            { id: 'default', text: 'default' },
            { id: 'absolute-only', text: 'absolute-only' },
            { id: 'relative-only', text: 'relative-only' },
          ]}
          onChange={({ detail }) =>
            setUrlParams({ rangeSelectorMode: detail.selectedId as DateRangePickerProps.RangeSelectorMode })
          }
        />
        <SpaceBetween direction="horizontal" size="s">
          <Checkbox
            checked={showRelativeOptions}
            onChange={({ detail }) => setUrlParams({ showRelativeOptions: detail.checked })}
          >
            Show relative options
          </Checkbox>
          <Checkbox checked={dateOnly} onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}>
            Date-only
          </Checkbox>
          <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
            Month-only
          </Checkbox>
          <Checkbox checked={invalid} onChange={({ detail }) => setUrlParams({ invalid: detail.checked })}>
            Invalid
          </Checkbox>
          <Checkbox checked={warning} onChange={({ detail }) => setUrlParams({ warning: detail.checked })}>
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
            granularity={monthOnly ? 'month' : 'day'}
            dateOnly={dateOnly}
            timeInputFormat="hh:mm"
            rangeSelectorMode={rangeSelectorMode}
            isDateEnabled={date => date.getDate() !== 14 && date.getDate() !== 15}
            dateDisabledReason={date => (date.getDate() === 14 || date.getDate() === 15 ? 'Disabled reason' : '')}
            getTimeOffset={date => -1 * date.getTimezoneOffset()}
            invalid={invalid}
            warning={warning}
          />
        </FormField>
        <Link id="focusable-element-after-date-picker">Focusable element after the date range picker</Link>
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
