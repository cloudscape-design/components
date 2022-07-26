

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { addDays, addMonths, isSameMonth, startOfMonth } from 'date-fns';
import styles from '../styles.css.js';
import { BaseComponentProps } from '../../internal/base-component';
import useFocusVisible from '../../internal/hooks/focus-visible/index.js';
import { DatePickerProps } from '../interfaces';
import { CalendarTypes } from './definitions';
import CalendarHeader from './header';
import Grid from './grid';
import moveFocusHandler from './utils/move-focus-handler';
import { useUniqueId } from '../../internal/hooks/use-unique-id/index.js';
import { formatDate, memoizedDate } from './utils/date.js';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update.js';

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
  startOfWeek: number | undefined;
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
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

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
  const focusedOrSelectedDate = focusedDate || selectFocusedDate(selectedDate, baseDate);

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
      const value = memoizedDate('focused', formatDate(date));
      setFocusedDate(value);
    }
  };

  const onGridSelectDateHandler: DateChangeHandler = detail => {
    onSelectDate(detail);
    setFocusedDate(null);
  };

  // The focused date changes as a feedback to keyboard navigation in the grid.
  // Once changed, the corresponding day button needs to receive the actual focus.
  useEffectOnUpdate(() => {
    if (focusedDate) {
      (elementRef.current?.querySelector(`.${styles['calendar-day-focusable']}`) as HTMLDivElement)?.focus();
    }
  }, [focusedDate]);

  const onGridBlur = (event: React.FocusEvent) => {
    const newFocusTargetIsInGrid = event.relatedTarget && gridWrapperRef.current?.contains(event.relatedTarget as Node);
    if (!newFocusTargetIsInGrid) {
      setFocusedDate(null);
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
        <div onBlur={onGridBlur} ref={gridWrapperRef}>
          <Grid
            locale={locale}
            baseDate={baseDate}
            isDateEnabled={isDateEnabled}
            focusedDate={focusedOrSelectedDate}
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

export default Calendar;ƒ