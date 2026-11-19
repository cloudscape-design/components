// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { DateRangePicker, DateRangePickerProps, FormField, Grid, Header, Link, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';
import { Settings, useDateRangePickerSettings } from './common';

export default function DatePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({
    hasValue: false,
  });

  const renderCustomRelativeRangeControl = (
    selectedRange: DateRangePickerProps.RelativeValue | null,
    setSelectedDate: (value: DateRangePickerProps.RelativeValue) => void
  ) => {
    return (
      <div>
        <Header variant="h2" description="Please select the relative time.">
          Custom Relative Control
        </Header>
        <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
          <b key="select-minutes-label">Minutes</b>
          <SpaceBetween size="xs" direction="horizontal" key="select-minutes-values">
            <Link
              onFollow={() =>
                setSelectedDate({
                  unit: 'minute',
                  amount: 5,
                  type: 'relative',
                })
              }
            >
              5
            </Link>
            <Link
              onFollow={() =>
                setSelectedDate({
                  unit: 'minute',
                  amount: 15,
                  type: 'relative',
                })
              }
            >
              15
            </Link>
            <Link
              onFollow={() =>
                setSelectedDate({
                  unit: 'minute',
                  amount: 30,
                  type: 'relative',
                })
              }
            >
              30
            </Link>
            <Link
              onFollow={() =>
                setSelectedDate({
                  unit: 'minute',
                  amount: 45,
                  type: 'relative',
                })
              }
            >
              45
            </Link>
          </SpaceBetween>
        </Grid>
        Selected: {selectedRange ? selectedRange.amount + ' ' + selectedRange.unit : 'Nothing Selected.'}
      </div>
    );
  };

  return (
    <SimplePage
      title="Date range picker: custom relative content"
      settings={<Settings settings={settings} setSettings={setSettings} />}
    >
      <FormField label="Custom Relative Range Picker field">
        <DateRangePicker
          {...props}
          renderRelativeRangeContent={(selectedRange, setSelectedRange) =>
            renderCustomRelativeRangeControl(selectedRange, setSelectedRange)
          }
        />
      </FormField>
    </SimplePage>
  );
}
