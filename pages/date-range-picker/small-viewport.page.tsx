// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Checkbox, DateRangePicker, DateRangePickerProps, FormField } from '~components';

import AppContext from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import {
  applyDisabledIfEven,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  evenDisabledMsg,
  i18nStrings,
  isValid,
  relativeOptions,
} from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);
  const [sticky, setSticky] = useState(false);

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const expandToViewport = urlParams.expandToViewport ?? dateRangePickerDemoDefaults.expandToViewport;
  const disableEven = urlParams.disableEven ?? dateRangePickerDemoDefaults.disableEven;

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
      <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
        Month-only
      </Checkbox>
      <Checkbox checked={disableEven} onChange={({ detail }) => setUrlParams({ disableEven: detail.checked })}>
        Disable even dates
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
              i18nStrings={i18nStrings}
              placeholder="Filter by a date and time range"
              onChange={e => setValue(e.detail.value)}
              granularity={monthOnly ? 'month' : 'day'}
              relativeOptions={relativeOptions}
              isValidRange={isValid}
              timeInputFormat="hh:mm"
              expandToViewport={expandToViewport}
              isDateEnabled={(date: Date) => applyDisabledIfEven(date, !disableEven, monthOnly)}
              dateDisabledReason={(date: Date) =>
                applyDisabledIfEven(date, !disableEven, monthOnly) ? '' : evenDisabledMsg
              }
            />
          </FormField>
        </div>
      </div>
    </ScreenshotArea>
  );
}
