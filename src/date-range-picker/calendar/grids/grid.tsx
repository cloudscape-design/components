// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import styles from '../../styles.css.js';
import GridDay from './day';
import { isSameMonth, isAfter, isBefore, isSameDay, addWeeks, addDays } from 'date-fns';
import { getCalendarMonth } from 'mnth';
import { DateChangeHandler, DayIndex } from '../index';
import { DateRangePickerProps } from '../../interfaces';
import rotateDayIndexes from '../../../calendar/utils/rotate-day-indexes';
import { renderDayName } from '../../../calendar/utils/intl';
import clsx from 'clsx';

export interface GridProps {
  baseDate: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;

  rangeStartDate: Date | null;
  rangeEndDate: Date | null;

  focusedDate: Date | null;
  focusedDateRef: React.RefObject<HTMLDivElement>;

  onSelectDate: DateChangeHandler;
  onGridKeyDownHandler: (e: React.KeyboardEvent) => void;
  onFocusedDateChange: React.Dispatch<React.SetStateAction<Date | null>>;

  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction;

  locale: string;
  startOfWeek: DayIndex;
  todayAriaLabel: string;

  className?: string;
}

export function Grid({
  baseDate,
  selectedStartDate,
  selectedEndDate,
  rangeStartDate,
  rangeEndDate,
  focusedDate,

  focusedDateRef,

  onSelectDate,
  onGridKeyDownHandler,
  onFocusedDateChange,

  isDateEnabled,

  locale,
  startOfWeek,
  todayAriaLabel,

  className,
}: GridProps) {
  const baseDateTime = baseDate?.getTime();
  // `baseDateTime` is used as a more stable replacement for baseDate
  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: startOfWeek }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseDateTime, startOfWeek]
  );

  return (
    <div className={clsx(styles.grid, className)}>
      <div className={styles['calendar-day-names']}>
        {rotateDayIndexes(startOfWeek).map(dayIndex => (
          <div key={dayIndex} className={styles['calendar-day-name']}>
            {renderDayName(locale, dayIndex, 'short')}
          </div>
        ))}
      </div>
      <div className={styles['calendar-dates']} onKeyDown={onGridKeyDownHandler}>
        {weeks.map((week, weekIndex) => {
          return (
            <div key={weekIndex} className={styles['calendar-week']}>
              {week.map((date, dateIndex) => {
                const isStartDate = !!selectedStartDate && isSameDay(date, selectedStartDate);
                const isEndDate = !!selectedEndDate && isSameDay(date, selectedEndDate);
                const isSelected = isStartDate || isEndDate;
                const isRangeStartDate = !!rangeStartDate && isSameDay(date, rangeStartDate);
                const isRangeEndDate = !!rangeEndDate && isSameDay(date, rangeEndDate);

                const isFocused = !!focusedDate && isSameDay(date, focusedDate) && isSameMonth(date, baseDate);

                const dateIsInRange = isStartDate || isEndDate || isInRange(date, rangeStartDate, rangeEndDate);
                const inRangeStartWeek =
                  rangeStartDate && isInRange(date, rangeStartDate, addDays(addWeeks(rangeStartDate, 1), -1));
                const inRangeEndWeek =
                  rangeEndDate && isInRange(date, rangeEndDate, addDays(addWeeks(rangeEndDate, -1), 1));
                const onlyOneSelected =
                  !!rangeStartDate && !!rangeEndDate
                    ? isSameDay(rangeStartDate, rangeEndDate)
                    : !selectedStartDate || !selectedEndDate;

                return (
                  <GridDay
                    key={`${weekIndex}:${dateIndex}`}
                    locale={locale}
                    date={date}
                    baseDate={baseDate}
                    isSelected={isSelected}
                    isStartDate={isStartDate}
                    isEndDate={isEndDate}
                    onlyOneSelected={onlyOneSelected}
                    isRangeStartDate={isRangeStartDate}
                    isRangeEndDate={isRangeEndDate}
                    isFocusedDate={isFocused}
                    focusedDateRef={focusedDateRef}
                    todayAriaLabel={todayAriaLabel}
                    onSelectDate={onSelectDate}
                    onFocusDate={onFocusedDateChange}
                    isInRange={dateIsInRange}
                    isDateEnabled={isDateEnabled}
                    isDateInFirstRow={weekIndex === 0}
                    isDateInFirstColumn={dateIndex === 0}
                    isDateInLastColumn={dateIndex === week.length - 1}
                    isDateInSelectionStartWeek={!!inRangeStartWeek}
                    isDateInSelectionEndWeek={!!inRangeEndWeek}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isInRange(date: Date, dateOne: Date | null, dateTwo: Date | null) {
  if (!dateOne || !dateTwo || isSameDay(dateOne, dateTwo)) {
    return false;
  }

  const inRange =
    (isAfter(date, dateOne) && isBefore(date, dateTwo)) || (isAfter(date, dateTwo) && isBefore(date, dateOne));

  return inRange || isSameDay(date, dateOne) || isSameDay(date, dateTwo);
}
