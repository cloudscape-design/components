// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { Box, DateRangePicker, DateRangePickerProps, FormField, Link } from '~components';

import { SimplePage } from '../app/templates';
import { Settings, useDateRangePickerSettings } from './common';

let blurCount = 0;
let focusCount = 0;
export default function DateRangePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({ hasValue: false });

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
    <SimplePage
      title="Date range picker: event handlers"
      settings={<Settings settings={settings} setSettings={setSettings} />}
    >
      <Link id="focusable-before">Focusable element before</Link>
      <br />

      <Box variant="pre">
        <div id="onFocusEvent" ref={focusLogDiv}>
          onFocus event called 0 times.
        </div>
        <div id="onBlurEvent" ref={blurLogDiv}>
          onBlur event called 0 times.
        </div>
        <div id="onChangeEvent">
          onChange Event: {changeCount} times. Latest detail: {JSON.stringify(onChangeDetails)}
        </div>
      </Box>

      <FormField label="Date Range Picker field">
        <DateRangePicker
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={event => {
            props.onChange?.(event);
            setChangeCount(prevCount => prevCount + 1);
            setOnChangeDetails(event.detail.value);
          }}
        />
      </FormField>
    </SimplePage>
  );
}
