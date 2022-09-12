// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ExtendedOperatorForm } from '~components/property-filter/interfaces';
import Calendar from '~components/date-picker/calendar';
import DateInput from '~components/internal/components/date-input';
import { FormField, SpaceBetween, TimeInput } from '~components';
import { padStart } from 'lodash';

export const DateTimeForm: ExtendedOperatorForm<string> = ({ filter, operator, value, onChange }) => {
  const defaultTime = operator === '<' || operator === '>=' ? '00:00:00' : '23:59:59';
  const parsedFilter = parseValue(filter, defaultTime);
  const parsedValue = parseValue(value, defaultTime);

  const onChangeDate = (dateValue: string) => {
    if (!dateValue) {
      onChange(null);
    } else {
      const timeValue = value ? parsedValue.timeValue : parsedFilter.timeValue;
      onChange(dateValue + 'T' + timeValue);
    }
  };

  const onChangeTime = (timeValue: string) => {
    const dateValue = value ? parsedValue.dateValue : parsedFilter.dateValue;
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
          value={value ? parsedValue.dateValue : parsedFilter.dateValue}
          disableAutocompleteOnBlur={true}
        />
      </FormField>

      <Calendar
        value={value ? parsedValue.dateValue : parsedFilter.dateValue}
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
          value={value ? parsedValue.timeValue : parsedFilter.timeValue}
          onChange={event => onChangeTime(event.detail.value)}
        />
      </FormField>
    </SpaceBetween>
  );
};

export const DateForm: ExtendedOperatorForm<string> = ({ filter, value, onChange }) => {
  const parsedFilter = parseValue(filter);
  const parsedValue = parseValue(value);

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
          value={value ? parsedValue.dateValue : parsedFilter.dateValue}
          disableAutocompleteOnBlur={true}
        />
      </FormField>

      <Calendar
        value={value ? parsedValue.dateValue : parsedFilter.dateValue}
        locale="en-EN"
        previousMonthAriaLabel="Previous month"
        nextMonthAriaLabel="Next month"
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />
    </SpaceBetween>
  );
};

function parseValue(originalValue: null | string, defaultTime = '00:00:00'): { dateValue: string; timeValue: string } {
  const [datePart = '', timePart = ''] = (originalValue ?? '').split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  let dateValue = '';
  if (!isNaN(Number(year)) && Number(year) > 1970) {
    dateValue += year + '-';
    if (!isNaN(Number(month)) && Number(month) > 0) {
      dateValue += padStart(month, 2, '0') + '-';
      if (!isNaN(Number(day)) && Number(day) > 0) {
        dateValue += padStart(day, 2, '0');
      }
    }
  }

  let timeValue = '';
  if (!isNaN(Number(hours)) && Number(hours) > 0) {
    timeValue += hours + ':';
  } else {
    timeValue += '00:';
  }
  if (!isNaN(Number(minutes)) && Number(minutes) > 0) {
    timeValue += padStart(minutes, 2, '0') + ':';
  } else {
    timeValue += '00:';
  }
  if (!isNaN(Number(seconds)) && Number(seconds) > 0) {
    timeValue += padStart(seconds, 2, '0');
  } else {
    timeValue += '00';
  }

  if (timeValue === '00:00:00') {
    timeValue = defaultTime;
  }

  return { dateValue, timeValue };
}
