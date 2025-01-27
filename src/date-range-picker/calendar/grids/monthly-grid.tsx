// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { isAfter, isBefore, isLastDayOfMonth, isSameDay, isSameMonth, isToday } from 'date-fns';

import { getDateLabel, renderDayName } from '../../../calendar/utils/intl';
import ScreenreaderOnly from '../../../internal/components/screenreader-only/index.js';
import { formatDate } from '../../../internal/utils/date-time';
import { MonthCalendar } from '../../../internal/utils/date-time/calendar';
import { DateRangePickerProps, DayIndex } from '../../interfaces';
import { GridCell } from './grid-cell';

import testStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

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

interface GridProps {
  padDates: 'before' | 'after';
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
  dateDisabledReason: DateRangePickerProps.DateDisabledReasonFunction;

  locale: string;
  startOfWeek: DayIndex;
  todayAriaLabel?: string;
  ariaLabelledby: string;

  className?: string;
}

export function MonthlyGrid({
  padDates,
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
  dateDisabledReason,

  locale,
  startOfWeek,
  todayAriaLabel,
  ariaLabelledby,

  className,
}: GridProps) {
  // `baseDateTime` is used as a more stable replacement for baseDate
  const baseDateTime = baseDate?.getTime();
  const calendar = useMemo(
    () => {
      const startDate = rangeStartDate ?? rangeEndDate;
      const endDate = rangeEndDate ?? rangeStartDate;
      const selection = startDate && endDate ? ([startDate, endDate] as [Date, Date]) : null;
      return new MonthCalendar({ padDates, startOfWeek, baseDate, selection });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [padDates, startOfWeek, baseDateTime, rangeStartDate, rangeEndDate]
  );
  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      <thead>
        <tr>
          {calendar.weekdays.map(dayIndex => (
            <th key={dayIndex} scope="col" className={clsx(styles['grid-cell'], styles['day-header'])}>
              <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
              <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
            </th>
          ))}
        </tr>
      </thead>
      <tbody onKeyDown={onGridKeyDownHandler}>
        {calendar.weeks.map(({ days, testIndex }, weekIndex) => {
          const isWeekBelongsToMonth = days.some(({ date }) => isSameMonth(date, baseDate));
          return (
            <tr
              key={weekIndex}
              className={clsx(styles.week, isWeekBelongsToMonth && testStyles['calendar-week'])}
              data-awsui-weekindex={testIndex}
            >
              {days.map(
                (
                  { date, isVisible, isInRange, isSelectionTop, isSelectionBottom, isSelectionLeft, isSelectionRight },
                  dateIndex
                ) => {
                  const isStartDate = !!selectedStartDate && isSameDay(date, selectedStartDate);
                  const isEndDate = !!selectedEndDate && isSameDay(date, selectedEndDate);
                  const isSelected = isStartDate || isEndDate;
                  const isFocused = !!focusedDate && isSameDay(date, focusedDate);
                  const onlyOneSelected =
                    !!rangeStartDate && !!rangeEndDate
                      ? isSameDay(rangeStartDate, rangeEndDate)
                      : !selectedStartDate || !selectedEndDate;

                  const isDateBelongsToMonth = isSameMonth(date, baseDate);
                  const isEnabled = (!isDateEnabled || isDateEnabled(date)) && isDateBelongsToMonth;
                  const disabledReason = dateDisabledReason(date);
                  const isDisabledWithReason = !isEnabled && !!disabledReason;
                  const isFocusable = isFocused && (isEnabled || isDisabledWithReason);

                  const baseClasses = {
                    [styles.day]: true,
                    [testStyles['calendar-date']]: isDateBelongsToMonth,
                    [styles['grid-cell']]: true,
                    [styles['in-first-row']]: weekIndex === 0,
                    [styles['in-first-column']]: dateIndex === 0,
                  };

                  if (!isVisible) {
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
                  if (isFocusable && (isEnabled || isDisabledWithReason)) {
                    // Next focus target.
                    tabIndex = 0;
                  } else if (isEnabled || isDisabledWithReason) {
                    // Can be focused programmatically.
                    tabIndex = -1;
                  }

                  // Screen-reader announcement for the focused day.
                  let dayAnnouncement = getDateLabel(locale, date, 'short');
                  if (isToday(date)) {
                    dayAnnouncement += '. ' + todayAriaLabel;
                  }

                  return (
                    <GridCell
                      ref={isFocused ? focusedDateRef : undefined}
                      key={`${weekIndex}:${dateIndex}`}
                      className={clsx(baseClasses, {
                        [styles['in-visible-calendar']]: true,
                        [styles.enabled]: isEnabled,
                        [styles.selected]: isSelected,
                        [styles['start-date']]: isStartDate,
                        [styles['end-date']]: isEndDate,
                        [styles['no-range']]: isSelected && onlyOneSelected,
                        [styles['in-range']]: isInRange,
                        [styles['in-range-border-block-start']]: isSelectionTop,
                        [styles['in-range-border-block-end']]: isSelectionBottom,
                        [styles['in-range-border-inline-start']]: isSelectionLeft,
                        [styles['in-range-border-inline-end']]: isSelectionRight,
                        [styles.today]: isToday(date),
                      })}
                      aria-selected={isEnabled ? isSelected || isInRange : undefined}
                      aria-current={isToday(date) ? 'date' : undefined}
                      data-date={formatDate(date)}
                      aria-disabled={!isEnabled}
                      tabIndex={tabIndex}
                      disabledReason={isDisabledWithReason ? disabledReason : undefined}
                      {...handlers}
                    >
                      <span className={styles['day-inner']} aria-hidden="true">
                        {date.getDate()}
                      </span>
                      <ScreenreaderOnly>{dayAnnouncement}</ScreenreaderOnly>
                    </GridCell>
                  );
                }
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
