// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { DatePickerProps } from './interfaces';
import Calendar, { DayIndex } from './calendar';
import { memoizedDate } from './calendar/utils/date';
import { CalendarTypes } from './calendar/definitions';

export default function DatePickerEmbedded(
  calendarRef: React.RefObject<HTMLDivElement>,
  selectedDate: string | null,
  focusedDate: string | null,
  displayedDate: string,
  normalizedLocale: string,
  normalizedStartOfWeek: DayIndex,
  isDateEnabled: DatePickerProps.IsDateEnabledFunction | undefined,
  calendarHasFocus: boolean,
  nextMonthAriaLabel: string,
  previousMonthAriaLabel: string,
  todayAriaLabel: string,
  onChangeMonthHandler: (newMonth: Date) => void,
  onSelectDateHandler: ({ date }: CalendarTypes.DateDetail) => void,
  onDateFocusHandler: ({ date }: CalendarTypes.DateDetailNullable) => void
) {
  return (
    <Calendar
      ref={calendarRef}
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
  );
}
