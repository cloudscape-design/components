// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { addDays, addMonths, getDaysInMonth, isSameMonth, startOfMonth } from 'date-fns';
import styles from './styles.css.js';
import CalendarHeader from './header';
import Grid from './grid';
import moveFocusHandler from './utils/move-focus-handler';
import { memoizedDate } from './utils/memoized-date.js';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update.js';
import { normalizeLocale, normalizeStartOfWeek } from './utils/locales.js';
import { formatDate } from '../internal/utils/date-time';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import checkControlled from '../internal/hooks/check-controlled/index.js';
import clsx from 'clsx';
import { CalendarProps } from './interfaces.js';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function Calendar({
  value,
  locale = '',
  startOfWeek,
  isDateEnabled = () => true,
  todayAriaLabel,
  nextMonthAriaLabel,
  previousMonthAriaLabel,
  onChange,
  __internalRootRef,
  ...rest
}: CalendarProps & InternalBaseComponentProps) {
  checkControlled('Calendar', 'value', value, 'onChange', onChange);

  const baseProps = getBaseProps(rest);
  const normalizedLocale = normalizeLocale('Calendar', locale);
  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, normalizedLocale);
  const elementRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const ref = useMergeRefs(elementRef, __internalRootRef);

  // Set displayed date to value if defined or to current date otherwise.
  const memoizedValue = memoizedDate('value', value);
  const defaultDisplayedDate = memoizedValue ?? new Date();
  const [displayedDate, setDisplayedDate] = useState(defaultDisplayedDate);

  // Update displayed date if value changes.
  useEffect(() => {
    memoizedValue && setDisplayedDate(prev => (prev.getTime() !== memoizedValue.getTime() ? memoizedValue : prev));
  }, [memoizedValue]);

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

  // Get the first enabled date of the month. If no day is enabled in the given month, return the first day of the month.
  // This is needed because `baseDate` is used as the first focusable date, for example when navigating to the calendar area.
  const getBaseDate = (date: Date) => {
    const startDate = startOfMonth(date);
    for (let i = 0; i < getDaysInMonth(date); i++) {
      const currentDate = addDays(startDate, i);
      if (isDateEnabled(currentDate)) {
        return currentDate;
      }
    }
    return startDate;
  };

  const baseDate: Date = getBaseDate(displayedDate);
  const focusedOrSelectedDate = focusedDate || selectFocusedDate(memoizedValue, baseDate);

  const onHeaderChangeMonthHandler = (isPreviousButtonClick?: boolean) => {
    setDisplayedDate(addMonths(baseDate, isPreviousButtonClick ? -1 : 1));
    setFocusedDate(null);
  };

  const onGridChangeMonthHandler = (newMonth: Date) => {
    setDisplayedDate(newMonth);
    setFocusedDate(null);
  };

  const onGridFocusDateHandler = (date: null | Date) => {
    if (date) {
      const value = memoizedDate('focused', formatDate(date));
      setFocusedDate(value);
    }
  };

  const onGridSelectDateHandler = (date: Date) => {
    fireNonCancelableEvent(onChange, { value: formatDate(date) });
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
      ref={ref}
      role="application"
      {...baseProps}
      className={clsx(styles.root, styles.calendar, baseProps.className)}
    >
      <div className={styles['calendar-inner']}>
        <CalendarHeader
          baseDate={baseDate}
          locale={normalizedLocale}
          onChangeMonth={onHeaderChangeMonthHandler}
          previousMonthLabel={previousMonthAriaLabel}
          nextMonthLabel={nextMonthAriaLabel}
        />
        <div onBlur={onGridBlur} ref={gridWrapperRef}>
          <Grid
            locale={normalizedLocale}
            baseDate={baseDate}
            isDateEnabled={isDateEnabled}
            focusedDate={focusedOrSelectedDate}
            onSelectDate={onGridSelectDateHandler}
            onFocusDate={onGridFocusDateHandler}
            onChangeMonth={onGridChangeMonthHandler}
            startOfWeek={normalizedStartOfWeek}
            todayAriaLabel={todayAriaLabel}
            selectedDate={memoizedValue}
            handleFocusMove={moveFocusHandler}
          />
        </div>
      </div>
    </div>
  );
}
