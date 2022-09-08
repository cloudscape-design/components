// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { CalendarTypes } from './calendar/definitions';
import { usePrevious } from '../internal/hooks/use-previous';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { DatePickerProps } from './interfaces';
import { formatDate } from '../internal/utils/date-time';

export function useDatePicker({ value, onChange }: UseDatePickerProps) {
  const defaultSelectedDate = value.length >= 10 ? value : null;
  const [selectedDate, setSelectedDate] = useState<string | null>(defaultSelectedDate);

  const defaultDisplayedDate = value.length >= 10 ? value : formatDate(new Date());
  const [displayedDate, setDisplayedDate] = useState<string>(defaultDisplayedDate);

  const onChangeMonthHandler = (newMonth: Date) => {
    setDisplayedDate(formatDate(newMonth));
  };

  const onSelectDateHandler = ({ date }: CalendarTypes.DateDetail) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setDisplayedDate(formattedDate);
    fireNonCancelableEvent(onChange, { value: formattedDate });
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
    defaultDisplayedDate,
    displayedDate,
    setDisplayedDate,
    selectedDate,
    setSelectedDate,
    onChangeMonthHandler,
    onSelectDateHandler,
  };
}

export interface UseDatePickerProps {
  value: string;
  onChange: NonCancelableEventHandler<DatePickerProps.ChangeDetail> | undefined;
}
