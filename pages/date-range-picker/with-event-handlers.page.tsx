// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, Link, SpaceBetween } from '~components';

import AppContext from '../app/app-context';
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

let blurCount = 0;
let focusCount = 0;
export default function DateRangePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const expandToViewport = urlParams.expandToViewport ?? dateRangePickerDemoDefaults.expandToViewport;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
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
          </select>
        </label>
        <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
          Month-only
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
        i18nStrings={i18nStrings}
        timeOffset={0}
        placeholder={'Filter by a date and time range'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={event => {
          setValue(event.detail.value);
          setChangeCount(prevCount => prevCount + 1);
          setOnChangeDetails(event.detail.value);
        }}
        relativeOptions={relativeOptions}
        isValidRange={isValid}
        expandToViewport={expandToViewport}
        granularity={monthOnly ? 'month' : 'day'}
        isDateEnabled={(date: Date) => applyDisabledIfEven(date, disabledDates, monthOnly)}
        dateDisabledReason={(date: Date) =>
          applyDisabledIfEven(date, disabledDates, monthOnly) ? '' : evenDisabledMsg
        }
      />
    </Box>
  );
}
