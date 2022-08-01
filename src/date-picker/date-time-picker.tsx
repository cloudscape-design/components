// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { DatePickerProps } from './interfaces';
import { fireNonCancelableEvent } from '../internal/events';
import { doShiftTimeOffset, formatOffset, getBrowserTimezoneOffset } from '../date-range-picker/time-offset.js';
import InternalSpaceBetween from '../space-between/internal.js';
import InternalTimeInput from '../time-input/internal.js';
import styles from './styles.css.js';

// DateTimePicker is an extension of the DatePicker. We still want to track it as DatePicker.
// eslint-disable-next-line @cloudscape-design/ban-files
import { DatePicker, TimeInputProps } from '../index.js';

export interface DateTimePickerProps extends DatePickerProps {
  timeOffset?: number;
  timeInputFormat?: TimeInputProps.Format;
  defaultTimeValue?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  timeOffset = getBrowserTimezoneOffset(),
  timeInputFormat,
  defaultTimeValue = '00:00:00',
  ...props
}: DateTimePickerProps) {
  const [{ dateValue, timeValue }, setValue] = useState(() => {
    const parts = (value ? doShiftTimeOffset(value, timeOffset) : '').split('T');
    return {
      dateValue: parts[0] ?? '',
      timeValue: parts[1] ?? defaultTimeValue,
    };
  });
  const setDateValue = (dateValue: string) => {
    const newValue = { dateValue, timeValue };
    setValue(newValue);
    fireNonCancelableEvent(onChange, { value: dateValue + 'T' + timeValue + formatOffset(timeOffset) });
  };
  const setTimeValue = (timeValue: string) => {
    const newValue = { dateValue, timeValue };
    setValue(newValue);
    // A valid time value contains 6 digits and two ':' separators.
    if (timeValue.length === 8) {
      fireNonCancelableEvent(onChange, { value: dateValue + 'T' + timeValue + formatOffset(timeOffset) });
    }
  };
  return (
    <InternalSpaceBetween direction="vertical" size="m" className={styles['date-picker-container']}>
      <DatePicker {...props} value={dateValue} onChange={e => setDateValue(e.detail.value)} />
      <InternalTimeInput value={timeValue} onChange={e => setTimeValue(e.detail.value)} format={timeInputFormat} />
    </InternalSpaceBetween>
  );
}
