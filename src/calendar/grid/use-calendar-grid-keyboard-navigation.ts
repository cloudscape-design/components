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
import handleKey from '../../internal/utils/handle-key';

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

    const keys = [KeyCode.up, KeyCode.down, KeyCode.left, KeyCode.right, KeyCode.space, KeyCode.enter];

    if (focusableDate === null || keys.indexOf(event.keyCode) === -1) {
      return;
    }

    event.preventDefault();

    handleKey({
      onActivate: () => {
        onFocusDate(null);
        onSelectDate(focusableDate);
      },
      onBlockEnd: () => (updatedFocusDate = moveDown(focusableDate, isDateEnabled)),
      onBlockStart: () => (updatedFocusDate = moveUp(focusableDate, isDateEnabled)),
      onInlineStart: () => (updatedFocusDate = moveLeft(focusableDate, isDateEnabled)),
      onInlineEnd: () => (updatedFocusDate = moveRight(focusableDate, isDateEnabled)),
    })(event);

    if (!updatedFocusDate) {
      return;
    }

    if (!isSamePage(updatedFocusDate, baseDate)) {
      onChangePage(updatedFocusDate);
    }
    onFocusDate(updatedFocusDate);
  };

  return onGridKeyDownHandler;
}
