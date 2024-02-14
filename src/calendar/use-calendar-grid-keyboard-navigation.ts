// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { CalendarProps } from './interfaces';
import {
  moveNextDay,
  movePrevDay,
  moveNextWeek,
  movePrevWeek,
  moveNextMonth,
  movePrevMonth,
  moveMonthDown,
  moveMonthUp,
} from './utils/navigation';
import { KeyCode } from '../internal/keycode';

export default function useCalendarGridKeyboardNavigation({
  belongsToCurrentPage,
  focusableDate,
  granularity,
  isDateEnabled,
  onChangePage,
  onFocusDate,
  onSelectDate,
}: {
  belongsToCurrentPage: (date: Date) => boolean;
  focusableDate: Date | null;
  granularity: CalendarProps.Granularity;
  isDateEnabled: CalendarProps.IsDateEnabledFunction;
  onChangePage: (date: Date) => void;
  onFocusDate: (date: null | Date) => void;
  onSelectDate: (date: Date) => void;
}) {
  const isMonthPicker = granularity === 'month';

  const moveDown = isMonthPicker ? moveMonthDown : moveNextWeek;
  const moveLeft = isMonthPicker ? movePrevMonth : movePrevDay;
  const moveRight = isMonthPicker ? moveNextMonth : moveNextDay;
  const moveUp = isMonthPicker ? moveMonthUp : movePrevWeek;

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
        updatedFocusDate = moveRight(focusableDate, isDateEnabled);
        break;
      case KeyCode.left:
        event.preventDefault();
        updatedFocusDate = moveLeft(focusableDate, isDateEnabled);
        break;
      case KeyCode.up:
        event.preventDefault();
        updatedFocusDate = moveUp(focusableDate, isDateEnabled);
        break;
      case KeyCode.down:
        event.preventDefault();
        updatedFocusDate = moveDown(focusableDate, isDateEnabled);
        break;
      default:
        return;
    }

    if (!belongsToCurrentPage(updatedFocusDate)) {
      onChangePage(updatedFocusDate);
    }
    onFocusDate(updatedFocusDate);
  };

  return onGridKeyDownHandler;
}
