// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import styles from '../styles.css.js';
import { KeyCode } from '../../internal/keycode';
import { DayIndex } from '../internal';
import { DatePickerProps } from '../../date-picker/interfaces';
import clsx from 'clsx';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update.js';
import ScreenreaderOnly from '../../internal/components/screenreader-only/index.js';
import {
  moveNextDay,
  movePrevDay,
  moveNextWeek,
  movePrevWeek,
  moveNextMonth,
  movePrevMonth,
  moveMonthDown,
  moveMonthUp,
} from '../utils/navigation';
import { CalendarProps } from '../interfaces.js';

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
  locale: string;
  isDateEnabled: DatePickerProps.IsDateEnabledFunction;
  focusedDate: Date | null;
  focusableDate: Date | null;
  onSelectDate: (date: Date) => void;
  onFocusDate: (date: null | Date) => void;
  onChangePage: (date: Date) => void;
  startOfWeek: DayIndex;
  selectedDate: Date | null;
  ariaLabelledby: string;
  granularity?: CalendarProps.Granularity;
  header?: React.ReactNode;
  rows: ReadonlyArray<ReadonlyArray<Date>>;
  isActive: (date: Date) => boolean;
  renderDate: (date: Date) => string;
  renderDateAnnouncement: (date: Date, isOnCurrentDate: boolean) => string;
  isSameDate: (date: Date, baseDate: Date) => boolean;
  belongsToCurrentPage: (date: Date) => boolean;
}

export default function Grid({
  isDateEnabled,
  focusedDate,
  focusableDate,
  onSelectDate,
  onFocusDate,
  onChangePage,
  selectedDate,
  ariaLabelledby,
  granularity,
  header,
  rows,
  isActive,
  renderDate,
  renderDateAnnouncement,
  isSameDate,
  belongsToCurrentPage,
}: GridProps) {
  const focusedDateRef = useRef<HTMLTableCellElement>(null);
  const isMonthPicker = granularity === 'month';

  const moveRight = isMonthPicker ? moveNextMonth : moveNextDay;
  const moveLeft = isMonthPicker ? movePrevMonth : movePrevDay;
  const moveUp = isMonthPicker ? moveMonthUp : movePrevWeek;
  const moveDown = isMonthPicker ? moveMonthDown : moveNextWeek;

  const onGridKeyDownHandler = (event: React.KeyboardEvent) => {
    let updatedFocusDate;

    if (focusableDate === null) {
      return;
    }

    switch (event.keyCode) {
      case KeyCode.space:
      case KeyCode.enter:
        event.preventDefault();
        if (focusableDate) {
          onFocusDate(null);
          onSelectDate(focusableDate);
        }
        return;
      case KeyCode.right:
        event.preventDefault();
        updatedFocusDate = moveRight(focusableDate, isDateEnabled);
        break;
      case KeyCode.left:
        event.preventDefault();
        updatedFocusDate = moveLeft(focusableDate, isDateEnabled);
        break;
      case KeyCode.up:
        event.preventDefault();
        updatedFocusDate = moveUp(focusableDate, isDateEnabled);
        break;
      case KeyCode.down:
        event.preventDefault();
        updatedFocusDate = moveDown(focusableDate, isDateEnabled);
        break;
      default:
        return;
    }

    if (!belongsToCurrentPage(updatedFocusDate)) {
      onChangePage(updatedFocusDate);
    }
    onFocusDate(updatedFocusDate);
  };

  // The focused date changes as a feedback to keyboard navigation in the grid.
  // Once changed, the corresponding day button needs to receive the actual focus.
  useEffectOnUpdate(() => {
    if (focusedDate && focusedDateRef.current) {
      (focusedDateRef.current as HTMLDivElement).focus();
    }
  }, [focusedDate]);

  const rowLength = rows[0].length;

  const spacedGrid = rowLength < 7;

  return (
    <table
      role="grid"
      className={clsx(styles['calendar-grid'], spacedGrid && styles['calendar-grid-spaced'])}
      aria-labelledby={ariaLabelledby}
    >
      {header}
      <tbody onKeyDown={onGridKeyDownHandler}>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={styles['calendar-row']}>
            {row.map((date, dateIndex) => {
              const isFocusable = !!focusableDate && isSameDate(date, focusableDate);
              const isSelected = !!selectedDate && isSameDate(date, selectedDate);
              const isEnabled = !isDateEnabled || isDateEnabled(date);
              const isCurrentDate = isSameDate(date, new Date());

              // Can't be focused.
              let tabIndex = undefined;
              if (isFocusable && isEnabled) {
                // Next focus target.
                tabIndex = 0;
              } else if (isEnabled) {
                // Can be focused programmatically.
                tabIndex = -1;
              }

              return (
                <td
                  key={`${rowIndex}:${dateIndex}`}
                  ref={tabIndex === 0 ? focusedDateRef : undefined}
                  tabIndex={tabIndex}
                  aria-current={isCurrentDate ? 'date' : undefined}
                  aria-selected={isEnabled ? isSelected : undefined}
                  aria-disabled={!isEnabled}
                  // Do not attach click event when the date is disabled, otherwise VO+safari announces clickable
                  onClick={isEnabled ? () => onSelectDate(date) : undefined}
                  className={clsx(styles['calendar-grid-cell'], styles['calendar-date'], {
                    [styles['calendar-date-active']]: isActive(date),
                    [styles['calendar-date-enabled']]: isEnabled,
                    [styles['calendar-date-selected']]: isSelected,
                    [styles['calendar-date-current']]: isCurrentDate,
                    [styles['calendar-date-spaced']]: spacedGrid,
                  })}
                >
                  <span className={styles['date-inner']} aria-hidden="true">
                    {renderDate(date)}
                  </span>
                  {/* Screen-reader announcement for the focused date. */}
                  <ScreenreaderOnly>{renderDateAnnouncement(date, isCurrentDate)}</ScreenreaderOnly>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
