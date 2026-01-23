// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { DateRangePicker, FormField, Grid } from '~components';

import { SimplePage } from '../app/templates';
import { locales } from '../date-input/common';
import { Settings, useDateRangePickerSettings } from './common';

const rtlLocales = new Set(['ar', 'he']);

export default function DateRangePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({ rangeSelectorMode: 'absolute-only' });
  return (
    <SimplePage
      title="Date range picker: all locales for absolute format"
      settings={<Settings settings={settings} setSettings={setSettings} />}
    >
      {locales.map(locale => (
        <div key={`pickers-${locale}`} dir={rtlLocales.has(locale) ? 'rtl' : 'ltr'}>
          <Grid gridDefinition={[{ colspan: 1 }, { colspan: 11 }]}>
            <div style={{ textAlign: 'right' }}>{locale}</div>
            <FormField label="Date Range Picker field">
              <DateRangePicker {...props} locale={locale} />
            </FormField>
          </Grid>
        </div>
      ))}
    </SimplePage>
  );
}
