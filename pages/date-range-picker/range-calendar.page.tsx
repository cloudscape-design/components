// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Link, SpaceBetween } from '~components';
import RangeCalendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';

import { SimplePage } from '../app/templates';
import { Settings, useDateRangePickerSettings } from './common';

export default function RangeCalendarScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({ timeInputFormat: 'hh:mm' });
  const [value, setValue] = useState<DateRangePickerCalendarProps['value']>({
    start: { date: '2020-01-25', time: '' },
    end: { date: '2020-02-02', time: '' },
  });
  return (
    <SimplePage
      title="Date range picker: range calendar"
      settings={<Settings settings={settings} setSettings={setSettings} />}
    >
      <SpaceBetween direction="vertical" size="m">
        <Link id="focusable-before">Focusable element before</Link>

        <RangeCalendar
          {...props}
          value={value}
          setValue={setValue}
          customAbsoluteRangeControl={undefined}
          timeInputFormat="hh:mm:ss"
          absoluteFormat="slashed"
        />

        <Link id="focusable-after">Focusable element after</Link>
      </SpaceBetween>
    </SimplePage>
  );
}
