// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import styles from '../../styles.css.js';
import dayStyles from './styles.css.js';
import {
  isSameMonth,
  isAfter,
  isBefore,
  isSameDay,
  addWeeks,
  addDays,
  isLastDayOfMonth,
  getDaysInMonth,
  isToday,
} from 'date-fns';
import { getCalendarMonth } from 'mnth';
import { DateChangeHandler, DayIndex } from '../index';
import { DateRangePickerProps } from '../../interfaces';
import rotateDayIndexes from '../../../calendar/utils/rotate-day-indexes';
import { getDateLabel, renderDayName } from '../../../calendar/utils/intl';
import clsx from 'clsx';
import { formatDate } from '../../../internal/utils/date-time';
import useFocusVisible from '../../../internal/hooks/focus-visible/index.js';

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

  const focusVisible = useFocusVisible();

  return (
    <div className={clsx(styles.grid, className)}>
      <div className={styles['calendar-day-names']}>
        {rotateDayIndexes(startOfWeek).map(dayIndex => (
          <div key={dayIndex} className={styles['calendar-day-name']}>
            {renderDayName(locale, dayIndex)}
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

                const isEnabled = !isDateEnabled || isDateEnabled(date);
                const isFocusable = isFocused && isEnabled;
                const computedAttributes: React.HTMLAttributes<HTMLDivElement> = {};

                const baseClasses = {
                  [dayStyles.day]: true,
                  [dayStyles['in-first-row']]: weekIndex === 0,
                  [dayStyles['in-first-column']]: dateIndex === 0,
                };

                if (!isSameMonth(date, baseDate)) {
                  return (
                    <div
                      key={`${weekIndex}:${dateIndex}`}
                      className={clsx(baseClasses, {
                        [dayStyles['in-previous-month']]: isBefore(date, baseDate),
                        [dayStyles['last-day-of-month']]: isLastDayOfMonth(date),
                        [dayStyles['in-next-month']]: isAfter(date, baseDate),
                      })}
                      ref={isFocused ? focusedDateRef : undefined}
                    ></div>
                  );
                }

                if (isEnabled) {
                  computedAttributes.onClick = () => onSelectDate(date);
                  computedAttributes.onFocus = () => onFocusedDateChange(date);
                }

                // Can't be focused.
                let tabIndex = undefined;
                if (isFocusable && isEnabled) {
                  // Next focus target.
                  tabIndex = 0;
                } else if (isEnabled) {
                  // Can be focused programmatically.
                  tabIndex = -1;
                }

                // Screen-reader announcement for the focused day.
                let dayAnnouncement = getDateLabel(locale, date);
                if (isToday(date)) {
                  dayAnnouncement += '. ' + todayAriaLabel;
                }

                return (
                  <div
                    key={`${weekIndex}:${dateIndex}`}
                    className={clsx(baseClasses, {
                      [dayStyles['in-current-month']]: isSameMonth(date, baseDate),
                      [dayStyles.enabled]: isEnabled,
                      [dayStyles.selected]: isSelected,
                      [dayStyles['start-date']]: isStartDate,
                      [dayStyles['end-date']]: isEndDate,
                      [dayStyles['range-start-date']]: isRangeStartDate,
                      [dayStyles['range-end-date']]: isRangeEndDate,
                      [dayStyles['no-range']]: isSelected && onlyOneSelected,
                      [dayStyles['in-range']]: dateIsInRange,
                      [dayStyles['in-range-border-top']]: !!inRangeStartWeek || date.getDate() <= 7,
                      [dayStyles['in-range-border-bottom']]:
                        !!inRangeEndWeek || date.getDate() > getDaysInMonth(date) - 7,
                      [dayStyles['in-range-border-left']]: dateIndex === 0 || date.getDate() === 1 || isRangeStartDate,
                      [dayStyles['in-range-border-right']]:
                        dateIndex === week.length - 1 || isLastDayOfMonth(date) || isRangeEndDate,
                      [dayStyles.today]: isToday(date),
                    })}
                    aria-label={dayAnnouncement}
                    aria-pressed={isSelected || dateIsInRange}
                    aria-current={isToday(date) ? 'date' : undefined}
                    data-date={formatDate(date)}
                    role="button"
                    tabIndex={tabIndex}
                    {...computedAttributes}
                    ref={isFocused ? focusedDateRef : undefined}
                    {...focusVisible}
                  >
                    <span className={dayStyles['day-inner']}>{date.getDate()}</span>
                  </div>
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
