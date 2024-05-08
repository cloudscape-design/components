// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { DateRangePicker, DateRangePickerProps, FormField } from '~components';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings, isValid, relativeOptions } from './common';

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [sticky, setSticky] = useState(false);

  return (
    <ScreenshotArea>
      <h1>Date range picker in small viewport</h1>
      <button id="toggle-expand-to-viewport" type="button" onClick={() => setExpandToViewport(!expandToViewport)}>
        {expandToViewport ? 'Disable' : 'Enable'} expandToViewport
      </button>
      <button id="toggle-sticky" type="button" onClick={() => setSticky(!sticky)}>
        {sticky ? 'Disable' : 'Enable'} sticky
      </button>
      <button id="focus-dismiss-helper" type="button">
        Focusable element
      </button>
      <div style={sticky ? { minHeight: '200vh' } : {}}>
        <div style={sticky ? { position: 'sticky', insetBlockStart: 200 } : {}}>
          <FormField label="Date Range Picker field">
            <DateRangePicker
              value={value}
              locale="en-GB"
              i18nStrings={i18nStrings}
              placeholder="Filter by a date and time range"
              onChange={e => setValue(e.detail.value)}
              relativeOptions={relativeOptions}
              isValidRange={isValid}
              timeInputFormat="hh:mm"
              expandToViewport={expandToViewport}
            />
          </FormField>
        </div>
      </div>
    </ScreenshotArea>
  );
}
