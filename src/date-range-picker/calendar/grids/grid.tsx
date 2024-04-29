// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import styles from './styles.css.js';
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
import { DateRangePickerProps, DayIndex } from '../../interfaces';
import { getDateLabel, renderDayName } from '../../../calendar/utils/intl';
import clsx from 'clsx';
import { formatDate } from '../../../internal/utils/date-time';
import ScreenreaderOnly from '../../../internal/components/screenreader-only/index.js';

/**
 * Calendar grid supports two mechanisms of keyboard navigation:
 * - Native screen-reader table navigation (semantic table markup);
 * - Keyboard arrow-keys navigation (a custom key-down handler).
 *
 * The implementation largely follows the w3 example (https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog) and shares the following issues:
 * - (table navigation) Chrome+VO - weekday is announced twice when navigating to the calendar's header;
 * - (table navigation) Safari+VO - "dimmed" state is announced twice;
 * - (table navigation) Firefox/Chrome+NVDA - cannot use table navigation if any cell has a focus;
 * - (keyboard navigation) Firefox+NVDA - every day is announced as "not selected";
 * - (keyboard navigation) Safari/Chrome+VO - weekdays are not announced;
 * - (keyboard navigation) Safari/Chrome+VO - days are not announced as interactive (clickable or selectable);
 * - (keyboard navigation) Safari/Chrome+VO - day announcements are not interruptive and can be missed if navigating fast.
 */

export interface GridProps {
  baseDate: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;

  rangeStartDate: Date | null;
  rangeEndDate: Date | null;

  focusedDate: Date | null;
  focusedDateRef: React.RefObject<HTMLTableCellElement>;

  onSelectDate: (date: Date) => void;
  onGridKeyDownHandler: (e: React.KeyboardEvent<HTMLElement>) => void;
  onFocusedDateChange: React.Dispatch<React.SetStateAction<Date | null>>;

  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction;

  locale: string;
  startOfWeek: DayIndex;
  todayAriaLabel?: string;
  ariaLabelledby: string;

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
  ariaLabelledby,

  className,
}: GridProps) {
  const baseDateTime = baseDate?.getTime();
  // `baseDateTime` is used as a more stable replacement for baseDate
  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: startOfWeek }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseDateTime, startOfWeek]
  );
  const weekdays = weeks[0].map(date => date.getDay());

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      <thead>
        <tr>
          {weekdays.map(dayIndex => (
            <th key={dayIndex} scope="col" className={clsx(styles['grid-cell'], styles['day-header'])}>
              <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
              <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
            </th>
          ))}
        </tr>
      </thead>
      <tbody onKeyDown={onGridKeyDownHandler}>
        {weeks.map((week, weekIndex) => {
          return (
            <tr key={weekIndex} className={styles.week}>
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

                const baseClasses = {
                  [styles.day]: true,
                  [styles['grid-cell']]: true,
                  [styles['in-first-row']]: weekIndex === 0,
                  [styles['in-first-column']]: dateIndex === 0,
                };

                if (!isSameMonth(date, baseDate)) {
                  return (
                    <td
                      key={`${weekIndex}:${dateIndex}`}
                      ref={isFocused ? focusedDateRef : undefined}
                      className={clsx(baseClasses, {
                        [styles['in-previous-month']]: isBefore(date, baseDate),
                        [styles['last-day-of-month']]: isLastDayOfMonth(date),
                        [styles['in-next-month']]: isAfter(date, baseDate),
                      })}
                    ></td>
                  );
                }

                const handlers: React.HTMLAttributes<HTMLDivElement> = {};
                if (isEnabled) {
                  handlers.onClick = () => onSelectDate(date);
                  handlers.onFocus = () => onFocusedDateChange(date);
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
                let dayAnnouncement = getDateLabel(locale, date, 'short');
                if (isToday(date)) {
                  dayAnnouncement += '. ' + todayAriaLabel;
                }

                return (
                  <td
                    ref={isFocused ? focusedDateRef : undefined}
                    key={`${weekIndex}:${dateIndex}`}
                    className={clsx(baseClasses, {
                      [styles['in-current-month']]: isSameMonth(date, baseDate),
                      [styles.enabled]: isEnabled,
                      [styles.selected]: isSelected,
                      [styles['start-date']]: isStartDate,
                      [styles['end-date']]: isEndDate,
                      [styles['range-start-date']]: isRangeStartDate,
                      [styles['range-end-date']]: isRangeEndDate,
                      [styles['no-range']]: isSelected && onlyOneSelected,
                      [styles['in-range']]: dateIsInRange,
                      [styles['in-range-border-block-start']]: !!inRangeStartWeek || date.getDate() <= 7,
                      [styles['in-range-border-block-end']]:
                        !!inRangeEndWeek || date.getDate() > getDaysInMonth(date) - 7,
                      [styles['in-range-border-inline-start']]:
                        dateIndex === 0 || date.getDate() === 1 || isRangeStartDate,
                      [styles['in-range-border-inline-end']]:
                        dateIndex === week.length - 1 || isLastDayOfMonth(date) || isRangeEndDate,
                      [styles.today]: isToday(date),
                    })}
                    aria-selected={isEnabled ? isSelected || dateIsInRange : undefined}
                    aria-current={isToday(date) ? 'date' : undefined}
                    data-date={formatDate(date)}
                    aria-disabled={!isEnabled}
                    tabIndex={tabIndex}
                    {...handlers}
                  >
                    <span className={styles['day-inner']} aria-hidden="true">
                      {date.getDate()}
                    </span>
                    <ScreenreaderOnly>{dayAnnouncement}</ScreenreaderOnly>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
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
