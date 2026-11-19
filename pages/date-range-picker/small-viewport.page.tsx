// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, DateRangePicker, FormField, Link, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';
import { Settings, useDateRangePickerSettings } from './common';

export default function DatePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({
    hasValue: false,
    timeInputFormat: 'hh:mm',
  });
  const [sticky, setSticky] = useState(false);
  return (
    <SimplePage
      title="Date range picker: small viewport"
      settings={
        <SpaceBetween size="s">
          <Settings settings={settings} setSettings={setSettings} />
          <Checkbox checked={sticky} onChange={({ detail }) => setSticky(detail.checked)}>
            Sticky
          </Checkbox>
        </SpaceBetween>
      }
      screenshotArea={{}}
    >
      <SpaceBetween size="m">
        <Link id="focusable-before">Focusable element before</Link>

        <div style={sticky ? { minBlockSize: '200vh' } : {}}>
          <div style={sticky ? { position: 'sticky', insetBlockStart: 200 } : {}}>
            <FormField label="Date Range Picker field">
              <DateRangePicker {...props} />
            </FormField>
          </div>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
