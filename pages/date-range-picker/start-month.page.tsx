// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, DateRangePicker, FormField, Link } from '~components';

import { SimplePage } from '../app/templates';
import ScreenshotArea from '../utils/screenshot-area';
import { Settings, useDateRangePickerSettings } from './common';

export default function StartMonthScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({
    value: null,
    secondaryGrid: 'next',
    hasValue: false,
  });
  return (
    <SimplePage
      title="Date range picker: start month"
      settings={<Settings settings={settings} setSettings={setSettings} />}
    >
      <Link id="focusable-before">Focusable element before</Link>
      <br />
      <br />

      <ScreenshotArea gutters={false}>
        <FormField label="Date Range Picker field">
          <DateRangePicker {...props} />
        </FormField>

        <br />
        <br />
        <div style={{ blockSize: 800 }}>
          <b>
            Raw value: <Box variant="pre">{JSON.stringify(props.value, undefined, 2)}</Box>
          </b>
        </div>
      </ScreenshotArea>
    </SimplePage>
  );
}
