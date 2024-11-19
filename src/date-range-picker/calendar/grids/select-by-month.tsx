// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addMonths, addYears, isAfter, isBefore, isSameMonth, max, min } from 'date-fns';

import {
  getBaseDay,
  //  moveNextDay, moveNextWeek, movePrevDay, movePrevWeek
} from '../../../calendar/utils/navigation';
import { useDateCache } from '../../../internal/hooks/use-date-cache';
import { KeyCode } from '../../../internal/keycode';
import handleKey from '../../../internal/utils/handle-key';
import { hasValue } from '../../../internal/utils/has-value';
import InternalSpaceBetween from '../../../space-between/internal';
// import { DateRangePickerProps, DayIndex } from '../../interfaces';
import { findMonthToFocus } from '../utils';
import { MonthlyGrid, MonthlyGridBaseProps } from './monthly-grid';

import styles from '../../styles.css.js';

function isVisible(date: Date, baseDate: Date, isSingleGrid: boolean) {
  if (isSingleGrid) {
    return isSameMonth(date, baseDate);
  }

  const previousMonth = addMonths(baseDate, -1);

  return isSameMonth(date, previousMonth) || isSameMonth(date, baseDate);
}

export interface SelectByMonthGridsProps extends MonthlyGridBaseProps {
  isSingleGrid: boolean;
  headingIdPrefix: string;

  onSelectMonth: (date: Date) => void;
  onChangeYear: (date: Date) => void;
}

export const SelectByMonthGrids = ({
  baseDate,
  selectedStartMonth,
  selectedEndMonth,

  focusedMonth,
  onFocusedMonthChange,

  isMonthEnabled,
  monthDisabledReason,
  isSingleGrid,

  onSelectMonth,
  onChangeYear,

  locale,

  currentMonthAriaLabel,
  headingIdPrefix,
}: SelectByMonthGridsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridHasFocus, setGridHasFocus] = useState(false);

  const focusedMonthRef = useRef<HTMLTableCellElement>(null);

  const dateCache = useDateCache();
  baseDate = dateCache(baseDate);
  focusedMonth = focusedMonth ? dateCache(focusedMonth) : null;

  const isMonthFocusable = useCallback(
    (date: Date) => {
      return isMonthEnabled(date) || (!isMonthEnabled(date) && !!monthDisabledReason(date));
    },
    [isMonthEnabled, monthDisabledReason]
  );

  useEffect(() => {
    if (focusedMonth && !isVisible(focusedMonth, baseDate, isSingleGrid)) {
      const direction = isAfter(focusedMonth, baseDate) ? -1 : 1;

      const newMonth = !isSingleGrid && direction === -1 ? addMonths(baseDate, -1) : baseDate;
      const nearestBaseMonth = getBaseDay(newMonth, isMonthFocusable);

      const newFocusedMonth = findMonthToFocus(focusedMonth, nearestBaseMonth, isMonthFocusable);

      onFocusedMonthChange(newFocusedMonth);
    }
  }, [baseDate, focusedMonth, isSingleGrid, isMonthFocusable, onFocusedMonthChange]);

  const onGridKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    let updatedFocusMonth;

    const keys = [KeyCode.up, KeyCode.down, KeyCode.left, KeyCode.right, KeyCode.space, KeyCode.enter];

    if (focusedMonth === null || keys.indexOf(event.keyCode) === -1) {
      return;
    }

    event.preventDefault();

    handleKey(event, {
      onActivate: () => {
        if (!focusedMonth || !isMonthEnabled(focusedMonth)) {
          return;
        }

        onSelectMonth(focusedMonth);
      },
      // onBlockEnd: () => focusedMonth && (updatedFocusMonth = moveNextQuarter(focusedMonth, isMonthFocusable)),
      // onBlockStart: () => focusedMonth && (updatedFocusMonth = movePrevQuarter(focusedMonth, isMonthFocusable)),
      // onInlineEnd: () => focusedMonth && (updatedFocusMonth = moveNextMonth(focusedMonth, isMonthFocusable)),
      // onInlineStart: () => focusedMonth && (updatedFocusMonth = movePrevMonth(focusedMonth, isMonthFocusable)),
    });

    if (!updatedFocusMonth) {
      return;
    }

    const updatedMonthIsVisible = isVisible(updatedFocusMonth, baseDate, isSingleGrid);

    if (!updatedMonthIsVisible) {
      const newYearIsOnLeftSide = !isSingleGrid && isBefore(updatedFocusMonth, baseDate);

      onChangeYear(newYearIsOnLeftSide ? addYears(updatedFocusMonth, 1) : updatedFocusMonth);
    }
    onFocusedMonthChange(updatedFocusMonth);
  };

  useEffect(() => {
    // focus current date if the focus is already inside the calendar
    if (focusedMonth !== null && gridHasFocus) {
      if (focusedMonthRef.current && focusedMonthRef.current !== document.activeElement) {
        focusedMonthRef.current.focus();
      }
    }
  }, [focusedMonth, gridHasFocus]);

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

  const isRangeVisible = (selectedStartMonth && selectedEndMonth) || gridHasFocus;

  const rangeEnds: Date[] = [selectedStartMonth ?? focusedMonth, selectedEndMonth ?? focusedMonth].filter(hasValue);

  const rangeStartMonth = min(rangeEnds);
  const rangeEndMonth = max(rangeEnds);

  return (
    <div ref={containerRef} onFocus={onGridFocus} onBlur={onGridBlur}>
      <InternalSpaceBetween size="xs" direction="horizontal">
        {!isSingleGrid && (
          <MonthlyGrid
            className={styles['first-grid']}
            baseDate={addYears(baseDate, -1)}
            selectedEndMonth={selectedEndMonth}
            selectedStartMonth={selectedStartMonth}
            rangeStartMonth={isRangeVisible ? rangeStartMonth : null}
            rangeEndMonth={isRangeVisible ? rangeEndMonth : null}
            focusedMonth={focusedMonth}
            focusedMonthRef={focusedMonthRef}
            isMonthEnabled={isMonthEnabled}
            monthDisabledReason={monthDisabledReason}
            onSelectMonth={onSelectMonth}
            onGridKeyDownHandler={onGridKeyDownHandler}
            onFocusedMonthChange={onFocusedMonthChange}
            locale={locale}
            currentMonthAriaLabel={currentMonthAriaLabel}
            ariaLabelledby={`${headingIdPrefix}-prevyear`}
          />
        )}
        <MonthlyGrid
          className={styles['second-grid']}
          baseDate={baseDate}
          selectedEndMonth={selectedEndMonth}
          selectedStartMonth={selectedStartMonth}
          rangeStartMonth={isRangeVisible ? rangeStartMonth : null}
          rangeEndMonth={isRangeVisible ? rangeEndMonth : null}
          focusedMonth={focusedMonth}
          focusedMonthRef={focusedMonthRef}
          isMonthEnabled={isMonthEnabled}
          monthDisabledReason={monthDisabledReason}
          onSelectMonth={onSelectMonth}
          onGridKeyDownHandler={onGridKeyDownHandler}
          onFocusedMonthChange={onFocusedMonthChange}
          locale={locale}
          currentMonthAriaLabel={currentMonthAriaLabel}
          ariaLabelledby={`${headingIdPrefix}-currentyear`}
        />
      </InternalSpaceBetween>
    </div>
  );
};
