// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, DatePicker, DatePickerProps, FormField, SpaceBetween } from '~components';

import i18nStrings from './i18n-strings';

// Helper: build a Date from the YYYY-MM-DD string the calendar passes in.
// The `date` argument is always at the start of the day in the local timezone.

// Example 1: disable weekends (a recurring set of "specific dates").
const isWeekday: DatePickerProps.IsDateEnabledFunction = date => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

// Example 2: disable a fixed date range (e.g. a company shutdown period).
const shutdownStart = new Date(2018, 0, 10); // 2018-01-10
const shutdownEnd = new Date(2018, 0, 20); // 2018-01-20
const isOutsideShutdown: DatePickerProps.IsDateEnabledFunction = date => date < shutdownStart || date > shutdownEnd;
const shutdownDisabledReason: DatePickerProps.DateDisabledReasonFunction = () =>
  'Bookings are closed during the January maintenance window (Jan 10–20).';

// Example 3: disable everything before today (only future dates selectable).
const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
const isNotInPast: DatePickerProps.IsDateEnabledFunction = date => date >= startOfToday();

export default function DisabledDatesPage() {
  const [weekdayValue, setWeekdayValue] = useState('');
  const [shutdownValue, setShutdownValue] = useState('2018-01-05');
  const [futureValue, setFutureValue] = useState('');

  return (
    <Box padding="l">
      <SpaceBetween direction="vertical" size="l">
        <h1>Date picker — disable specific dates and date ranges</h1>

        <FormField
          label="Weekdays only"
          description="Weekend dates are disabled and can neither be clicked nor selected via keyboard."
        >
          <DatePicker
            id="weekdays-only"
            value={weekdayValue}
            onChange={({ detail }) => setWeekdayValue(detail.value)}
            isDateEnabled={isWeekday}
            i18nStrings={i18nStrings}
            openCalendarAriaLabel={selectedDate =>
              'Choose date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
            }
            placeholder="YYYY/MM/DD"
          />
        </FormField>

        <FormField
          label="Excludes a maintenance window (with disabled reason)"
          description="Dates between Jan 10 and Jan 20, 2018 are disabled and announce a reason on focus/hover."
        >
          <DatePicker
            id="maintenance-window"
            value={shutdownValue}
            onChange={({ detail }) => setShutdownValue(detail.value)}
            isDateEnabled={isOutsideShutdown}
            dateDisabledReason={shutdownDisabledReason}
            i18nStrings={i18nStrings}
            openCalendarAriaLabel={selectedDate =>
              'Choose date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
            }
            placeholder="YYYY/MM/DD"
          />
        </FormField>

        <FormField label="Future dates only" description="All dates before today are disabled.">
          <DatePicker
            id="future-only"
            value={futureValue}
            onChange={({ detail }) => setFutureValue(detail.value)}
            isDateEnabled={isNotInPast}
            i18nStrings={i18nStrings}
            openCalendarAriaLabel={selectedDate =>
              'Choose date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
            }
            placeholder="YYYY/MM/DD"
          />
        </FormField>

        <Box variant="code">{JSON.stringify({ weekdayValue, shutdownValue, futureValue }, undefined, 2)}</Box>
      </SpaceBetween>
    </Box>
  );
}
