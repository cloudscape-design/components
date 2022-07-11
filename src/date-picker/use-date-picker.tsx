// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { getWeekStartByLocale } from 'weekstart';
import { DayIndex } from './calendar';
import { normalizeLocale } from './calendar/utils/locales';
import { CalendarTypes } from './calendar/definitions';
import { formatDate } from './calendar/utils/date';
import { usePrevious } from '../internal/hooks/use-previous';

export function UseDatePicker({ locale, startOfWeek, value }: UseDatePickerProps) {
  const [calendarHasFocus, setCalendarHasFocus] = useState<boolean>(false);
  const normalizedLocale = normalizeLocale('DatePicker', locale ?? '');
  const normalizedStartOfWeek = (
    typeof startOfWeek === 'number' ? startOfWeek : getWeekStartByLocale(normalizedLocale)
  ) as DayIndex;

  const defaultSelectedDate = value.length >= 10 ? value : null;
  const [selectedDate, setSelectedDate] = useState<string | null>(defaultSelectedDate);

  const defaultDisplayedDate = value.length >= 10 ? value : formatDate(new Date());
  const [displayedDate, setDisplayedDate] = useState<string>(defaultDisplayedDate);
  const [focusedDate, setFocusedDate] = useState<string | null>(null);

  const onChangeMonthHandler = (newMonth: Date) => {
    setDisplayedDate(formatDate(newMonth));
    setFocusedDate(null);
  };

  const onSelectDateHandler = ({ date }: CalendarTypes.DateDetail) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setDisplayedDate(formattedDate);
    setCalendarHasFocus(false);
    setFocusedDate(null);
  };

  const onDateFocusHandler = ({ date }: CalendarTypes.DateDetailNullable) => {
    if (date) {
      const value = formatDate(date);
      setFocusedDate(value);
    }
  };

  const prevValue = usePrevious(value);
  if (prevValue !== value) {
    if (value === '' && selectedDate !== value) {
      setSelectedDate(value);
    }
    // update the displayedDate when inputValue changes in order to
    // display the correct month when the date picker gets open again.
    if (value.length >= 4 && displayedDate !== value) {
      setDisplayedDate(value);
    }
    // set the selected date only when a full date (yyyy-mm-dd) is entered
    if (value.length >= 10 && selectedDate !== value) {
      setSelectedDate(value);
    }
  }

  return {
    normalizedLocale,
    normalizedStartOfWeek,
    displayedDate,
    selectedDate,
    focusedDate,
    calendarHasFocus,
    onChangeMonthHandler,
    onSelectDateHandler,
    onDateFocusHandler,
  };
}

export interface UseDatePickerProps {
  locale: string;
  startOfWeek: number | undefined;
  value: string;
}
