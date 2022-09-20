// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { ExtendedOperatorFormProps } from '~components/property-filter/interfaces';
import Calendar from '~components/calendar';
import DateInput from '~components/date-input';
import { FormField, RadioGroup, TimeInput } from '~components';
import styles from './custom-forms.scss';

export function YesNoForm({ value, onChange }: ExtendedOperatorFormProps<boolean>) {
  return (
    <FormField>
      <RadioGroup
        value={value !== null ? value.toString() : null}
        onChange={event => onChange(event.detail.value === 'true')}
        items={[
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ]}
      />
    </FormField>
  );
}

export function yesNoFormat(value: null | boolean) {
  if (value === null) {
    return '';
  }
  return value === true ? 'Yes' : 'No';
}

export function DateTimeForm({ filter, operator, value, onChange }: ExtendedOperatorFormProps<string>) {
  // Using the most reasonable default time per operator.
  const defaultTime = operator === '<' || operator === '>=' ? undefined : '23:59:59';
  const { dateValue, timeValue } = value !== filter ? parseValue(value, defaultTime) : parseValue(filter, defaultTime);

  // Sync filter and value allowing the filter value to be submitted.
  useEffect(
    () => {
      filter && onChange(filter);
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
    if (dateValue) {
      onChange(dateValue + 'T' + timeValue || '00:00:00');
    }
  };

  return (
    <div className={styles['date-time-form']}>
      <FormField description="Date">
        <DateInput placeholder="YYYY/MM/DD" onChange={event => onChangeDate(event.detail.value)} value={dateValue} />
      </FormField>

      <FormField description="Time">
        <TimeInput
          format="hh:mm:ss"
          placeholder="hh:mm:ss"
          value={timeValue}
          onChange={event => onChangeTime(event.detail.value)}
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
    </div>
  );
}

export function DateForm({ filter, value, onChange }: ExtendedOperatorFormProps<string>) {
  const { dateValue } = value !== filter ? parseValue(value) : parseValue(filter);

  // Sync filter and value allowing the filter value to be submitted.
  useEffect(
    () => {
      filter && onChange(filter);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter]
  );

  return (
    <div className={styles['date-form']}>
      <FormField>
        <DateInput
          name="date"
          placeholder="YYYY/MM/DD"
          onChange={event => onChange(event.detail.value || null)}
          value={dateValue}
        />
      </FormField>

      <Calendar
        value={dateValue}
        locale="en-EN"
        previousMonthAriaLabel="Previous month"
        nextMonthAriaLabel="Next month"
        todayAriaLabel="Today"
        onChange={event => onChange(event.detail.value || null)}
      />
    </div>
  );
}

export function formatDateTime(isoDate: string): string {
  return isoDate ? isoDate + formatTimezoneOffset(isoDate) : '';
}

// Split value in date and time parts and provide masking if needed.
function parseValue(value: null | string, defaultTime = ''): { dateValue: string; timeValue: string } {
  const [datePart = '', timePart = ''] = (value ?? '').split('T');
  const [year] = datePart.split('-');
  return { dateValue: Number(year) < 9999 ? datePart : '', timeValue: timePart || defaultTime };
}

function formatTimezoneOffset(isoDate: string, offsetInMinutes?: number) {
  // Using default browser offset if not explicitly specified.
  offsetInMinutes = offsetInMinutes ?? 0 - new Date(isoDate).getTimezoneOffset();

  const sign = offsetInMinutes < 0 ? '-' : '+';
  const hoursOffset = Math.floor(Math.abs(offsetInMinutes) / 60)
    .toFixed(0)
    .padStart(2, '0');
  const minuteOffset = Math.abs(offsetInMinutes % 60)
    .toFixed(0)
    .padStart(2, '0');
  return `${sign}${hoursOffset}:${minuteOffset}`;
}
