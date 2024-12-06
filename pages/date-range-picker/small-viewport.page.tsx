// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Checkbox, DateRangePicker, DateRangePickerProps, FormField } from '~components';

import AppContext from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
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
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);
  const [sticky, setSticky] = useState(false);

  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const monthOnly = false;
  const expandToViewport = urlParams.expandToViewport ?? dateRangePickerDemoDefaults.expandToViewport;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;

  return (
    <ScreenshotArea>
      <h1>Date range picker in small viewport</h1>
      <button
        id="toggle-expand-to-viewport"
        type="button"
        onClick={() => setUrlParams({ expandToViewport: !expandToViewport })}
      >
        {expandToViewport ? 'Disable' : 'Enable'} expandToViewport
      </button>
      <button id="toggle-sticky" type="button" onClick={() => setSticky(!sticky)}>
        {sticky ? 'Disable' : 'Enable'} sticky
      </button>
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
      <button id="focus-dismiss-helper" type="button">
        Focusable element
      </button>
      <div style={sticky ? { minBlockSize: '200vh' } : {}}>
        <div style={sticky ? { position: 'sticky', insetBlockStart: 200 } : {}}>
          <FormField label="Date Range Picker field">
            <DateRangePicker
              value={value}
              locale="en-GB"
              i18nStrings={generateI18nStrings(dateOnly, monthOnly)}
              placeholder={generatePlaceholder(dateOnly, monthOnly)}
              onChange={e => setValue(e.detail.value)}
              relativeOptions={generateRelativeOptions(dateOnly, monthOnly)}
              dateOnly={dateOnly}
              isValidRange={isValid}
              timeInputFormat="hh:mm"
              expandToViewport={expandToViewport}
              isDateEnabled={(date: Date) => checkIfDisabled(date, disabledDates, monthOnly)}
              dateDisabledReason={(date: Date) =>
                applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)
              }
            />
          </FormField>
        </div>
      </div>
    </ScreenshotArea>
  );
}
