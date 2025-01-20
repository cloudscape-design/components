// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';
import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  getDaysInMonth,
  isAfter,
  isBefore,
  isLastDayOfMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  isThisMonth,
  isToday,
} from 'date-fns';
import { getCalendarMonth } from 'mnth';

import useCalendarGridRows from '../../../calendar/grid/use-calendar-grid-rows';
import { useInternalI18n } from '../../../i18n/context';
import ScreenreaderOnly from '../../../internal/components/screenreader-only';
import { formatDate } from '../../../internal/utils/date-time';
import { normalizeLocale } from '../../../internal/utils/locale';
import { DateRangePickerProps } from '../../interfaces';
import { GridCell } from './grid-cell';
import { GridProps } from './interfaces';
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
  dateDisabledReason,

  locale,
  todayAriaLabel,
  currentMonthAriaLabel,
  ariaLabelledby,
  className,
  startOfWeek = 0,
  granularity = 'day',
}: GridProps) {
  const baseDateTime = baseDate?.getTime();
  // `baseDateTime` is used as a more stable replacement for baseDate
  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: startOfWeek }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseDateTime, startOfWeek]
  );
  const i18n = useInternalI18n('date-range-picker');
  const isMonthPicker = granularity === 'month';
  const weekdays = weeks[0].map(date => date.getDay());
  const normalizedLocale = normalizeLocale('DateRangePicker', locale ?? null);
  const quarters = useCalendarGridRows({ baseDate, granularity: 'month', locale: normalizedLocale, startOfWeek });
  const rows = isMonthPicker ? quarters : weeks;

  const currentAnnouncement = i18n(
    granularity === 'day' ? 'i18nStrings.todayAriaLabel' : 'i18nStrings.currentMonthAriaLabel',
    granularity === 'day' ? todayAriaLabel : currentMonthAriaLabel
  );

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      {!isMonthPicker && (
        <thead>
          <tr>
            {weekdays.map(dayIndex => (
              <th key={dayIndex} scope="col" className={clsx(styles['grid-cell'], testutilStyles['day-header'])}>
                <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
                <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody onKeyDown={onGridKeyDownHandler}>
        {rows.map((row, rowIndex) => {
          return (
            <tr key={rowIndex} className={isMonthPicker ? testutilStyles.quarter : testutilStyles.week}>
              {row.map((date, rowItemIndex) => {
                const itemKey = isMonthPicker
                  ? `Month ${rowIndex * 3 + rowItemIndex + 1}`
                  : `${rowIndex}:${rowItemIndex}`;
                const isSameItem = isMonthPicker ? isSameMonth : isSameDay;
                const isSamePage = isMonthPicker ? isSameYear : isSameMonth;
                const addItems = isMonthPicker ? addMonths : addDays;
                const addRows = isMonthPicker ? addQuarters : addWeeks;
                const pageName = isMonthPicker ? 'year' : 'month';
                const isStartDate = !!selectedStartDate && isSameItem(date, selectedStartDate);
                const isEndDate = !!selectedEndDate && isSameItem(date, selectedEndDate);
                const isSelected = isStartDate || isEndDate;
                const isRangeStartDate = !!rangeStartDate && isSameItem(date, rangeStartDate);
                const isRangeEndDate = !!rangeEndDate && isSameItem(date, rangeEndDate);

                const isFocused = !!focusedDate && isSameItem(date, focusedDate) && isSamePage(date, baseDate);

                const dateIsInRange =
                  isStartDate || isEndDate || isDateItemInRange(granularity, date, rangeStartDate, rangeEndDate);

                const inRangeStartRow =
                  rangeStartDate &&
                  isDateItemInRange(granularity, date, rangeStartDate, addItems(addRows(rangeStartDate, 1), -1));
                const inRangeEndRow =
                  rangeEndDate &&
                  isDateItemInRange(granularity, date, rangeEndDate, addItems(addRows(rangeEndDate, -1), 1));
                const onlyOneSelected =
                  !!rangeStartDate && !!rangeEndDate
                    ? isSameItem(rangeStartDate, rangeEndDate)
                    : !selectedStartDate || !selectedEndDate;

                const isEnabled = !isDateEnabled || isDateEnabled(date);
                const disabledReason = dateDisabledReason(date);
                const isDisabledWithReason = !isEnabled && !!disabledReason;
                const isFocusable = isFocused && (isEnabled || isDisabledWithReason);

                const baseClasses = {
                  [testutilStyles.day]: !isMonthPicker,
                  [testutilStyles.month]: isMonthPicker,
                  [styles.day]: !isMonthPicker,
                  [styles.month]: isMonthPicker,
                  [styles['grid-cell']]: true,
                  [styles['in-first-row']]: rowIndex === 0,
                  [styles['in-first-column']]: rowItemIndex === 0,
                };

                if (!isSamePage(date, baseDate)) {
                  return (
                    <td
                      key={itemKey}
                      ref={isFocused ? focusedDateRef : undefined}
                      className={clsx(baseClasses, {
                        [styles[`in-previous-${pageName}`]]: isBefore(date, baseDate),
                        [styles[`in-next-${pageName}`]]: isAfter(date, baseDate),
                        [styles[`last-day-of-month`]]: !isMonthPicker && isLastDayOfMonth(date),
                        [styles[`last-month-of-year`]]: isMonthPicker && date.getMonth() === 11,
                      })}
                    />
                  );
                }

                const handlers: React.HTMLAttributes<HTMLDivElement> = {};
                if (isEnabled) {
                  handlers.onClick = () => onSelectDate(date);
                  handlers.onFocus = () => onFocusedDateChange(date);
                }

                const isCurrentDay = !isMonthPicker && isToday(date);
                const isCurrentMonth = isMonthPicker && isThisMonth(date);
                const isCurrent = isMonthPicker ? isThisMonth(date) : isToday(date);

                // Screen-reader announcement for the focused day/month.
                let announcement = renderDateAnnouncement({
                  date,
                  isCurrent,
                  locale,
                  granularity,
                });

                if (currentAnnouncement) {
                  if (isMonthPicker && isThisMonth(date)) {
                    announcement += `. ${currentAnnouncement}`;
                  } else if (!isMonthPicker && isToday(date)) {
                    announcement += `. ${currentAnnouncement}`;
                  }
                }

                // Can't be focused.
                let tabIndex = undefined;
                if (isEnabled || isDisabledWithReason) {
                  tabIndex = isFocusable
                    ? 0 // Next focus target.
                    : -1; // Can be focused programmatically.
                }

                const hasTopBorder = (
                  granularity: DateRangePickerProps['granularity'],
                  date: Date,
                  inSpecifiedRow: boolean
                ): boolean => !!inSpecifiedRow || isInFirstGrouping(granularity, date);

                const hasBottomBorder = (
                  granularity: DateRangePickerProps['granularity'],
                  date: Date,
                  inSpecifiedRow: boolean
                ): boolean => !!inSpecifiedRow || isInLastGrouping(granularity, date);
                const hasLeftBorder = (
                  granularity: DateRangePickerProps['granularity'],
                  date: Date,
                  itemIndex: number,
                  isFirstItemInRange: boolean
                ): boolean => itemIndex === 0 || isFirstItemInRange || isFirstItem(granularity, date);

                const hasRightBorder = (
                  granularity: DateRangePickerProps['granularity'],
                  date: Date,
                  itemIndex: number,
                  rowLength: number,
                  isLastItemInRange: boolean
                ): boolean => itemIndex === rowLength - 1 || isLastItemInRange || isLastItemInPage(granularity, date);

                return (
                  <GridCell
                    ref={isFocused ? focusedDateRef : undefined}
                    key={itemKey}
                    className={clsx(baseClasses, {
                      [styles[`in-current-${pageName}`]]: isSamePage(date, baseDate),
                      [styles.enabled]: isEnabled,
                      [styles.selected]: isSelected,
                      [styles['start-date']]: isStartDate,
                      [styles['end-date']]: isEndDate,
                      [testutilStyles['start-date']]: isStartDate,
                      [testutilStyles['end-date']]: isEndDate,
                      [styles['range-start-date']]: isRangeStartDate,
                      [styles['range-end-date']]: isRangeEndDate,
                      [styles['no-range']]: isSelected && onlyOneSelected,
                      [styles['in-range']]: dateIsInRange,
                      [styles['in-range-border-block-start']]: hasTopBorder(granularity, date, !!inRangeStartRow),
                      [styles['in-range-border-block-end']]: hasBottomBorder(granularity, date, !!inRangeEndRow),
                      [styles['in-range-border-inline-start']]: hasLeftBorder(
                        granularity,
                        date,
                        rowItemIndex,
                        isRangeStartDate
                      ),
                      [styles['in-range-border-inline-end']]: hasRightBorder(
                        granularity,
                        date,
                        rowItemIndex,
                        row.length,
                        isRangeEndDate
                      ),
                      [styles.today]: isCurrentDay,
                      [testutilStyles.today]: isCurrentDay,
                      [styles['this-month']]: isCurrentMonth,
                      [testutilStyles['this-month']]: isCurrentMonth,
                    })}
                    aria-selected={isEnabled ? isSelected || dateIsInRange : undefined}
                    aria-current={isCurrent ? 'date' : undefined}
                    data-date={formatDate(date, granularity)}
                    aria-disabled={!isEnabled}
                    tabIndex={tabIndex}
                    disabledReason={isDisabledWithReason ? disabledReason : undefined}
                    {...handlers}
                  >
                    <span className={styles[`${granularity}-inner`]} aria-hidden="true">
                      {isMonthPicker ? date.toLocaleString(locale, { month: 'short' }) : date.getDate()}
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

const isInFirstGrouping = (granularity: DateRangePickerProps['granularity'], date: Date) => {
  if (granularity === 'month') {
    return date.getMonth() < 3;
  }
  return date.getDate() <= 7;
};

const isInLastGrouping = (granularity: DateRangePickerProps['granularity'], date: Date): boolean => {
  if (granularity === 'month') {
    return date.getMonth() >= 9;
  }
  return date.getDate() > getDaysInMonth(date) - 7;
};

const isFirstItem = (granularity: DateRangePickerProps['granularity'], date: Date): boolean => {
  if (granularity === 'month') {
    return date.getMonth() === 0;
  }
  return date.getDate() === 1;
};

const isLastItemInPage = (granularity: DateRangePickerProps['granularity'], date: Date): boolean => {
  if (granularity === 'month') {
    return date.getMonth() === 11;
  }
  return isLastDayOfMonth(date);
};

export function isDateItemInRange(
  granularity: DateRangePickerProps['granularity'],
  date: Date,
  dateOne: Date | null,
  dateTwo: Date | null
): boolean {
  const isSame = granularity === 'day' ? isSameDay : isSameMonth;
  if (!dateOne || !dateTwo || isSame(dateOne, dateTwo)) {
    return false;
  }

  const inRange =
    (isAfter(date, dateOne) && isBefore(date, dateTwo)) || (isAfter(date, dateTwo) && isBefore(date, dateOne));

  return inRange || isSame(date, dateOne) || isSame(date, dateTwo);
}
