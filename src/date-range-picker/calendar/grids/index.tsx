// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { KeyCode } from '../../../internal/keycode';
import { addDays, addWeeks, isSameMonth, isAfter, isBefore, addMonths, min, max } from 'date-fns';

import { DateChangeHandler, DayIndex, MonthChangeHandler } from '../index';
import { MoveFocusHandler } from '../../../calendar/utils/move-focus-handler';
import { DateRangePickerProps } from '../../interfaces';
import InternalSpaceBetween from '../../../space-between/internal';
import { Grid } from './grid';
import styles from '../../styles.css.js';

import useFocusVisible from '../../../internal/hooks/focus-visible/index';
import { getBaseDate } from '../get-base-date';
import { hasValue } from '../../../internal/utils/has-value';
import { useDateCache } from '../../../internal/hooks/use-date-cache';

function isVisible(date: Date, baseDate: Date, isSingleGrid: boolean) {
  if (isSingleGrid) {
    return isSameMonth(date, baseDate);
  }

  const previousMonth = addMonths(baseDate, -1);

  return isSameMonth(date, previousMonth) || isSameMonth(date, baseDate);
}

export interface GridProps {
  baseDate: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;

  focusedDate: Date | null;
  onFocusedDateChange: React.Dispatch<React.SetStateAction<Date | null>>;

  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction;
  isSingleGrid: boolean;

  onSelectDate: DateChangeHandler;
  onChangeMonth: MonthChangeHandler;
  handleFocusMove: MoveFocusHandler;

  locale: string;
  startOfWeek: DayIndex;
  todayAriaLabel: string;
}

export function selectFocusedDate(
  selected: Date | null,
  baseDate: Date,
  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction
) {
  if (selected && isDateEnabled(selected) && isSameMonth(selected, baseDate)) {
    return selected;
  }
  const today = new Date();
  if (isDateEnabled(today) && isSameMonth(today, baseDate)) {
    return today;
  }
  if (isDateEnabled(baseDate)) {
    return baseDate;
  }
  return null;
}

export const Grids = ({
  baseDate,
  selectedStartDate,
  selectedEndDate,

  focusedDate,
  onFocusedDateChange,

  isDateEnabled,
  isSingleGrid,

  onSelectDate,
  onChangeMonth,
  handleFocusMove,

  locale,
  startOfWeek,
  todayAriaLabel,
}: GridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridHasFocus, setGridHasFocus] = useState(false);

  const focusedDateRef = useRef<HTMLTableCellElement>(null);

  const dateCache = useDateCache();
  baseDate = dateCache(baseDate);
  focusedDate = focusedDate ? dateCache(focusedDate) : null;

  useEffect(() => {
    if (focusedDate && !isVisible(focusedDate, baseDate, isSingleGrid)) {
      // The nearestBaseDate depends on the direction of the month change
      const direction = isAfter(focusedDate, baseDate) ? 'backwards' : 'forwards';

      const newMonth = !isSingleGrid && direction === 'backwards' ? addMonths(baseDate, -1) : baseDate;
      const nearestBaseDate = getBaseDate(newMonth, direction === 'backwards' ? -1 : 1, isDateEnabled);

      const newFocusedDate = selectFocusedDate(focusedDate, nearestBaseDate, isDateEnabled);

      onFocusedDateChange(newFocusedDate);
    }
  }, [baseDate, focusedDate, isSingleGrid, isDateEnabled, onFocusedDateChange]);

  const onGridKeyDownHandler = (e: React.KeyboardEvent) => {
    let updatedFocusDate;

    if (focusedDate === null) {
      return;
    }

    switch (e.keyCode) {
      case KeyCode.space:
      case KeyCode.enter:
        e.preventDefault();
        if (focusedDate) {
          onSelectDate(focusedDate);
        }
        return;
      case KeyCode.right:
        e.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addDays(date, 1));
        break;
      case KeyCode.left:
        e.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addDays(date, -1));
        break;
      case KeyCode.up:
        e.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addWeeks(date, -1));
        break;
      case KeyCode.down:
        e.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addWeeks(date, 1));
        break;
      default:
        return;
    }

    const updatedDateIsVisible = isVisible(updatedFocusDate, baseDate, isSingleGrid);

    if (!updatedDateIsVisible) {
      const newMonthIsOnLeftSide = !isSingleGrid && isBefore(updatedFocusDate, baseDate);

      onChangeMonth(newMonthIsOnLeftSide ? addMonths(updatedFocusDate, 1) : updatedFocusDate);
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
    /*
     IE11 does not support event.relatedTarget, but sets document.activeElement to the newly
     focused element before the onBlur handler is called.

     However, other browsers do not make any guarantees for the value of document.activeElement
     during the execution of an onBlur handler. Therefore, we have to use event.relatedTarget
     instead.
     */
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

  const focusVisible = useFocusVisible();

  const isRangeVisible =
    (selectedStartDate && selectedEndDate) || (gridHasFocus && !!focusVisible['data-awsui-focus-visible']);

  const rangeEnds: Date[] = [selectedStartDate ?? focusedDate, selectedEndDate ?? focusedDate].filter(hasValue);

  const rangeStartDate = min(rangeEnds);
  const rangeEndDate = max(rangeEnds);

  return (
    <div ref={containerRef} onFocus={onGridFocus} onBlur={onGridBlur}>
      <InternalSpaceBetween size="xs" direction="horizontal">
        {!isSingleGrid && (
          <Grid
            className={styles['first-grid']}
            baseDate={addMonths(baseDate, -1)}
            selectedEndDate={selectedEndDate}
            selectedStartDate={selectedStartDate}
            rangeStartDate={isRangeVisible ? rangeStartDate : null}
            rangeEndDate={isRangeVisible ? rangeEndDate : null}
            focusedDate={focusedDate}
            focusedDateRef={focusedDateRef}
            isDateEnabled={isDateEnabled}
            onSelectDate={onSelectDate}
            onGridKeyDownHandler={onGridKeyDownHandler}
            onFocusedDateChange={onFocusedDateChange}
            locale={locale}
            startOfWeek={startOfWeek}
            todayAriaLabel={todayAriaLabel}
          />
        )}
        <Grid
          className={styles['second-grid']}
          baseDate={baseDate}
          selectedEndDate={selectedEndDate}
          selectedStartDate={selectedStartDate}
          rangeStartDate={isRangeVisible ? rangeStartDate : null}
          rangeEndDate={isRangeVisible ? rangeEndDate : null}
          focusedDate={focusedDate}
          focusedDateRef={focusedDateRef}
          isDateEnabled={isDateEnabled}
          onSelectDate={onSelectDate}
          onGridKeyDownHandler={onGridKeyDownHandler}
          onFocusedDateChange={onFocusedDateChange}
          locale={locale}
          startOfWeek={startOfWeek}
          todayAriaLabel={todayAriaLabel}
        />
      </InternalSpaceBetween>
    </div>
  );
};
