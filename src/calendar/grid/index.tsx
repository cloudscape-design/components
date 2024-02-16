// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import styles from '../styles.css.js';
import { DatePickerProps } from '../../date-picker/interfaces';
import clsx from 'clsx';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update.js';
import ScreenreaderOnly from '../../internal/components/screenreader-only/index.js';

/**
 * Calendar grid supports two mechanisms of keyboard navigation:
 * - Native screen-reader table navigation (semantic table markup);
 * - Keyboard arrow-keys navigation (a custom key-down handler).
 *
 * The implementation largely follows the w3 example (https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog) and shares the following issues:
 * - (table navigation) Chrome+VO - weekday is announced twice when navigating to the calendar's header;
 * - (table navigation) Safari+VO - "dimmed" state is announced twice;
 * - (table navigation) Firefox/Chrome+NVDA - cannot use table navigation if any cell has a focus;
 * - (keyboard navigation) Firefox+NVDA - every date is announced as "not selected";
 * - (keyboard navigation) Safari/Chrome+VO - weekdays are not announced;
 * - (keyboard navigation) Safari/Chrome+VO - dates are not announced as interactive (clickable or selectable);
 * - (keyboard navigation) Safari/Chrome+VO - date announcements are not interruptive and can be missed if navigating fast.
 */

export interface GridProps {
  isDateEnabled: DatePickerProps.IsDateEnabledFunction;
  focusedDate: Date | null;
  focusableDate: Date | null;
  onSelectDate: (date: Date) => void;
  onFocusDate: (date: null | Date) => void;
  onChangePage: (date: Date) => void;
  selectedDate: Date | null;
  ariaLabelledby: string;
  header?: React.ReactNode;
  rows: ReadonlyArray<ReadonlyArray<Date>>;
  isCurrentPage: (date: Date) => boolean;
  renderDate: (date: Date) => string;
  renderDateAnnouncement: (date: Date, isOnCurrentDate: boolean) => string;
  isSameDate: (date: Date, baseDate: Date) => boolean;
  onGridKeyDownHandler: (event: React.KeyboardEvent) => void;
}

export default function Grid({
  isDateEnabled,
  focusedDate,
  focusableDate,
  onSelectDate,
  selectedDate,
  ariaLabelledby,
  header,
  rows,
  isCurrentPage,
  renderDate,
  renderDateAnnouncement,
  isSameDate,
  onGridKeyDownHandler,
}: GridProps) {
  const focusedDateRef = useRef<HTMLTableCellElement>(null);

  // The focused date changes as a feedback to keyboard navigation in the grid.
  // Once changed, the corresponding date button needs to receive the actual focus.
  useEffectOnUpdate(() => {
    if (focusedDate && focusedDateRef.current) {
      (focusedDateRef.current as HTMLDivElement).focus();
    }
  }, [focusedDate]);

  const rowLength = rows[0].length;

  const denseGrid = rowLength > 3;

  return (
    <table
      role="grid"
      className={clsx(styles['calendar-grid'], denseGrid && styles['calendar-grid-dense'])}
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
                    [styles['calendar-date-current-page']]: isCurrentPage(date),
                    [styles['calendar-date-enabled']]: isEnabled,
                    [styles['calendar-date-selected']]: isSelected,
                    [styles['calendar-date-current']]: isCurrentDate,
                    [styles['calendar-date-dense']]: denseGrid,
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
