// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { isLastDayOfMonth, isSameDay, isSameMonth, isSameYear, isThisMonth, isToday } from 'date-fns';

import { useInternalI18n } from '../../../i18n/context';
import ScreenreaderOnly from '../../../internal/components/screenreader-only';
import { formatDate } from '../../../internal/utils/date-time';
import { CalendarQuarter, CalendarWeek, MonthCalendar, YearCalendar } from '../../../internal/utils/date-time/calendar';
import { normalizeStartOfWeek } from '../../../internal/utils/locale/index.js';
import { GridCell } from './grid-cell';
import { GridProps } from './interfaces';
import { renderDateAnnouncement, renderDayName } from './intl';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface DatePickerUtils {
  getItemKey: (rowIndex: number, rowItemIndex: number) => string;
  isSameItem: (date1: Date, date2: Date) => boolean;
  isSamePage: (date1: Date, date2: Date) => boolean;
  checkIfCurrentDay: (date: Date) => boolean;
  checkIfCurrentMonth: (date: Date) => boolean;
  checkIfCurrent: (date: Date) => boolean;
  getPageName: () => string;
}

const dayUtils: DatePickerUtils = {
  getItemKey: (rowIndex, rowItemIndex) => `${rowIndex}:${rowItemIndex}`,
  isSameItem: (date1: Date, date2: Date) => isSameDay(date1, date2),
  isSamePage: (date1: Date, date2: Date) => isSameMonth(date1, date2),
  checkIfCurrentDay: date => isToday(date),
  checkIfCurrentMonth: () => false,
  checkIfCurrent: date => isToday(date),
  getPageName: () => 'month',
};

