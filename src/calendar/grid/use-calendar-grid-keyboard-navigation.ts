// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { isSameMonth, isSameYear } from 'date-fns';
import { CalendarProps } from '../interfaces';
import {
  moveNextDay,
  movePrevDay,
  moveNextWeek,
  movePrevWeek,
  moveNextMonth,
  movePrevMonth,
  moveMonthDown,
  moveMonthUp,
} from '../utils/navigation';
import { KeyCode } from '../../internal/keycode';

export default function useCalendarGridKeyboardNavigation({
  baseDate,
  focusableDate,
  granularity,
  isDateEnabled,
  onChangePage,
  onFocusDate,
  onSelectDate,
}: {
  baseDate: Date;
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

  const isSamePage = isMonthPicker ? isSameYear : isSameMonth;

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

    if (!isSamePage(updatedFocusDate, baseDate)) {
      onChangePage(updatedFocusDate);
    }
    onFocusDate(updatedFocusDate);
  };

  return onGridKeyDownHandler;
}
