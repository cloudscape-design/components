// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { addMonths, addQuarters, isAfter, isBefore, isSameMonth, isSameYear, isThisMonth } from 'date-fns';

import useCalendarGridRows from '../../../calendar/grid/use-calendar-grid-rows';
import { useInternalI18n } from '../../../i18n/context';
import ScreenreaderOnly from '../../../internal/components/screenreader-only';
import { formatDate } from '../../../internal/utils/date-time';
import { normalizeLocale } from '../../../internal/utils/locale';
import { GridCell } from './grid-cell';
import { YearGridProps } from './interfaces';
import { renderDateAnnouncement } from './intl';

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

export function YearlyGrid({
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
  currentMonthAriaLabel,
  ariaLabelledby,
  className,
}: YearGridProps) {
  const i18n = useInternalI18n('date-range-picker');
  const normalizedLocale = normalizeLocale('DateRangePicker', locale ?? null);
  const rows = useCalendarGridRows({ baseDate, granularity: 'month', locale: normalizedLocale });
  const currentAnnouncement = i18n('i18nStrings.currentMonthAriaLabel', currentMonthAriaLabel);

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      <tbody onKeyDown={onGridKeyDownHandler}>
        {rows.map((row, rowIndex) => {
          return (
            <tr key={rowIndex} className={testutilStyles.quarter}>
              {row.map((date, rowItemIndex) => {
                const itemKey = `Month ${rowIndex * 3 + rowItemIndex + 1}`;
                const isCurrentMonth = isThisMonth(date); // checkIfCurrentMonth(date);
                const isStartDate = !!selectedStartDate && isSameMonth(date, selectedStartDate);
                const isEndDate = !!selectedEndDate && isSameMonth(date, selectedEndDate);
                const isSelected = isStartDate || isEndDate;
                const isRangeStartDate = !!rangeStartDate && isSameMonth(date, rangeStartDate);
                const isRangeEndDate = !!rangeEndDate && isSameMonth(date, rangeEndDate);

                const isFocused = !!focusedDate && isSameMonth(date, focusedDate) && isSameYear(date, baseDate);

                const dateIsInRange =
                  isStartDate || isEndDate || isMonthItemInRange(date, rangeStartDate, rangeEndDate);

                const inRangeStartRow =
                  rangeStartDate &&
                  isMonthItemInRange(date, rangeStartDate, addMonths(addQuarters(rangeStartDate, 1), -1));
                const inRangeEndRow =
                  rangeEndDate && isMonthItemInRange(date, rangeEndDate, addMonths(addQuarters(rangeEndDate, -1), 1));
                const onlyOneSelected =
                  !!rangeStartDate && !!rangeEndDate
                    ? isSameMonth(rangeStartDate, rangeEndDate)
                    : !selectedStartDate || !selectedEndDate;

                const isEnabled = !isDateEnabled || isDateEnabled(date);
                const disabledReason = dateDisabledReason(date);
                const isDisabledWithReason = !isEnabled && !!disabledReason;
                const isFocusable = isFocused && (isEnabled || isDisabledWithReason);

                const baseClasses = {
                  [testutilStyles.month]: true,
                  [styles.month]: true,
                  [styles['grid-cell']]: true,
                  [styles['in-first-row']]: rowIndex === 0,
                  [styles['in-first-column']]: rowItemIndex === 0,
                };

                if (!isSameYear(date, baseDate)) {
                  return (
                    <td
                      key={itemKey}
                      ref={isFocused ? focusedDateRef : undefined}
                      className={clsx(baseClasses, {
                        [styles[`in-previous-year`]]: isBefore(date, baseDate),
                        [styles[`in-next-next`]]: isAfter(date, baseDate),
                        [styles[`last-month-of-year`]]: date.getMonth() === 11,
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
                  isCurrent: isCurrentMonth,
                  locale,
                  granularity: 'month',
                });

                if (currentAnnouncement) {
                  if (isThisMonth(date)) {
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

                return (
                  <GridCell
                    ref={isFocused ? focusedDateRef : undefined}
                    key={itemKey}
                    className={clsx(baseClasses, {
                      [styles[`in-current-year`]]: isSameYear(date, baseDate),
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
                      [styles['in-range-border-block-start']]: !!inRangeStartRow || date.getMonth() < 3,
                      [styles['in-range-border-block-end']]: !!inRangeEndRow || date.getMonth() >= 9,
                      [styles['in-range-border-inline-start']]:
                        rowItemIndex === 0 || isRangeStartDate || date.getMonth() === 0,
                      [styles['in-range-border-inline-end']]:
                        rowItemIndex === row.length - 1 || isRangeEndDate || date.getMonth() === 11,
                      [styles['this-month']]: isCurrentMonth,
                      [testutilStyles['this-month']]: isCurrentMonth,
                    })}
                    aria-selected={isEnabled ? isSelected || dateIsInRange : undefined}
                    aria-current={isCurrentMonth ? 'date' : undefined}
                    data-date={formatDate(date, 'month')}
                    aria-disabled={!isEnabled}
                    tabIndex={tabIndex}
                    disabledReason={isDisabledWithReason ? disabledReason : undefined}
                    {...handlers}
                  >
                    <span className={styles[`month-inner`]} aria-hidden="true">
                      {date.toLocaleString(locale, { month: 'short' })}
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

export function isMonthItemInRange(date: Date, dateOne: Date | null, dateTwo: Date | null): boolean {
  if (!dateOne || !dateTwo || isSameMonth(dateOne, dateTwo)) {
    return false;
  }

  const inRange =
    (isAfter(date, dateOne) && isBefore(date, dateTwo)) || (isAfter(date, dateTwo) && isBefore(date, dateOne));

  return inRange || isSameMonth(date, dateOne) || isSameMonth(date, dateTwo);
}