const monthUtils: DatePickerUtils = {
  getItemKey: (rowIndex, rowItemIndex) => `Month ${rowIndex * 3 + rowItemIndex + 1}`,
  isSameItem: (date1: Date, date2: Date) => isSameMonth(date1, date2),
  isSamePage: (date1: Date, date2: Date) => isSameYear(date1, date2),
  checkIfCurrentDay: () => false,
  checkIfCurrentMonth: date => isThisMonth(date),
  checkIfCurrent: date => isThisMonth(date),
  getPageName: () => 'year',
};

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
  currentMonthAriaLabel,
  ariaLabelledby,
  className,
  startOfWeek: rawStartOfWeek = 0,
  granularity = 'day',
}: GridProps) {
  const baseDateTime = baseDate?.getTime();
  const i18n = useInternalI18n('date-range-picker');
  const isMonthPicker = granularity === 'month';
  const startOfWeek = normalizeStartOfWeek(rawStartOfWeek, locale);
  const calendar = useMemo(
    () => {
      const startDate = rangeStartDate ?? rangeEndDate;
      const endDate = rangeEndDate ?? rangeStartDate;
      const selection = startDate && endDate ? ([startDate, endDate] as [Date, Date]) : null;
      if (isMonthPicker) {
        const calendarData = new YearCalendar({ baseDate, selection });
        return {
          header: [],
          rows: calendarData.quarters,
          range: calendarData.range,
        };
      }

      const calendarData = new MonthCalendar({ padDates, startOfWeek, baseDate, selection });
      return {
        header: calendarData.weekdays,
        rows: calendarData.weeks,
        range: calendarData.range,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [padDates, startOfWeek, baseDateTime, rangeStartDate, rangeEndDate]
  );

  const currentAnnouncement = i18n(
    isMonthPicker ? 'i18nStrings.currentMonthAriaLabel' : 'i18nStrings.todayAriaLabel',
    isMonthPicker ? currentMonthAriaLabel : todayAriaLabel
  );

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      {!isMonthPicker && (
        <thead>
          <tr>
            {calendar.header.map(dayIndex => (
              <th key={dayIndex} scope="col" className={clsx(styles['grid-cell'], testutilStyles['day-header'])}>
                <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
                <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody onKeyDown={onGridKeyDownHandler}>
        {calendar.rows.map((row, rowIndex) => {
          const rowItems = isMonthPicker ? (row as CalendarQuarter).months : (row as CalendarWeek).days;
          const weekTestIndex = !isMonthPicker ? (row as CalendarWeek).testIndex : undefined;
          return (
            <tr
              key={rowIndex}
              className={clsx({
                [testutilStyles['calendar-quarter']]: isMonthPicker,
                [testutilStyles['calendar-week']]: !isMonthPicker,
              })}
              {...(!isMonthPicker && weekTestIndex
                ? {
                    ['data-awsui-weekindex']: weekTestIndex,
                  }
                : {})}
            >
              {rowItems.map(
                (
                  { date, isVisible, isInRange, isSelectionTop, isSelectionBottom, isSelectionLeft, isSelectionRight },
                  rowItemIndex
                ) => {
                  const {
                    getItemKey,
                    isSameItem,
                    isSamePage,
                    checkIfCurrent,
                    checkIfCurrentDay,
                    checkIfCurrentMonth,
                    getPageName,
                  } = isMonthPicker ? monthUtils : dayUtils;
                  const itemKey = getItemKey(rowIndex, rowItemIndex);
                  const pageName = getPageName();
                  const isCurrentDay = checkIfCurrentDay(date);
                  const isCurrentMonth = checkIfCurrentMonth(date);
                  const isCurrent = checkIfCurrent(date);
                  const isStartDate = !!selectedStartDate && isSameItem(date, selectedStartDate);
                  const isEndDate = !!selectedEndDate && isSameItem(date, selectedEndDate);
                  const isSelected = isStartDate || isEndDate;

                  const isFocused = !!focusedDate && isSameItem(date, focusedDate) && isSamePage(date, baseDate);

                  const onlyOneSelected =
                    !!rangeStartDate && !!rangeEndDate
                      ? isSameItem(rangeStartDate, rangeEndDate)
                      : !selectedStartDate || !selectedEndDate;

                  const isEnabled = (!isDateEnabled || isDateEnabled(date)) && isSamePage(date, baseDate);
                  const disabledReason = dateDisabledReason(date);

                  const isDisabledWithReason = !isEnabled && !!disabledReason;
                  const isFocusable = isFocused && (isEnabled || isDisabledWithReason);

                  const baseClasses = {
                    [testutilStyles['calendar-date']]: !isMonthPicker && isSameMonth(date, baseDate),
                    [testutilStyles['calendar-month']]: isMonthPicker && isSameYear(date, baseDate),
                    [styles.day]: !isMonthPicker,
                    [styles.month]: isMonthPicker,
                    [styles['grid-cell']]: true,
                    [styles['in-first-row']]: rowIndex === 0,
                    [styles['in-first-column']]: rowItemIndex === 0,
                  };

                  if (!isVisible) {
                    return (
                      <td
                        key={itemKey}
                        ref={isFocused ? focusedDateRef : undefined}
                        className={clsx(baseClasses, {
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
                  let tabIndex: number | undefined = undefined;
                  if (isEnabled || isDisabledWithReason) {
                    tabIndex = isFocusable
                      ? 0 // Next focus target.
                      : -1; // Can be focused programmatically.
                  }

                  console.log({
                    [styles['in-visible-calendar']]: true,
                    [styles[`in-current-${pageName}`]]: isSamePage(date, baseDate),
                    [styles.enabled]: isEnabled,
                    [styles.selected]: isSelected,
                    [styles['start-date']]: isStartDate,
                    [styles['end-date']]: isEndDate,
                    [testutilStyles['start-date']]: isStartDate,
                    [testutilStyles['end-date']]: isEndDate,
                    [styles['no-range']]: isSelected && onlyOneSelected,
                    [styles['in-range']]: isInRange,
                    [styles['in-range-border-block-start']]: isSelectionTop,
                    [styles['in-range-border-block-end']]: isSelectionBottom,
                    [styles['in-range-border-inline-start']]: isSelectionLeft,
                    [styles['in-range-border-inline-end']]: isSelectionRight,
                    [styles.today]: isCurrentDay,
                    [testutilStyles.today]: isCurrentDay,
                    [styles['this-month']]: isCurrentMonth,
                    [testutilStyles['this-month']]: isCurrentMonth,
                  });
                  return (
                    <GridCell
                      ref={isFocused ? focusedDateRef : undefined}
                      key={itemKey}
                      className={clsx(baseClasses, {
                        [styles['in-visible-calendar']]: true,
                        [styles[`in-current-${pageName}`]]: isSamePage(date, baseDate),
                        [styles.enabled]: isEnabled,
                        [styles.selected]: isSelected,
                        [styles['start-date']]: isStartDate,
                        [styles['end-date']]: isEndDate,
                        [testutilStyles['start-date']]: isStartDate,
                        [testutilStyles['end-date']]: isEndDate,
                        [styles['range-start-date']]: !!rangeStartDate && isSameItem(date, rangeStartDate),
                        [styles['range-end-date']]: !!rangeEndDate && isSameItem(date, rangeEndDate),
                        [styles['no-range']]: isSelected && onlyOneSelected,
                        [styles['in-range']]: isInRange,
                        [styles['in-range-border-block-start']]: isSelectionTop,
                        [styles['in-range-border-block-end']]: isSelectionBottom,
                        [styles['in-range-border-inline-start']]: isSelectionLeft,
                        [styles['in-range-border-inline-end']]: isSelectionRight,
                        [styles.today]: isCurrentDay,
                        [testutilStyles.today]: isCurrentDay,
                        [styles['this-month']]: isCurrentMonth,
                        [testutilStyles['this-month']]: isCurrentMonth,
                      })}
                      aria-selected={isEnabled ? isSelected || isInRange : undefined}
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
                }
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
