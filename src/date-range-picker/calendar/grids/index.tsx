// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addMonths, isAfter, isBefore, isSameMonth, max, min } from 'date-fns';

import { getBaseDay, moveNextDay, moveNextWeek, movePrevDay, movePrevWeek } from '../../../calendar/utils/navigation';
import { useDateCache } from '../../../internal/hooks/use-date-cache';
import { KeyCode } from '../../../internal/keycode';
import handleKey from '../../../internal/utils/handle-key';
import { hasValue } from '../../../internal/utils/has-value';
import InternalSpaceBetween from '../../../space-between/internal';
import { DateRangePickerProps, DayIndex } from '../../interfaces';
import { findDateToFocus } from '../utils';
import { Grid } from './grid';

import styles from '../../styles.css.js';

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
  dateDisabledReason: DateRangePickerProps.DateDisabledReasonFunction;
  isSingleGrid: boolean;

  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;

  locale: string;
  startOfWeek: DayIndex;
  todayAriaLabel?: string;
  headingIdPrefix: string;
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
  onChangeMonth,

  locale,
  startOfWeek,
  todayAriaLabel,
  headingIdPrefix,
}: GridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridHasFocus, setGridHasFocus] = useState(false);

  const focusedDateRef = useRef<HTMLTableCellElement>(null);

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
    if (focusedDate && !isVisible(focusedDate, baseDate, isSingleGrid)) {
      const direction = isAfter(focusedDate, baseDate) ? -1 : 1;

      const newMonth = !isSingleGrid && direction === -1 ? addMonths(baseDate, -1) : baseDate;
      const nearestBaseDate = getBaseDay(newMonth, isDateFocusable);

      const newFocusedDate = findDateToFocus(focusedDate, nearestBaseDate, isDateFocusable);

      onFocusedDateChange(newFocusedDate);
    }
  }, [baseDate, focusedDate, isSingleGrid, isDateFocusable, onFocusedDateChange]);

  const onGridKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    let updatedFocusDate;

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
      onBlockEnd: () => focusedDate && (updatedFocusDate = moveNextWeek(focusedDate, isDateFocusable)),
      onBlockStart: () => focusedDate && (updatedFocusDate = movePrevWeek(focusedDate, isDateFocusable)),
      onInlineEnd: () => focusedDate && (updatedFocusDate = moveNextDay(focusedDate, isDateFocusable)),
      onInlineStart: () => focusedDate && (updatedFocusDate = movePrevDay(focusedDate, isDateFocusable)),
    });

    if (!updatedFocusDate) {
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
            dateDisabledReason={dateDisabledReason}
            onSelectDate={onSelectDate}
            onGridKeyDownHandler={onGridKeyDownHandler}
            onFocusedDateChange={onFocusedDateChange}
            locale={locale}
            startOfWeek={startOfWeek}
            todayAriaLabel={todayAriaLabel}
            ariaLabelledby={`${headingIdPrefix}-prevmonth`}
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
          dateDisabledReason={dateDisabledReason}
          onSelectDate={onSelectDate}
          onGridKeyDownHandler={onGridKeyDownHandler}
          onFocusedDateChange={onFocusedDateChange}
          locale={locale}
          startOfWeek={startOfWeek}
          todayAriaLabel={todayAriaLabel}
          ariaLabelledby={`${headingIdPrefix}-currentmonth`}
        />
      </InternalSpaceBetween>
    </div>
  );
};
