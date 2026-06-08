// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import { PropertyFilterOperatorFormProps } from '@cloudscape-design/collection-hooks';
import Calendar, { CalendarProps } from '@cloudscape-design/components/calendar';
import DateInput, { DateInputProps } from '@cloudscape-design/components/date-input';
import DatePicker from '@cloudscape-design/components/date-picker';
import FormField from '@cloudscape-design/components/form-field';
import TimeInput, { TimeInputProps } from '@cloudscape-design/components/time-input';

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

export function formatDateTime(isoDate: string) {
  return isoDate ? isoDate + formatTimezoneOffset(isoDate) : '';
}

function isValidIsoDate(isoDate: string) {
  return !isNaN(new Date(isoDate).getTime());
}

function parseDateTimeFilter(filter: string) {
  const regexDate = /^(\d\d\d\d(-|\/\d\d)?(-|\/\d\d)?)(T\d\d(:\d\d)?(:\d\d)?)?/;
  const dateTime = filter.match(regexDate)?.[0] || '';

  let [dateValue, timeValue = ''] = dateTime.split('T');
  const [year, month = '01', day = '01'] = dateValue.split(/-|\//);
  const [hours = '00', minutes = '00', seconds = '00'] = timeValue.split(':');
  dateValue = year.length === 4 ? `${year}-${month}-${day}` : '';
  timeValue = timeValue ? `${hours}:${minutes}:${seconds}` : '';

  const value = !timeValue ? dateValue : dateValue + 'T' + timeValue;
  return isValidIsoDate(value) ? { dateValue, timeValue } : { dateValue: '', timeValue: '' };
}

function parseValue(value: string, defaultTime = '') {
  const [datePart = '', timePart = ''] = (value ?? '').split('T');
  return { dateValue: datePart, timeValue: timePart || defaultTime };
}

export function DateTimeForm({ filter, operator, value, onChange }: PropertyFilterOperatorFormProps<string>) {
  // Using the most reasonable default time per operator.
  const defaultTime = operator === '<' || operator === '>=' ? undefined : '23:59:59';
  const [{ dateValue, timeValue }, setState] = useState(parseValue(value ?? '', defaultTime));

  const onChangeDate = (dateValue: string) => {
    setState(state => ({ ...state, dateValue }));
  };

  const onChangeTime = (timeValue: string) => {
    setState(state => ({ ...state, timeValue }));
  };

  // Parse value from filter text when it changes.
  useEffect(() => {
    if (filter) {
      setState(parseDateTimeFilter(filter.trim()));
    }
  }, [filter]);

  // Call onChange only when the value is valid.
  useEffect(
    () => {
      const dateAndTimeValue = dateValue + 'T' + (timeValue || '00:00:00');

      if (!dateValue.trim()) {
        onChange(null);
      } else if (isValidIsoDate(dateAndTimeValue)) {
        onChange(dateAndTimeValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateValue, timeValue]
  );

  const dateInputProps: DateInputProps = {
    placeholder: 'YYYY/MM/DD',
    value: dateValue,
    onChange: event => onChangeDate(event.detail.value),
  };
  const timeInputProps: TimeInputProps = {
    format: 'hh:mm:ss',
    placeholder: 'hh:mm:ss',
    value: timeValue,
    onChange: event => onChangeTime(event.detail.value),
  };
  const calendarProps: CalendarProps = {
    value: dateValue,
    locale: 'en-EN',
    onChange: event => onChangeDate(event.detail.value),
  };

  if (typeof filter !== 'undefined') {
    return (
      <div className="date-time-form">
        <FormField description="Date">
          <DateInput {...dateInputProps} />
        </FormField>

        <FormField description="Time">
          <TimeInput {...timeInputProps} />
        </FormField>

        <Calendar {...calendarProps} />
      </div>
    );
  }

  return (
    <div className="date-time-form">
      <FormField description="Date">
        <DatePicker {...dateInputProps} {...calendarProps} />
      </FormField>

      <FormField description="Time">
        <TimeInput {...timeInputProps} />
      </FormField>
    </div>
  );
}
