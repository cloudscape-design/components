// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { isSameMonth, isSameYear } from 'date-fns';

import { KeyCode } from '../../internal/keycode';
import handleKey from '../../internal/utils/handle-key';
import { CalendarProps } from '../interfaces';
import {
  moveMonthDown,
  moveMonthUp,
  moveNextDay,
  moveNextMonth,
  moveNextWeek,
  movePrevDay,
  movePrevMonth,
  movePrevWeek,
} from '../utils/navigation';

export default function useCalendarGridKeyboardNavigation({
  baseDate,
  focusableDate,
  granularity,
  isDateEnabled,
  isDateFocusable,
  onChangePage,
  onFocusDate,
  onSelectDate,
}: {
  baseDate: Date;
  focusableDate: Date | null;
  granularity: CalendarProps.Granularity;
  // determines if a date could be selected by user actions
  isDateEnabled: CalendarProps.IsDateEnabledFunction;
  // a date could be not enabled (isDateEnabled returns false), but focusable if it's disabled with reason
  isDateFocusable: CalendarProps.IsDateEnabledFunction;
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

  const onGridKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    let updatedFocusDate;

    const keys = [KeyCode.up, KeyCode.down, KeyCode.left, KeyCode.right, KeyCode.space, KeyCode.enter];

    if (focusableDate === null || keys.indexOf(event.keyCode) === -1) {
      return;
    }

    event.preventDefault();

    handleKey(event, {
      onActivate: () => {
        if (!isDateEnabled(focusableDate)) {
          return;
        }

        onFocusDate(null);
        onSelectDate(focusableDate);
      },
      onBlockEnd: () => (updatedFocusDate = moveDown(focusableDate, isDateFocusable)),
      onBlockStart: () => (updatedFocusDate = moveUp(focusableDate, isDateFocusable)),
      onInlineStart: () => (updatedFocusDate = moveLeft(focusableDate, isDateFocusable)),
      onInlineEnd: () => (updatedFocusDate = moveRight(focusableDate, isDateFocusable)),
    });

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
