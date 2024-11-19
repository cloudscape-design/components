// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import {
  addDays,
  addWeeks,
  getDaysInMonth,
  // getYear,
  isAfter,
  isBefore,
  isLastDayOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns';

import useCalendarGridRows from '../../../calendar/grid/use-calendar-grid-rows';
// import { getCalendarMonth } from 'mnth';
import { getDateLabel } from '../../../calendar/utils/intl';
import ScreenreaderOnly from '../../../internal/components/screenreader-only/index.js';
import { formatDate } from '../../../internal/utils/date-time';
import { normalizeLocale } from '../../../internal/utils/locale';
import { DateRangePickerProps } from '../../interfaces';
import { GridCell } from './grid-cell';

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

export interface MonthlyGridBaseProps {
  baseDate: Date;
  selectedStartMonth: Date | null;
  selectedEndMonth: Date | null;
  focusedMonth: Date | null;

  onFocusedMonthChange: React.Dispatch<React.SetStateAction<Date | null>>;
  isMonthEnabled: DateRangePickerProps.IsDateEnabledFunction;
  monthDisabledReason: DateRangePickerProps.DateDisabledReasonFunction;

  locale?: string;
  currentMonthAriaLabel?: string;
}

export interface MonthlyGridProps extends MonthlyGridBaseProps {
  rangeStartMonth: Date | null;
  rangeEndMonth: Date | null;
  focusedMonthRef: React.RefObject<HTMLTableCellElement>;

  onSelectMonth: (date: Date) => void;
  onGridKeyDownHandler: (e: React.KeyboardEvent<HTMLElement>) => void;

  ariaLabelledby: string;
  className?: string;
}

