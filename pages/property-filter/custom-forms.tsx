// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { DatePicker, FormField, RadioGroup, TimeInput, TimeInputProps } from '~components';
import Calendar, { CalendarProps } from '~components/calendar';
import DateInput from '~components/date-input';
import EmbeddedMultiselect from '~components/multiselect/embedded';
import InternalMultiselect from '~components/multiselect/internal';
import { ExtendedOperatorFormProps } from '~components/property-filter/interfaces';

import { allItems } from './table.data';

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

export function DateTimeForm({
  filter,
  operator,
  value,
  onChange,
  legacy,
}: ExtendedOperatorFormProps<string> & { legacy?: boolean }) {
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

  const calendarProps: CalendarProps = {
    value: dateValue,
    locale: 'en-GB',
    onChange: event => onChangeDate(event.detail.value),
  };
  const timeInputProps: TimeInputProps = {
    format: 'hh:mm:ss',
    placeholder: 'hh:mm:ss',
    value: timeValue,
    onChange: event => onChangeTime(event.detail.value),
  };

  return (
    <div className={styles['date-time-form']}>
      {typeof filter === 'undefined' && !legacy ? (
        <>
          <FormField description="Date">
            <DatePicker placeholder="YYYY/MM/DD" {...calendarProps} />
          </FormField>

          <FormField description="Time">
            <TimeInput {...timeInputProps} />
          </FormField>
        </>
      ) : (
        <>
          <FormField description="Date">
            <DateInput placeholder="YYYY/MM/DD" {...calendarProps} />
          </FormField>

          <FormField description="Time">
            <TimeInput {...timeInputProps} />
          </FormField>

          <Calendar {...calendarProps} />
        </>
      )}
    </div>
  );
}

export function DateTimeFormLegacy(props: ExtendedOperatorFormProps<string>) {
  return <DateTimeForm {...props} legacy={true} />;
}

export function DateForm({ filter, value, onChange }: ExtendedOperatorFormProps<string>) {
  const [{ dateValue }, setState] = useState(parseValue(value ?? ''));

  const onChangeDate = (dateValue: string) => {
    setState(state => ({ ...state, dateValue }));
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

  if (typeof filter === 'undefined') {
    return (
      <FormField>
        <DatePicker
          name="date"
          placeholder="YYYY/MM/DD"
          onChange={event => onChangeDate(event.detail.value)}
          value={dateValue}
        />
      </FormField>
    );
  }

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

      <Calendar value={dateValue} locale="en-GB" onChange={event => onChangeDate(event.detail.value)} />
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

export function OwnerMultiSelectForm({ value, onChange, filter }: ExtendedOperatorFormProps<string[]>) {
  value = value && Array.isArray(value) ? value : [];

  if (typeof filter !== 'undefined') {
    return (
      <EmbeddedMultiselect
        options={allOwners.map(owner => ({ value: owner, label: owner }))}
        selectedOptions={value.map(owner => ({ value: owner, label: owner })) ?? []}
        onChange={event =>
          onChange(
            event.detail.selectedOptions
              .map(({ value }) => value)
              .filter((value): value is string => typeof value !== 'undefined')
          )
        }
        filteringText={filter}
        statusType="finished"
        filteringType="auto"
        empty="No options available"
        noMatch="No options matched"
      />
    );
  }

  return (
    <div className={styles['multiselect-form']}>
      <FormField stretch={true}>
        <InternalMultiselect
          options={allOwners.map(owner => ({ value: owner, label: owner }))}
          selectedOptions={value.map(owner => ({ value: owner, label: owner })) ?? []}
          onChange={event =>
            onChange(
              event.detail.selectedOptions
                .map(({ value }) => value)
                .filter((value): value is string => typeof value !== 'undefined')
            )
          }
          statusType="finished"
          filteringType="none"
          expandToViewport={true}
          keepOpen={true}
          hideTokens={false}
          inlineTokens={true}
        />
      </FormField>
    </div>
  );
}

export function formatOwners(owners: string[]) {
  return owners && Array.isArray(owners) ? owners.join(', ') : '';
}
