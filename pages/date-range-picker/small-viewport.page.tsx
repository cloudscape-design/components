// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { DateRangePicker, DateRangePickerProps, FormField } from '~components';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings, isValid, relativeOptions } from './common';

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);
  const [expandToViewport, setExpandToViewport] = useState(false);

  return (
    <ScreenshotArea gutters={false}>
      <h1>Date range picker in small viewport</h1>
      <button id="toggle-expand-to-viewport" type="button" onClick={() => setExpandToViewport(!expandToViewport)}>
        {expandToViewport ? 'Disable' : 'Enable'} expandToViewport
      </button>
      <button id="focus-dismiss-helper" type="button">
        Focusable element
      </button>
      <FormField label="Date Range Picker field">
        <DateRangePicker
          value={value}
          locale={'en-EN'}
          i18nStrings={i18nStrings}
          placeholder={'Filter by a date and time range'}
          onChange={e => setValue(e.detail.value)}
          relativeOptions={relativeOptions}
          isValidRange={isValid}
          timeInputFormat="hh:mm"
          expandToViewport={expandToViewport}
        />
      </FormField>
    </ScreenshotArea>
  );
}
