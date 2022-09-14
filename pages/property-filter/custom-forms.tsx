// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { ExtendedOperatorFormProps } from '~components/property-filter/interfaces';
import Calendar from '~components/calendar';
import DateInput from '~components/date-input';
import { FormField, RadioGroup, SpaceBetween, TimeInput } from '~components';
import { useFormFieldContext } from '~components/internal/context/form-field-context';

export function YesNoForm({ value, onChange }: ExtendedOperatorFormProps<boolean>) {
  const { ariaLabelledby } = useFormFieldContext({});
  return (
    <RadioGroup
      value={value !== null ? value.toString() : null}
      onChange={event => onChange(event.detail.value === 'true')}
      items={[
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ]}
      ariaLabelledby={ariaLabelledby}
    />
  );
}

export function yesNoFormat(value: null | boolean) {
  if (value === null) {
    return '';
  }
  return value === true ? 'Yes' : 'No';
}

export function DateTimeForm({ filter, operator, value, onChange }: ExtendedOperatorFormProps<string>) {
  const { ariaLabelledby } = useFormFieldContext({});

  // Using the most reasonable default time per operator.
  const defaultTime = operator === '<' || operator === '>=' ? '00:00:00' : '23:59:59';
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
    if (!timeValue) {
      onChange(dateValue + 'T' + '00:00:00');
    } else {
      onChange(dateValue + 'T' + timeValue);
    }
  };

  return (
    <>
      <SpaceBetween direction="horizontal" size="s">
        <FormField description="Specify date">
          <DateInput
            placeholder="YYYY/MM/DD"
            ariaLabelledby={ariaLabelledby}
            onChange={event => onChangeDate(event.detail.value)}
            value={dateValue}
          />
        </FormField>

        <FormField description="Specify time">
          <TimeInput
            format="hh:mm:ss"
            placeholder="hh:mm:ss"
            ariaLabelledby={ariaLabelledby}
            value={timeValue}
            onChange={event => onChangeTime(event.detail.value)}
          />
        </FormField>
      </SpaceBetween>

      <Calendar
        value={dateValue}
        locale="en-EN"
        previousMonthAriaLabel="Previous month"
        nextMonthAriaLabel="Next month"
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />
    </>
  );
}

export function DateForm({ filter, value, onChange }: ExtendedOperatorFormProps<string>) {
  const { ariaLabelledby } = useFormFieldContext({});

  const { dateValue } = value !== filter ? parseValue(value) : parseValue(filter);

  // Sync filter and value allowing the filter value to be submitted.
  useEffect(
    () => {
      filter && onChange(filter);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter]
  );

  const onChangeDate = (dateValue: string) => {
    onChange(dateValue || null);
  };

  return (
    <SpaceBetween direction="vertical" size="s">
      <DateInput
        name="date"
        ariaLabelledby={ariaLabelledby}
        placeholder="YYYY/MM/DD"
        onChange={event => onChangeDate(event.detail.value)}
        value={dateValue}
      />

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

export function formatDateTime(isoDate: string): string {
  return isoDate + formatTimezoneOffset(isoDate);
}

// Split value in date and time parts and provide masking if needed.
function parseValue(value: null | string, defaultTime = '00:00:00'): { dateValue: string; timeValue: string } {
  const [datePart = '', timePart = ''] = (value ?? '').split('T');
  const [year] = datePart.split('-');
  return { dateValue: Number(year) < 9999 ? datePart : '', timeValue: timePart || defaultTime };
}

function formatTimezoneOffset(isoDate: string, offsetInMinutes: number = 0 - new Date(isoDate).getTimezoneOffset()) {
  const hoursOffset = Math.floor(Math.abs(offsetInMinutes) / 60)
    .toFixed(0)
    .padStart(2, '0');
  const minuteOffset = Math.abs(offsetInMinutes % 60)
    .toFixed(0)
    .padStart(2, '0');
  const sign = offsetInMinutes < 0 ? '-' : '+';
  return `${sign}${hoursOffset}:${minuteOffset}`;
}
