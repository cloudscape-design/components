// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
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
  const [{ dateValue, timeValue }, setState] = useState(parseValue(value ?? '', defaultTime));

  const onChangeDate = (dateValue: string) => {
    if (!dateValue) {
      setState({ dateValue: '', timeValue: '' });
    } else {
      setState(state => ({ ...state, dateValue }));
    }
  };

  const onChangeTime = (timeValue: string) => {
    setState(state => (state.dateValue ? { ...state, timeValue } : state));
  };

  // Parse value from filter text when it changes.
  useEffect(
    () => {
      filter && setState(parseDateTimeFilter(filter.trim()));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter]
  );

  // Call onChange only when the value is valid.
  useEffect(
    () => {
      if (!dateValue.trim()) {
        onChange(null);
      } else if (isValidIsoDate(dateValue + 'T' + timeValue)) {
        onChange(dateValue + 'T' + timeValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateValue, timeValue]
  );

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
  const [{ dateValue }, setState] = useState(parseValue(value ?? ''));

  const onChangeDate = (isoDate: string) => {
    setState({ dateValue: isoDate, timeValue: '' });
  };

  // Parse value from filter text when it changes.
  useEffect(() => {
    filter && setState(parseDateTimeFilter(filter.trim()));
  }, [filter]);

  // Call onChange only when the value is valid.
  useEffect(
    () => {
      if (!dateValue.trim()) {
        onChange(null);
      } else if (isValidIsoDate(dateValue)) {
        onChange(dateValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateValue]
  );

  return (
    <div className={styles['date-form']}>
      <FormField>
        <DateInput
          name="date"
          placeholder="YYYY/MM/DD"
          onChange={event => onChangeDate(event.detail.value)}
          value={dateValue}
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

export function formatDateTime(isoDate: string): string {
  return isoDate ? isoDate + formatTimezoneOffset(isoDate) : '';
}

function parseDateTimeFilter(filter: string): { dateValue: string; timeValue: string } {
  const regexDate = /^(\d\d\d\d(-\d\d)?(-\d\d)?)(T\d\d(:\d\d)?(:\d\d)?)?/;
  const dateTime = filter.match(regexDate)?.[0] || '';
  const [dateValue, timeValue] = dateTime.split('T');

  if (!timeValue) {
    return { dateValue: isValidIsoDate(dateValue) ? dateValue : '', timeValue: ' ' };
  }

  const [hours = '00', minutes = '00', seconds = '00'] = timeValue.split(':');
  return isValidIsoDate(dateValue + `T${hours}:${minutes}:${seconds}`)
    ? { dateValue, timeValue }
    : { dateValue: '', timeValue: '' };
}

function isValidIsoDate(isoDate: string): boolean {
  return !isNaN(new Date(isoDate).getTime());
}

function parseValue(value: null | string, defaultTime = ''): { dateValue: string; timeValue: string } {
  const [datePart = '', timePart = ''] = (value ?? '').split('T');
  return { dateValue: datePart, timeValue: timePart || defaultTime };
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
