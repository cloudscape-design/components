// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, Link, SpaceBetween } from '~components';

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

let blurCount = 0;
let focusCount = 0;
export default function DateRangePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const monthOnly = false;
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const expandToViewport = urlParams.expandToViewport ?? dateRangePickerDemoDefaults.expandToViewport;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;
  const blurLogDiv = useRef<HTMLDivElement>(null);
  const focusLogDiv = useRef<HTMLDivElement>(null);
  const handleFocus = () => {
    focusCount++;
    if (focusLogDiv.current) {
      focusLogDiv.current.textContent = `onFocus event called ${focusCount} times.`;
    }
  };
  const handleBlur = () => {
    blurCount++;
    if (blurLogDiv.current) {
      blurLogDiv.current.textContent = `onBlur event called ${blurCount} times.`;
    }
  };

  const [changeCount, setChangeCount] = useState(0);
  const [onChangeDetails, setOnChangeDetails] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2018-01-09T12:34:56Z',
    endDate: '2018-01-19T15:30:00',
  });

  return (
    <Box padding="s">
      <h1>Date range picker with event handlers</h1>
      <SpaceBetween direction="horizontal" size="m">
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
        <Checkbox
          checked={expandToViewport}
          onChange={({ detail }) => setUrlParams({ expandToViewport: detail.checked })}
        >
          expandToViewport
        </Checkbox>
      </SpaceBetween>
      <br />
      <Link id="focus-dismiss-helper">Focusable element</Link>
      <br />
      <div id="onFocusEvent" ref={focusLogDiv}>
        onFocus event called 0 times.
      </div>
      <div id="onBlurEvent" ref={blurLogDiv}>
        onBlur event called 0 times.
      </div>
      <div id="onChangeEvent">
        onChange Event: {changeCount} times. Latest detail: {JSON.stringify(onChangeDetails)}
      </div>
      <br />
      <DateRangePicker
        value={value}
        locale={'en-GB'}
        i18nStrings={generateI18nStrings(dateOnly, monthOnly)}
        timeOffset={0}
        placeholder={generatePlaceholder(dateOnly, monthOnly)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={event => {
          setValue(event.detail.value);
          setChangeCount(prevCount => prevCount + 1);
          setOnChangeDetails(event.detail.value);
        }}
        relativeOptions={generateRelativeOptions(dateOnly, monthOnly)}
        isValidRange={isValid}
        dateOnly={dateOnly}
        expandToViewport={expandToViewport}
        isDateEnabled={date => checkIfDisabled(date, disabledDates, monthOnly)}
        dateDisabledReason={date => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
      />
    </Box>
  );
}
