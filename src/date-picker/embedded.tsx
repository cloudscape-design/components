// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { DatePickerBaseProps } from './interfaces';
import Calendar from './calendar';
import { memoizedDate } from './calendar/utils/date';
import { useDatePicker } from './use-date-picker';

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
  const { displayedDate, selectedDate, onChangeMonthHandler, onSelectDateHandler } = useDatePicker({
    value,
    onChange,
  });

  return (
    <Calendar
      selectedDate={memoizedDate('value', selectedDate)}
      displayedDate={memoizedDate('displayed', displayedDate)}
      locale={locale}
      startOfWeek={startOfWeek}
      isDateEnabled={isDateEnabled ? isDateEnabled : () => true}
      nextMonthLabel={nextMonthAriaLabel}
      previousMonthLabel={previousMonthAriaLabel}
      todayAriaLabel={todayAriaLabel}
      onChangeMonth={onChangeMonthHandler}
      onSelectDate={onSelectDateHandler}
    />
  );
};
