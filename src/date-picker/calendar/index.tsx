// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { addDays, addMonths, isSameMonth, startOfMonth } from 'date-fns';
import styles from '../styles.css.js';
import { FocusNextElement } from '../../internal/components/tab-trap';
import { BaseComponentProps } from '../../internal/base-component';
import useFocusVisible from '../../internal/hooks/focus-visible/index.js';
import { DatePickerProps } from '../interfaces';
import { CalendarTypes } from './definitions';
import CalendarHeader from './header';
import Grid, { DateChangeHandlerNullable } from './grid';
import moveFocusHandler from './utils/move-focus-handler';
import { useUniqueId } from '../../internal/hooks/use-unique-id/index.js';
import { formatDate, memoizedDate } from './utils/date.js';

export interface DateChangeHandler {
  (detail: CalendarTypes.DateDetail): void;
}

export interface MonthChangeHandler {
  (newMonth: Date): void;
}

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface HeaderChangeMonthHandler {
  (isPreviousButtonClick?: boolean): void;
}

interface CalendarProps extends BaseComponentProps {
  locale: string;
  startOfWeek: DayIndex;
  selectedDate: Date | null;
  displayedDate: Date;
  isDateEnabled: DatePickerProps.IsDateEnabledFunction;
  nextMonthLabel: string;
  previousMonthLabel: string;
  todayAriaLabel: string;

  onChangeMonth: MonthChangeHandler;
  onSelectDate: DateChangeHandler;
}

const Calendar = ({
  locale,
  startOfWeek,
  displayedDate,
  todayAriaLabel,
  selectedDate,
  isDateEnabled,
  onChangeMonth,
  onSelectDate,
  previousMonthLabel,
  nextMonthLabel,
}: CalendarProps) => {
  const focusVisible = useFocusVisible();
  const headerId = useUniqueId('calendar-dialog-title-');
  const elementRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [gridHasFocus, setGridHasFocus] = useState(false);
  const [focusedDate, setFocusedDate] = useState<string | null>(null);
  let focusedDateMemoized: null | Date = memoizedDate('focused', focusedDate);

  const selectFocusedDate = (selected: Date | null, baseDate: Date): Date | null => {
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
  };

  const getBaseDate = (date: Date) => {
    const startDate = startOfMonth(date);
    if (isDateEnabled(startDate)) {
      return startDate;
    }
    return moveFocusHandler(startDate, isDateEnabled, (date: Date) => addDays(date, 1));
  };

  const baseDate: Date = getBaseDate(displayedDate);

  const focusCurrentDate: FocusNextElement = () =>
    (elementRef.current?.querySelector(`.${styles['calendar-day-focusable']}`) as HTMLDivElement)?.focus();

  const onHeaderChangeMonthHandler: HeaderChangeMonthHandler = isPrevious => {
    onChangeMonth(addMonths(baseDate, isPrevious ? -1 : 1));
    setFocusedDate(null);
  };

  const onGridChangeMonthHandler: MonthChangeHandler = newMonth => {
    onChangeMonth(newMonth);
    setFocusedDate(null);
  };

  const onGridFocusDateHandler: DateChangeHandlerNullable = ({ date }) => {
    if (date) {
      const value = formatDate(date);
      setFocusedDate(value);
    }
  };

  const onGridSelectDateHandler: DateChangeHandler = detail => {
    onSelectDate(detail);
    setFocusedDate(null);
  };

  useEffect(() => {
    // focus current date if the focus is already inside the calendar grid
    if (focusedDateMemoized instanceof Date && isSameMonth(focusedDateMemoized, baseDate) && gridHasFocus) {
      focusCurrentDate();
    }
  }, [baseDate, focusedDateMemoized, gridHasFocus]);

  useEffect(() => {
    const calendarHasFocus = elementRef.current?.contains(document.activeElement);

    if (!calendarHasFocus) {
      elementRef.current?.focus();
    }

    // When the baseDate or isDateEnabled changes, there might not be a focusable date in the grid anymore
  }, [baseDate, isDateEnabled]);

  if (!focusedDate) {
    focusedDateMemoized = selectFocusedDate(selectedDate, baseDate);
  }

  const onGridBlur = (event: React.FocusEvent) => {
    const newFocusTargetIsInGrid = event.relatedTarget && gridWrapperRef.current?.contains(event.relatedTarget as Node);
    if (!newFocusTargetIsInGrid) {
      setGridHasFocus(false);
    }
  };

  const onGridFocus = () => {
    if (!gridHasFocus) {
      setGridHasFocus(true);
    }
  };

  return (
    <div
      {...focusVisible}
      className={styles.calendar}
      tabIndex={0}
      role="application"
      aria-describedby={headerId}
      ref={elementRef}
    >
      <div className={styles['calendar-inner']}>
        <CalendarHeader
          headerId={headerId}
          baseDate={baseDate}
          locale={locale}
          onChangeMonth={onHeaderChangeMonthHandler}
          previousMonthLabel={previousMonthLabel}
          nextMonthLabel={nextMonthLabel}
        />
        <div onBlur={onGridBlur} onFocus={onGridFocus} ref={gridWrapperRef}>
          <Grid
            locale={locale}
            baseDate={baseDate}
            isDateEnabled={isDateEnabled}
            focusedDate={focusedDateMemoized}
            onSelectDate={onGridSelectDateHandler}
            onFocusDate={onGridFocusDateHandler}
            onChangeMonth={onGridChangeMonthHandler}
            startOfWeek={startOfWeek}
            todayAriaLabel={todayAriaLabel}
            selectedDate={selectedDate}
            handleFocusMove={moveFocusHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
