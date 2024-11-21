// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addMonths, addYears, isAfter, isBefore, isSameMonth, isSameYear, max, min } from 'date-fns';

import {
  getBaseDay,
  moveNextDay,
  moveNextWeek,
  movePrevDay,
  movePrevWeek,
} from '../../../calendar/utils/navigation-day';
import {
  moveMonthDown,
  moveMonthUp,
  moveNextMonth,
  movePrevMonth,
} from '../../../calendar/utils/navigation-month';
import { CalendarProps } from '../../../calendar/interfaces';
import { useDateCache } from '../../../internal/hooks/use-date-cache';
import { KeyCode } from '../../../internal/keycode';
import handleKey from '../../../internal/utils/handle-key';
import { hasValue } from '../../../internal/utils/has-value';
import InternalSpaceBetween from '../../../space-between/internal';
import { findDateToFocus } from '../utils';
import { Grid } from './grid';
import { SelectGridProps } from './interfaces';

import styles from '../../styles.css.js';

function isVisible(date: Date, baseDate: Date, isSingleGrid: boolean, granularity: CalendarProps.Granularity) {
  if (granularity === 'month') {
    if (isSingleGrid) {
      return isSameYear(date, baseDate);
    }

    const previousYear = addYears(baseDate, -1);

    return isSameYear(date, previousYear) || isSameYear(date, baseDate);
  }
  if (isSingleGrid) {
    return isSameMonth(date, baseDate);
  }

  const previousMonth = addMonths(baseDate, -1);

  return isSameMonth(date, previousMonth) || isSameMonth(date, baseDate);
}

export const Grids = ({
  baseDate,
  selectedStartDate,
  selectedEndDate,

  focusedDate,
  onFocusedDateChange,

  isDateEnabled,
  dateDisabledReason,
  isSingleGrid,

  onSelectDate,
  onPageChange,

  locale,
  todayAriaLabel,
  headingIdPrefix,
  startOfWeek = 0,
  granularity = 'day',
}: SelectGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridHasFocus, setGridHasFocus] = useState(false);

  const focusedDateRef = useRef<HTMLTableCellElement>(null);

  const addPages = granularity === 'day' ? addMonths : addYears;

  const dateCache = useDateCache();
  baseDate = dateCache(baseDate);
  focusedDate = focusedDate ? dateCache(focusedDate) : null;

  const isDateFocusable = useCallback(
    (date: Date) => {
      return isDateEnabled(date) || (!isDateEnabled(date) && !!dateDisabledReason(date));
    },
    [isDateEnabled, dateDisabledReason]
  );

  useEffect(() => {
    if (focusedDate && !isVisible(focusedDate, baseDate, isSingleGrid, granularity)) {
      const direction = isAfter(focusedDate, baseDate) ? -1 : 1;

      const newPage = !isSingleGrid && direction === -1 ? addPages(baseDate, -1) : baseDate;
      const nearestBaseDate = getBaseDay(newPage, isDateFocusable);

      const newFocusedDate = findDateToFocus(focusedDate, nearestBaseDate, isDateFocusable);

      onFocusedDateChange(newFocusedDate);
    }
  }, [baseDate, focusedDate, isSingleGrid, granularity, addPages, isDateFocusable, onFocusedDateChange]);

  const onGridKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    let updatedFocusDate;
    const isMonthPicker = granularity === 'month';

    const moveDown = isMonthPicker ? moveMonthDown : moveNextWeek;
    const moveLeft = isMonthPicker ? movePrevMonth : movePrevDay;
    const moveRight = isMonthPicker ? moveNextMonth : moveNextDay;
    const moveUp = isMonthPicker ? moveMonthUp : movePrevWeek;

    const keys = [KeyCode.up, KeyCode.down, KeyCode.left, KeyCode.right, KeyCode.space, KeyCode.enter];

    if (focusedDate === null || keys.indexOf(event.keyCode) === -1) {
      return;
    }

    event.preventDefault();

    handleKey(event, {
      onActivate: () => {
        if (!focusedDate || !isDateEnabled(focusedDate)) {
          return;
        }

        onSelectDate(focusedDate);
      },
      onBlockEnd: () => focusedDate && (updatedFocusDate = moveDown(focusedDate, isDateFocusable)),
      onBlockStart: () => focusedDate && (updatedFocusDate = moveUp(focusedDate, isDateFocusable)),
      onInlineEnd: () => focusedDate && (updatedFocusDate = moveLeft(focusedDate, isDateFocusable)),
      onInlineStart: () => focusedDate && (updatedFocusDate = moveRight(focusedDate, isDateFocusable)),
    });

    if (!updatedFocusDate) {
      return;
    }

    const updatedDateIsVisible = isVisible(updatedFocusDate, baseDate, isSingleGrid, granularity);

    if (!updatedDateIsVisible) {
      const newPageIsOnLeftSide = !isSingleGrid && isBefore(updatedFocusDate, baseDate);
      onPageChange(newPageIsOnLeftSide ? addPages(updatedFocusDate, 1) : updatedFocusDate);
    }
    onFocusedDateChange(updatedFocusDate);
  };

  useEffect(() => {
    // focus current date if the focus is already inside the calendar
    if (focusedDate !== null && gridHasFocus) {
      if (focusedDateRef.current && focusedDateRef.current !== document.activeElement) {
        focusedDateRef.current.focus();
      }
    }
  }, [focusedDate, gridHasFocus]);

  const onGridBlur = (event: React.FocusEvent) => {
    const newFocusTarget = event.relatedTarget || document.activeElement;
    const newFocusTargetIsInGrid = containerRef.current?.contains(newFocusTarget as Node);
    if (newFocusTarget && !newFocusTargetIsInGrid && gridHasFocus) {
      setGridHasFocus(false);
    }
  };

  const onGridFocus = () => {
    if (!gridHasFocus) {
      setGridHasFocus(true);
    }
  };

  const isRangeVisible = (selectedStartDate && selectedEndDate) || gridHasFocus;

  const rangeEnds: Date[] = [selectedStartDate ?? focusedDate, selectedEndDate ?? focusedDate].filter(hasValue);

  const rangeStartDate = min(rangeEnds);
  const rangeEndDate = max(rangeEnds);
  const pageUnit = granularity === 'day' ? 'month' : 'year';

  const sharedGridProps = {
    selectedEndDate,
    selectedStartDate,
    focusedDate,
    focusedDateRef,
    rangeStartDate: isRangeVisible ? rangeStartDate : null,
    rangeEndDate: isRangeVisible ? rangeEndDate : null,
    isDateEnabled,
    dateDisabledReason,
    onSelectDate,
    onGridKeyDownHandler,
    onFocusedDateChange,
    locale,
    startOfWeek,
    todayAriaLabel,
    granularity,
  };

  return (
    <div ref={containerRef} onFocus={onGridFocus} onBlur={onGridBlur}>
      <InternalSpaceBetween size="xs" direction="horizontal">
        {!isSingleGrid && (
          <Grid
            {...sharedGridProps}
            className={styles['first-grid']}
            baseDate={addPages(baseDate, -1)}
            ariaLabelledby={`${headingIdPrefix}-prev${pageUnit}`}
          />
        )}
        <Grid
          {...sharedGridProps}
          className={styles['second-grid']}
          baseDate={baseDate}
          ariaLabelledby={`${headingIdPrefix}-current${pageUnit}`}
        />
      </InternalSpaceBetween>
    </div>
  );
};