export function MonthlyGrid({
  baseDate,
  selectedStartMonth,
  selectedEndMonth,
  rangeStartMonth,
  rangeEndMonth,
  focusedMonth,

  focusedMonthRef,

  onSelectMonth,
  onGridKeyDownHandler,
  onFocusedMonthChange,

  isMonthEnabled,
  monthDisabledReason,

  locale,
  currentMonthAriaLabel,
  ariaLabelledby,

  className,
}: MonthlyGridProps) {
  // const baseDateTime = baseDate?.getTime();
  // `baseDateTime` is used as a more stable replacement for baseDate
  // const weeks = useMemo<Date[][]>(
  //   () => getCalendarMonth(baseDate),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [baseDateTime]
  // );
  // const weekdays = weeks[0].map(date => date.getDay());
  const normalizedLocale = normalizeLocale('DateRangePicker', locale ?? null);
  const rows = useCalendarGridRows({ baseDate, granularity: 'month', locale: normalizedLocale });

  //todo remove once value passed down

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      {/* <thead>
        <tr>
          {weekdays.map(dayIndex => (
            <th key={dayIndex} scope="col" className={clsx(styles['grid-cell'], styles['day-header'])}>
              <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
              <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
            </th>
          ))}
        </tr>
      </thead> */}
      <tbody onKeyDown={onGridKeyDownHandler}>
        {rows.map((quarter, quarterIndex) => {
          return (
            <tr key={quarterIndex} className={styles.quarter}>
              {quarter.map((monthOptionDate, monthInQuarterIndex) => {
                const monthKey = `Month ${quarterIndex * 3 + monthInQuarterIndex + 1}`;
                const isStartMonth = !!selectedStartMonth && isSameDay(monthOptionDate, selectedStartMonth);
                const isEndMonth = !!selectedEndMonth && isSameDay(monthOptionDate, selectedEndMonth);
                const isSelected = isStartMonth || isEndMonth;
                const isRangeStartMonth = !!rangeStartMonth && isSameDay(monthOptionDate, rangeStartMonth);
                const isRangeEndMonth = !!rangeEndMonth && isSameDay(monthOptionDate, rangeEndMonth);

                const isFocused =
                  !!focusedMonth && isSameDay(monthOptionDate, focusedMonth) && isSameMonth(monthOptionDate, baseDate);

                const dateIsInRange =
                  isStartMonth || isEndMonth || isInRange(monthOptionDate, rangeStartMonth, rangeEndMonth);
                const inRangeStartMonth =
                  rangeStartMonth &&
                  isInRange(monthOptionDate, rangeStartMonth, addDays(addWeeks(rangeStartMonth, 1), -1));
                const inRangeEndMonth =
                  rangeEndMonth && isInRange(monthOptionDate, rangeEndMonth, addDays(addWeeks(rangeEndMonth, -1), 1));
                const onlyOneSelected =
                  !!rangeStartMonth && !!rangeEndMonth
                    ? isSameDay(rangeStartMonth, rangeEndMonth)
                    : !selectedStartMonth || !selectedEndMonth;

                const isEnabled = !isMonthEnabled || isMonthEnabled(monthOptionDate);
                const disabledReason = monthDisabledReason(monthOptionDate);
                const isDisabledWithReason = !isEnabled && !!disabledReason;
                const isFocusable = isFocused && (isEnabled || isDisabledWithReason);

                const baseClasses = {
                  [styles.day]: true,
                  [styles['grid-cell']]: true,
                  [styles['in-first-row']]: quarterIndex === 0,
                  [styles['in-first-column']]: monthInQuarterIndex === 0,
                };

                if (!isSameMonth(monthOptionDate, baseDate)) {
                  return (
                    <td
                      key={monthKey}
                      ref={isFocused ? focusedMonthRef : undefined}
                      className={clsx(baseClasses, {
                        [styles['in-previous-month']]: isBefore(monthOptionDate, baseDate),
                        [styles['last-day-of-month']]: isLastDayOfMonth(monthOptionDate),
                        [styles['in-next-month']]: isAfter(monthOptionDate, baseDate),
                      })}
                    />
                  );
                }

                const handlers: React.HTMLAttributes<HTMLDivElement> = {};
                if (isEnabled) {
                  handlers.onClick = () => onSelectMonth(monthOptionDate);
                  handlers.onFocus = () => onFocusedMonthChange(monthOptionDate);
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
                let monthAnnouncement = getDateLabel(normalizedLocale, monthOptionDate, 'short');
                if (isToday(monthOptionDate)) {
                  monthAnnouncement += '. ' + currentMonthAriaLabel;
                }

                return (
                  <GridCell
                    ref={isFocused ? focusedMonthRef : undefined}
                    key={monthKey}
                    className={clsx(baseClasses, {
                      [styles['in-current-month']]: isSameMonth(monthOptionDate, baseDate),
                      [styles.enabled]: isEnabled,
                      [styles.selected]: isSelected,
                      [styles['start-date']]: isStartMonth,
                      [styles['end-date']]: isEndMonth,
                      [styles['range-start-date']]: isRangeStartMonth,
                      [styles['range-end-date']]: isRangeEndMonth,
                      [styles['no-range']]: isSelected && onlyOneSelected,
                      [styles['in-range']]: dateIsInRange,

                      //topStyle
                      [styles['in-range-border-block-start']]: !!inRangeStartMonth || monthOptionDate.getDate() <= 7,
                      //bottom sty;e
                      [styles['in-range-border-block-end']]:
                        !!inRangeEndMonth || monthOptionDate.getDate() > getDaysInMonth(monthOptionDate) - 7,
                      [styles['in-range-border-inline-start']]:
                        //left style
                        monthInQuarterIndex === 0 || isRangeStartMonth, //monthOptionDate.getDate() === 1
                      //right style
                      [styles['in-range-border-inline-end']]:
                        monthInQuarterIndex === quarter.length - 1 || isRangeEndMonth, //isLastDayOfMonth(monthOptionDate)

                      //needs special style for current month
                      [styles.today]: isToday(monthOptionDate),
                    })}
                    aria-selected={isEnabled ? isSelected || dateIsInRange : undefined}
                    aria-current={isToday(monthOptionDate) ? 'date' : undefined}
                    data-date={formatDate(monthOptionDate)}
                    aria-disabled={!isEnabled}
                    tabIndex={tabIndex}
                    disabledReason={isDisabledWithReason ? disabledReason : undefined}
                    {...handlers}
                  >
                    s
                    <span className={styles['day-inner']} aria-hidden="true">
                      {monthOptionDate.getDate()}
                    </span>
                    <ScreenreaderOnly>{monthAnnouncement}</ScreenreaderOnly>
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

function isInRange(date: Date, dateOne: Date | null, dateTwo: Date | null) {
  if (!dateOne || !dateTwo || isSameDay(dateOne, dateTwo)) {
    return false;
  }

  const inRange =
    (isAfter(date, dateOne) && isBefore(date, dateTwo)) || (isAfter(date, dateTwo) && isBefore(date, dateOne));

  return inRange || isSameDay(date, dateOne) || isSameDay(date, dateTwo);
}
