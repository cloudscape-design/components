// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { ExtendedOperatorFormProps } from '~components/property-filter/interfaces';
import Calendar from '~components/calendar';
import DateInput from '~components/date-input';
import Multiselect from '~components/multiselect';
import { Box, ColumnLayout, FormField, RadioGroup, TimeInput } from '~components';
import styles from './custom-forms.scss';
import { allItems } from './table.data';

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
    setState(state => ({ ...state, dateValue }));
  };

  const onChangeTime = (timeValue: string) => {
    setState(state => ({ ...state, timeValue }));
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
        locale="en-GB"
        previousMonthAriaLabel="Previous month"
        nextMonthAriaLabel="Next month"
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />
    </div>
  );
}

export function DateRangeForm({
  filter,
  value: initialValue,
  operator,
  onChange,
}: ExtendedOperatorFormProps<string | [string, string]>) {
  let [initialStart, initialEnd] = Array.isArray(initialValue) ? initialValue : ['', ''];
  if (typeof initialValue === 'string') {
    if (operator === '=') {
      initialStart = initialValue;
      initialEnd = initialValue;
    }
    if (operator === '>=') {
      initialStart = initialValue;
    }
    if (operator === '<') {
      initialEnd = initialValue;
    }
  }

  const [value, setState] = useState([initialStart, initialEnd]);

  const startDate = parseValue(value[0]).dateValue;
  const onChangeStartDate = (startDate: string) => {
    setState(([, endDate]) => [startDate, endDate]);
  };

  const endDate = parseValue(value[1]).dateValue;
  const onChangeEndDate = (endDate: string) => {
    setState(([startDate]) => [startDate, endDate]);
  };

  // Parse value from filter text when it changes.
  useEffect(() => {
    if (filter) {
      const [startDateStr = '', endDateStr = ''] = filter.trim().split(',');
      const startDate = parseDateTimeFilter(startDateStr).dateValue;
      const endDate = parseDateTimeFilter(endDateStr).dateValue;
      setState([startDate, endDate]);
    }
  }, [filter]);

  // Call onChange only when the value is valid.
  useEffect(
    () => {
      const isStartDateValid = !startDate.trim() || isValidIsoDate(startDate);
      const isEndDateValid = !endDate.trim() || isValidIsoDate(endDate);
      if (isStartDateValid && isEndDateValid) {
        let operator = ':';
        if (startDate && !endDate) {
          operator = '>=';
        }
        if (endDate && !startDate) {
          operator = '<';
        }
        if (startDate === endDate) {
          operator = '=';
        }
        if (operator === ':') {
          onChange([startDate, endDate], operator);
        } else {
          onChange(startDate || endDate, operator);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startDate, endDate]
  );

  return (
    <div className={styles['date-form']}>
      <ColumnLayout columns={2}>
        <Box>
          <FormField description="Start date">
            <DateInput
              name="start-date"
              placeholder="YYYY/MM/DD"
              onChange={event => onChangeStartDate(event.detail.value)}
              value={startDate}
            />
          </FormField>

          <Calendar
            value={startDate}
            locale="en-GB"
            previousMonthAriaLabel="Previous month"
            nextMonthAriaLabel="Next month"
            todayAriaLabel="Today"
            onChange={event => onChangeStartDate(event.detail.value)}
          />
        </Box>

        <Box>
          <FormField description="End date">
            <DateInput
              name="end-date"
              placeholder="YYYY/MM/DD"
              onChange={event => onChangeEndDate(event.detail.value)}
              value={endDate}
            />
          </FormField>

          <Calendar
            value={endDate}
            locale="en-GB"
            previousMonthAriaLabel="Previous month"
            nextMonthAriaLabel="Next month"
            todayAriaLabel="Today"
            onChange={event => onChangeEndDate(event.detail.value)}
          />
        </Box>
      </ColumnLayout>
    </div>
  );
}

export function formatDateTime(isoDate: string): string {
  return isoDate ? isoDate + formatTimezoneOffset(isoDate) : '';
}

function parseDateTimeFilter(filter: string): { dateValue: string; timeValue: string } {
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

const allOwners = [...new Set(allItems.map(({ owner }) => owner))];

export function OwnerMultiSelectForm({ value, onChange }: ExtendedOperatorFormProps<string[]>) {
  return (
    <FormField>
      <Multiselect
        options={allOwners.map(owner => ({ value: owner, label: owner }))}
        selectedOptions={value?.map(owner => ({ value: owner, label: owner })) ?? []}
        onChange={event =>
          onChange(
            event.detail.selectedOptions
              .map(({ value }) => value)
              .filter((value): value is string => typeof value !== 'undefined')
          )
        }
        expandToViewport={true}
      />
    </FormField>
  );
}

export function formatOwners(owners: string[]) {
  return owners.join(', ');
}
