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
import {
  applyDisabledReason,
  checkIfDisabled,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  DisabledDate,
  generateI18nStrings,
  generatePlaceholder,
  generateRelativeOptions,
  isValid,
} from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const absoluteFormat =
    urlParams.absoluteFormat ?? (dateRangePickerDemoDefaults.absoluteFormat as DateRangePickerProps.AbsoluteFormat);
  const showRelativeOptions = urlParams.showRelativeOptions ?? dateRangePickerDemoDefaults.showRelativeOptions;
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;
  const invalid = urlParams.invalid ?? dateRangePickerDemoDefaults.invalid;
  const warning = urlParams.warning ?? dateRangePickerDemoDefaults.warning;
  const rangeSelectorMode =
    urlParams.rangeSelectorMode ??
    (dateRangePickerDemoDefaults.rangeSelectorMode as DateRangePickerProps.RangeSelectorMode);
  const hasValue = urlParams.hasValue ?? dateRangePickerDemoDefaults.hasValue;

  const [value, setValue] = useState<DateRangePickerProps['value']>(
    hasValue
      ? {
          type: 'absolute',
          startDate: '2024-12-30T00:00:00+01:00',
          endDate: '2024-12-31T23:59:59+01:00',
        }
      : null
  );

  console.log(rangeSelectorMode);

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
          <Checkbox checked={hasValue} onChange={({ detail }) => setUrlParams({ hasValue: detail.checked })}>
            Has initial value
          </Checkbox>
          <Checkbox
            checked={withDisabledReason}
            onChange={({ detail }) => setUrlParams({ withDisabledReason: detail.checked })}
          >
            Disabled reasons
          </Checkbox>
          <Checkbox
            checked={showRelativeOptions}
            onChange={({ detail }) => setUrlParams({ showRelativeOptions: detail.checked })}
          >
            Show relative options
          </Checkbox>
          <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
            Month-only
          </Checkbox>
          <Checkbox
            disabled={monthOnly}
            checked={dateOnly}
            onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}
          >
            Date-only
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
            i18nStrings={generateI18nStrings(dateOnly, monthOnly)}
            placeholder={generatePlaceholder(dateOnly, monthOnly)}
            onChange={e => setValue(e.detail.value)}
            relativeOptions={generateRelativeOptions(dateOnly, monthOnly)}
            isValidRange={isValid}
            dateOnly={dateOnly}
            granularity={monthOnly ? 'month' : 'day'}
            timeInputFormat="hh:mm"
            rangeSelectorMode={rangeSelectorMode}
            isDateEnabled={date => checkIfDisabled(date, disabledDates, monthOnly)}
            dateDisabledReason={date => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
            getTimeOffset={date => -1 * date.getTimezoneOffset()}
            invalid={invalid}
            warning={warning}
            absoluteFormat={absoluteFormat}
          />
        </FormField>
        <Link id="focusable-element-after-date-picker">Focusable element after the date range picker</Link>
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
