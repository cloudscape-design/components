// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { CalendarProps } from './interfaces';
import { moveNextDay, movePrevDay, moveNextWeek, movePrevWeek } from './utils/navigation';
import { KeyCode } from '../internal/keycode';
import { isSameMonth } from 'date-fns';

export default function useCalendarGridKeyboardNavigation({
  baseDate,
  focusableDate,
  isDateEnabled,
  onChangePage,
  onFocusDate,
  onSelectDate,
}: {
  baseDate: Date;
  focusableDate: Date | null;
  isDateEnabled: CalendarProps.IsDateEnabledFunction;
  onChangePage: (date: Date) => void;
  onFocusDate: (date: null | Date) => void;
  onSelectDate: (date: Date) => void;
}) {
  const onGridKeyDownHandler = (event: React.KeyboardEvent) => {
    let updatedFocusDate;

    if (focusableDate === null) {
      return;
    }

    switch (event.keyCode) {
      case KeyCode.space:
      case KeyCode.enter:
        event.preventDefault();
        if (focusableDate) {
          onFocusDate(null);
          onSelectDate(focusableDate);
        }
        return;
      case KeyCode.right:
        event.preventDefault();
        updatedFocusDate = moveNextDay(focusableDate, isDateEnabled);
        break;
      case KeyCode.left:
        event.preventDefault();
        updatedFocusDate = movePrevDay(focusableDate, isDateEnabled);
        break;
      case KeyCode.up:
        event.preventDefault();
        updatedFocusDate = movePrevWeek(focusableDate, isDateEnabled);
        break;
      case KeyCode.down:
        event.preventDefault();
        updatedFocusDate = moveNextWeek(focusableDate, isDateEnabled);
        break;
      default:
        return;
    }

    if (!isSameMonth(updatedFocusDate, baseDate)) {
      onChangePage(updatedFocusDate);
    }
    onFocusDate(updatedFocusDate);
  };

  return onGridKeyDownHandler;
}
