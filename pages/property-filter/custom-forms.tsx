// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { ExtendedOperatorFormProps } from '~components/property-filter/interfaces';
import Calendar from '~components/date-picker/calendar';
import DateInput from '~components/internal/components/date-input';
import { FormField, SpaceBetween, TimeInput } from '~components';

// Split value in date and time parts and provide masking if needed.
function parseValue(value: null | string, defaultTime = '00:00:00'): { dateValue: string; timeValue: string } {
  const [datePart = '', timePart = ''] = (value ?? '').split('T');
  const [year] = datePart.split('-');
  return { dateValue: Number(year) < 9999 ? datePart : '', timeValue: timePart || defaultTime };
}

export function DateTimeForm({ filter, operator, value, onChange }: ExtendedOperatorFormProps<string>) {
  // Using the most reasonable default time per operator.
  const defaultTime = operator === '<' || operator === '>=' ? '00:00:00' : '23:59:59';
  const { dateValue, timeValue } = value !== filter ? parseValue(value, defaultTime) : parseValue(filter, defaultTime);

  // Sync filter and value allowing the filter value to be submitted.
  useEffect(
    () => {
      onChange(filter);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter]
  );

  const onChangeDate = (dateValue: string) => {
    if (!dateValue) {
      onChange(null);
    } else {
      onChange(dateValue + 'T' + timeValue);
    }
  };

  // Always use 00:00:00 as default if the input was tocuhed to avoid user confusion.
  const onChangeTime = (timeValue: string) => {
    if (!timeValue) {
      onChange(dateValue + 'T' + '00:00:00');
    } else {
      onChange(dateValue + 'T' + timeValue);
    }
  };

  return (
    <SpaceBetween direction="vertical" size="s">
      <FormField label="Date">
        <DateInput
          name="date"
          ariaLabel="Enter the date in YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          onChange={event => onChangeDate(event.detail.value)}
          value={dateValue}
          disableAutocompleteOnBlur={true}
        />
      </FormField>

      <Calendar
        value={dateValue}
        locale="en-EN"
        previousMonthAriaLabel="Previous month"
        nextMonthAriaLabel="Next month"
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />

      <FormField label="Time">
        <TimeInput
          format="hh:mm:ss"
          placeholder="hh:mm:ss"
          ariaLabel="time-input"
          value={timeValue}
          onChange={event => onChangeTime(event.detail.value)}
        />
      </FormField>
    </SpaceBetween>
  );
}

export function DateForm({ filter, value, onChange }: ExtendedOperatorFormProps<string>) {
  const { dateValue } = value !== filter ? parseValue(value) : parseValue(filter);

  // Sync filter and value allowing the filter value to be submitted.
  useEffect(
    () => {
      onChange(filter);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter]
  );

  const onChangeDate = (dateValue: string) => {
    onChange(dateValue || null);
  };

  return (
    <SpaceBetween direction="vertical" size="s">
      <FormField label="Date">
        <DateInput
          name="date"
          ariaLabel="Enter the date in YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          onChange={event => onChangeDate(event.detail.value)}
          value={dateValue}
          disableAutocompleteOnBlur={true}
        />
      </FormField>

      <Calendar
        value={dateValue}
        locale="en-EN"
        previousMonthAriaLabel="Previous month"
        nextMonthAriaLabel="Next month"
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />
    </SpaceBetween>
  );
}
