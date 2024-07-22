// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Checkbox, Link, SpaceBetween } from '~components';
import RangeCalendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';

import { i18nStrings, i18nStringsDateOnly } from './common';

export default function RangeCalendarScenario() {
  const [value, setValue] = useState<DateRangePickerCalendarProps['value']>({
    start: { date: '2020-01-25', time: '' },
    end: { date: '2020-02-02', time: '' },
  });
  const [dateOnly, setDateOnly] = useState(false);

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Range calendar</h1>

        <Checkbox checked={dateOnly} onChange={event => setDateOnly(event.detail.checked)}>
          Date-only
        </Checkbox>

        <Link id="focusable-before">Focusable element before the range calendar</Link>

        <RangeCalendar
          value={value}
          setValue={setValue}
          locale="en-GB"
          i18nStrings={dateOnly ? i18nStringsDateOnly : i18nStrings}
          dateOnly={dateOnly}
          timeInputFormat="hh:mm"
          isDateEnabled={date => date.getDate() !== 15}
          customAbsoluteRangeControl={undefined}
        />

        <Link id="focusable-after">Focusable element after the range calendar</Link>
      </SpaceBetween>
    </Box>
  );
}
