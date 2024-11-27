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
import ScreenreaderOnly from '../../../internal/components/screenreader-only';
import { formatDate } from '../../../internal/utils/date-time';
import { normalizeLocale } from '../../../internal/utils/locale';
import { DateRangePickerProps } from '../../interfaces';
import { GridCell } from './grid-cell';
import { GridProps } from './interfaces';
import { getDateLabel, renderDayName } from './intl';

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
  ariaLabelledby,
  className,
  startOfWeek = 0,
  granularity = 'day',
}: GridProps) {
  console.log(granularity);
  const baseDateTime = baseDate?.getTime();
  // `baseDateTime` is used as a more stable replacement for baseDate
  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: startOfWeek }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseDateTime, startOfWeek]
  );
  const weekdays = weeks[0].map(date => date.getDay());
  const normalizedLocale = normalizeLocale('DateRangePicker', locale ?? null);
  const quarters = useCalendarGridRows({ baseDate, granularity: 'month', locale: normalizedLocale });
  const rows = granularity === 'day' ? weeks : quarters;

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      {granularity === 'day' && (
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
      )}
      <tbody onKeyDown={onGridKeyDownHandler}>
        {rows.map((row, rowIndex) => {
          return (
            <tr key={rowIndex} className={granularity === 'day' ? styles.week : styles.quarter}>
              {row.map((date, rowItemIndex) => {
                const itemKey =
                  granularity === 'day' ? `${rowIndex}:${rowItemIndex}` : `Month ${rowIndex * 3 + rowItemIndex + 1}`;
                const isSameItem = granularity === 'day' ? isSameDay : isSameMonth;
                const isSamePage = granularity === 'day' ? isSameMonth : isSameYear;
                const addItems = granularity === 'day' ? addDays : addMonths;
                const addRows = granularity === 'day' ? addWeeks : addQuarters;
                const pageName = granularity === 'day' ? 'month' : 'year';
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
                  [styles.day]: granularity === 'day',
                  [styles.month]: granularity === 'month',
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
                        [styles[`last-day-of-month`]]: granularity === 'day' && isLastDayOfMonth(date),
                        [styles[`last-month-of-year`]]: granularity === 'month' && date.getMonth() === 12,
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

                // Screen-reader announcement for the focused day.
                let dayAnnouncement = getDateLabel(locale, date, 'short');
                if (isToday(date)) {
                  dayAnnouncement += '. ' + todayAriaLabel;
                }

                const isCurrent = granularity === 'month' ? isThisMonth(date) : isToday(date);

                const hasTopBorder = (
                  granularity: DateRangePickerProps['granularity'],
                  date: Date,
                  inSpecifiedRow: boolean
                ): boolean => !!inSpecifiedRow || isInFirstGrouping(granularity, date);

                //todo find out why it is wrongly applying for the first in month when a range extends to multiple months
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

                //todo find out why it is wrongly applying for the first in month when a range extends to multiple months
                const hasRightBorder = (
                  granularity: DateRangePickerProps['granularity'],
                  date: Date,
                  itemIndex: number,
                  rowLength: number,
                  isLastItemInRange: boolean
                ): boolean => {
                  console.log({
                    date,
                    rowLength,
                    itemIndex,
                    isLastItemInRange,
                    isLastItemInPage2: isLastItemInPage(granularity, date),
                  });
                  return itemIndex === rowLength - 1 || isLastItemInRange || isLastItemInPage(granularity, date);
                };

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
                      [styles.today]: granularity === 'day' && isToday(date),
                      [styles['this-month']]: granularity === 'month' && isThisMonth(date),
                    })}
                    aria-selected={isEnabled ? isSelected || dateIsInRange : undefined}
                    aria-current={isCurrent ? 'date' : undefined}
                    data-date={formatDate(date)}
                    aria-disabled={!isEnabled}
                    tabIndex={tabIndex}
                    disabledReason={isDisabledWithReason ? disabledReason : undefined}
                    {...handlers}
                  >
                    <span className={styles[`${granularity}-inner`]} aria-hidden="true">
                      {granularity === 'month' ? date.toLocaleString(locale, { month: 'short' }) : date.getDate()}
                    </span>
                    <ScreenreaderOnly>{dayAnnouncement}</ScreenreaderOnly>
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
    return date.getMonth() <= 3;
  }
  return date.getDate() <= 7;
};

const isInLastGrouping = (granularity: DateRangePickerProps['granularity'], date: Date): boolean => {
  if (granularity === 'month') {
    return date.getMonth() >= 9; //todo determine why 9 shouldnt it be september
  }
  return date.getDate() > getDaysInMonth(date) - 7;
};

const isFirstItem = (granularity: DateRangePickerProps['granularity'], date: Date): boolean => {
  if (granularity === 'month') {
    return date.getMonth() === 1;
  }
  return date.getDate() === 1;
};

const isLastItemInPage = (granularity: DateRangePickerProps['granularity'], date: Date): boolean => {
  if (granularity === 'month') {
    return date.getMonth() === 12;
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
