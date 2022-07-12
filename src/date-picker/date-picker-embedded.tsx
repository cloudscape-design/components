// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { DatePickerProps } from './interfaces';
import Calendar from './calendar';
import { memoizedDate } from './calendar/utils/date';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { useDatePicker } from './use-date-picker';

const DatePickerEmbedded = ({
  locale = '',
  startOfWeek,
  isDateEnabled,
  nextMonthAriaLabel,
  previousMonthAriaLabel,
  todayAriaLabel,
  value,
}: DatePickerProps) => {
  const {
    normalizedLocale,
    normalizedStartOfWeek,
    displayedDate,
    selectedDate,
    focusedDate,
    calendarHasFocus,
    onChangeMonthHandler,
    onSelectDateHandler,
    onDateFocusHandler,
  } = useDatePicker({
    locale,
    startOfWeek,
    value,
  });

  return (
    <div>
      <Calendar
        selectedDate={memoizedDate('value', selectedDate)}
        focusedDate={memoizedDate('focused', focusedDate)}
        displayedDate={memoizedDate('displayed', displayedDate)}
        locale={normalizedLocale}
        startOfWeek={normalizedStartOfWeek}
        isDateEnabled={isDateEnabled ? isDateEnabled : () => true}
        calendarHasFocus={calendarHasFocus}
        nextMonthLabel={nextMonthAriaLabel}
        previousMonthLabel={previousMonthAriaLabel}
        todayAriaLabel={todayAriaLabel}
        onChangeMonth={onChangeMonthHandler}
        onSelectDate={onSelectDateHandler}
        onFocusDate={onDateFocusHandler}
      />
    </div>
  );
};

applyDisplayName(DatePickerEmbedded, 'DatePickerEmbedded');
export default DatePickerEmbedded;
