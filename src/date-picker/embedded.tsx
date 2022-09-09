// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { DatePickerBaseProps } from './interfaces';
import Calendar from './calendar';
import { memoizedDate } from './calendar/utils/memoized-date';
import { formatDate } from '../internal/utils/date-time';
import { fireNonCancelableEvent } from '../internal/events';

export const DatePickerEmbedded = ({
  value,
  locale = '',
  startOfWeek,
  isDateEnabled,
  nextMonthAriaLabel,
  previousMonthAriaLabel,
  todayAriaLabel,
  onChange,
}: DatePickerBaseProps) => {
  return (
    <Calendar
      selectedDate={memoizedDate('value', value)}
      locale={locale}
      startOfWeek={startOfWeek}
      isDateEnabled={isDateEnabled ? isDateEnabled : () => true}
      nextMonthLabel={nextMonthAriaLabel}
      previousMonthLabel={previousMonthAriaLabel}
      todayAriaLabel={todayAriaLabel}
      onSelectDate={e => fireNonCancelableEvent(onChange, { value: formatDate(e.date) })}
    />
  );
};
