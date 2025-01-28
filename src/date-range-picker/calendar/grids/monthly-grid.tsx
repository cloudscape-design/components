// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { isAfter, isBefore, isLastDayOfMonth, isSameDay, isSameMonth, isToday } from 'date-fns';

// import { 
  // getDateLabel, 
  // renderDayName 
// } from '../../../calendar/utils/intl';
import ScreenreaderOnly from '../../../internal/components/screenreader-only/index.js';
import { formatDate } from '../../../internal/utils/date-time';
import { MonthCalendar } from '../../../internal/utils/date-time/calendar';
// import { DateRangePickerProps, DayIndex } from '../../interfaces';
import { GridCell } from './grid-cell';


import { getCalendarMonth } from 'mnth';

import useCalendarGridRows from '../../../calendar/grid/use-calendar-grid-rows';
import { useInternalI18n } from '../../../i18n/context';

import { normalizeLocale } from '../../../internal/utils/locale';
import { MonthGridProps } from './interfaces';
import { renderDateAnnouncement, renderDayName } from './intl';

import testutilStyles from '../../test-classes/styles.css.js';
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
  todayAriaLabel,
  ariaLabelledby,
  className,
  startOfWeek = 0,
}: MonthGridProps) {

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
  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(new Date(baseDateTime), { firstDayOfWeek: startOfWeek }),
    [baseDateTime, startOfWeek]
  );
  const i18n = useInternalI18n('date-range-picker');
  // const weekdays = weeks[0].map(date => date.getDay());
  //todo confirm not needed normalized locale
  // const normalizedLocale = normalizeLocale('DateRangePicker', locale ?? null);
  // const rows = useCalendarGridRows({ baseDate, granularity: 'month', locale: normalizedLocale, startOfWeek });
  const currentAnnouncement = i18n('i18nStrings.todayAriaLabel', todayAriaLabel);

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      <thead>
        <tr>
          {calendar.weekdays.map(dayIndex => (
            <th key={dayIndex} scope="col" className={clsx(styles['grid-cell'], testutilStyles['day-header'])}>
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
              className={clsx(testutilStyles.week, isWeekBelongsToMonth && testutilStyles['calendar-week'])}
              data-awsui-weekindex={testIndex}
            >
              {days.map(
                (
                  { date, isVisible, isInRange, isSelectionTop, isSelectionBottom, isSelectionLeft, isSelectionRight },
                  dateIndex
                ) => {
                  const dayNum = date.getDate();
                  const dayKey = `${weekIndex}:${dateIndex}`;
                  const isCurrentDay = isToday(date);
                  const isStartDate = !!selectedStartDate && isSameDay(date, selectedStartDate);
                  const isEndDate = !!selectedEndDate && isSameDay(date, selectedEndDate);
                  const isSelected = isStartDate || isEndDate;

                  //todo  confirm not - && isSameMonth(date, baseDate); needed
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

                  // const isRangeStartDate = !!rangeStartDate && isSameDay(date, rangeStartDate);
                  // const isRangeEndDate = !!rangeEndDate && isSameDay(date, rangeEndDate);
                  // const dateIsInRange = isStartDate || isEndDate || isDateItemInRange(date, rangeStartDate, rangeEndDate);
                  //   const inRangeStartRow =
                  //   rangeStartDate && isDateItemInRange(date, rangeStartDate, addDays(addWeeks(rangeStartDate, 1), -1));
                  // const inRangeEndRow =
                  //   rangeEndDate && isDateItemInRange(date, rangeEndDate, addDays(addWeeks(rangeEndDate, -1), 1));

                  const baseClasses = {
                    [testutilStyles.day]: true,
                    [testutilStyles['calendar-date']]: isDateBelongsToMonth,
                    [styles['grid-cell']]: true,
                    [styles['in-first-row']]: weekIndex === 0,
                    [styles['in-first-column']]: dateIndex === 0,
                  };

                  if (!isVisible) {
                    return (
                      <td
                        key={dayKey}
                        ref={isFocused ? focusedDateRef : undefined}
                        className={clsx(baseClasses, {
                          [styles['in-previous-month']]: isBefore(date, baseDate),
                          [styles['last-day-of-month']]: isLastDayOfMonth(date),
                          [styles['in-next-month']]: isAfter(date, baseDate),
                        })}
                      />
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

                // if (isEnabled || isDisabledWithReason) {
                //   tabIndex = isFocusable
                //     ? 0 // Next focus target.
                //     : -1; // Can be focused programmatically.
                // }

                  // Screen-reader announcement for the focused day.
                  // let dayAnnouncement = getDateLabel(locale, date, 'short');
                  // if (isToday(date)) {
                  //   dayAnnouncement += '. ' + todayAriaLabel;
                  // }

                // Screen-reader announcement for the focused day/month.
                let announcement = renderDateAnnouncement({
                  date,
                  isCurrent: isCurrentDay,
                  locale,
                  granularity: 'day',
                });

                if (currentAnnouncement) {
                  if (isCurrentDay) {
                    announcement += `. ${currentAnnouncement}`;
                  }
                }

                  return (
                    <GridCell
                      ref={isFocused ? focusedDateRef : undefined}
                      key={dayKey}
                      className={clsx(baseClasses, {
                        [styles['in-visible-calendar']]: true,
                        [styles[`in-current-month`]]: isSameMonth(date, baseDate),
                        [styles.enabled]: isEnabled,
                        [styles.selected]: isSelected,
                        [styles['start-date']]: isStartDate,
                        [styles['end-date']]: isEndDate,
                        [testutilStyles['start-date']]: isStartDate,
                        [testutilStyles['end-date']]: isEndDate,
                        // [styles['range-start-date']]: isRangeStartDate,
                        // [styles['range-end-date']]: isRangeEndDate,
                        [styles['no-range']]: isSelected && onlyOneSelected,
                        [styles['in-range']]: isInRange,
                        [styles['in-range-border-block-start']]: isSelectionTop,
                        [styles['in-range-border-block-end']]: isSelectionBottom,
                        [styles['in-range-border-inline-start']]: isSelectionLeft,
                        [styles['in-range-border-inline-end']]: isSelectionRight,
                        // [styles['in-range-border-block-start']]: !!inRangeStartRow || dayNum <= 7,
                        // [styles['in-range-border-block-end']]: !!inRangeEndRow || dayNum > getDaysInMonth(date) - 7,
                        // [styles['in-range-border-inline-start']]: dateIndex === 0 || isRangeStartDate || dayNum === 1,
                        // [styles['in-range-border-inline-end']]:
                        //   dateIndex === row.length - 1 || isRangeEndDate || isLastDayOfMonth(date),
                        [styles.today]: isCurrentDay,
                        [testutilStyles.today]: isCurrentDay,
                      })}
                      aria-selected={isEnabled ? isSelected || isInRange : undefined}
                      // aria-selected={isEnabled ? isSelected || dateIsInRange : undefined}
                      aria-current={isCurrentDay ? 'date' : undefined}
                      data-date={formatDate(date, 'day')}
                      aria-disabled={!isEnabled}
                      tabIndex={tabIndex}
                      disabledReason={isDisabledWithReason ? disabledReason : undefined}
                      {...handlers}
                    >
                      <span className={styles['day-inner']} aria-hidden="true">
                        {dayNum}
                      </span>
                      <ScreenreaderOnly>{announcement}</ScreenreaderOnly>
                    </GridCell>
                  );
                })}
              </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function isDateItemInRange(date: Date, dateOne: Date | null, dateTwo: Date | null): boolean {
  if (!dateOne || !dateTwo || isSameDay(dateOne, dateTwo)) {
    return false;
  }

  const inRange =
    (isAfter(date, dateOne) && isBefore(date, dateTwo)) || (isAfter(date, dateTwo) && isBefore(date, dateOne));

  return inRange || isSameDay(date, dateOne) || isSameDay(date, dateTwo);
}
