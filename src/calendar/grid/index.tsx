// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useRef } from 'react';
import styles from '../styles.css.js';
import { KeyCode } from '../../internal/keycode';
import { addDays, addWeeks, isSameDay, isSameMonth } from 'date-fns';
import { getCalendarMonth } from 'mnth';
import { DayIndex } from '../internal';
import { MoveFocusHandler } from '../utils/move-focus-handler';
import { DatePickerProps } from '../../date-picker/interfaces';
import rotateDayIndexes from '../utils/rotate-day-indexes';
import { getDateLabel, renderDayName } from '../utils/intl';
import useFocusVisible from '../../internal/hooks/focus-visible/index.js';
import clsx from 'clsx';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update.js';

/**
 * Calendar uses table markup to meet a11y requirement.
 * With table markup, users can access calendar with screenreader table navigation.
 * Following are known issues with screenreader table navigation which are reproducible on https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog :
 * 1. Chrome+VO — day name in the column header are announced twice
 * 2. Safari+VO — “dimmed” day state is announced twice
 * 3. NVDA+Firefox - can not move focus by arrow up/down
 * 4. Chrome+NVDA - seems to not use table navigation. Using Control+Alt+Arrow-keys just moves the application focus
 * Alternatively, users can access calendar with keyboard application navigation.
 * Following are known issues with keyboard application navigation which are reproducible on https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog :
 * 1. NVDA+Firefox — every day is announced as “not selected”
 * 2. VO - doesn't announce column header when focusing on days
 * 3. VO - no indication that the days are clickable(not selected, clickable...)
 * 4. VO - announcements are not assertive and if navigating fast some dates will be skipped
 */

export interface GridProps {
  locale: string;
  baseDate: Date;
  isDateEnabled: DatePickerProps.IsDateEnabledFunction;
  focusedDate: Date | null;
  focusableDate: Date | null;
  onSelectDate: (date: Date) => void;
  onFocusDate: (date: null | Date) => void;
  onChangeMonth: (date: Date) => void;
  startOfWeek: DayIndex;
  todayAriaLabel: string;
  selectedDate: Date | null;
  handleFocusMove: MoveFocusHandler;
}

export default function Grid({
  locale,
  baseDate,
  isDateEnabled,
  focusedDate,
  focusableDate,
  onSelectDate,
  onFocusDate,
  onChangeMonth,
  startOfWeek,
  todayAriaLabel,
  selectedDate,
  handleFocusMove,
}: GridProps) {
  const focusedDateRef = useRef<HTMLTableCellElement>(null);

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
        updatedFocusDate = handleFocusMove(focusableDate, isDateEnabled, date => addDays(date, 1));
        break;
      case KeyCode.left:
        event.preventDefault();
        updatedFocusDate = handleFocusMove(focusableDate, isDateEnabled, date => addDays(date, -1));
        break;
      case KeyCode.up:
        event.preventDefault();
        updatedFocusDate = handleFocusMove(focusableDate, isDateEnabled, date => addWeeks(date, -1));
        break;
      case KeyCode.down:
        event.preventDefault();
        updatedFocusDate = handleFocusMove(focusableDate, isDateEnabled, date => addWeeks(date, 1));
        break;
      default:
        return;
    }

    if (!isSameMonth(updatedFocusDate, baseDate)) {
      onChangeMonth(updatedFocusDate);
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

  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: startOfWeek }),
    [baseDate, startOfWeek]
  );

  const focusVisible = useFocusVisible();

  return (
    <table role="grid" className={styles['calendar-grid']}>
      <thead>
        <tr>
          {rotateDayIndexes(startOfWeek).map(dayIndex => (
            <th
              key={dayIndex}
              scope="col"
              className={clsx(styles['calendar-grid-cell'], styles['calendar-day-header'])}
            >
              <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
              <span className={styles['visually-hidden']}>{renderDayName(locale, dayIndex, 'long')}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody onKeyDown={onGridKeyDownHandler}>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex} className={styles['calendar-week']}>
            {week.map((date, dateIndex) => {
              const isFocusable = !!focusableDate && isSameDay(date, focusableDate);
              const isSelected = !!selectedDate && isSameDay(date, selectedDate);
              const isEnabled = !isDateEnabled || isDateEnabled(date);
              const isDateOnSameDay = isSameDay(date, new Date());

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
              if (isDateOnSameDay) {
                dayAnnouncement += '. ' + todayAriaLabel;
              }

              return (
                <td
                  key={`${weekIndex}:${dateIndex}`}
                  ref={tabIndex === 0 ? focusedDateRef : undefined}
                  tabIndex={tabIndex}
                  aria-current={isDateOnSameDay ? 'date' : undefined}
                  aria-selected={isEnabled ? isSelected : undefined}
                  aria-disabled={!isEnabled}
                  // Do not attach click event when the date is disabled, otherwise VO+safari announces clickable
                  onClick={isEnabled ? () => onSelectDate(date) : undefined}
                  className={clsx(styles['calendar-grid-cell'], styles['calendar-day'], {
                    [styles['calendar-day-current-month']]: isSameMonth(date, baseDate),
                    [styles['calendar-day-enabled']]: isEnabled,
                    [styles['calendar-day-selected']]: isSelected,
                    [styles['calendar-day-today']]: isDateOnSameDay,
                  })}
                  {...focusVisible}
                >
                  <span className={styles['day-inner']} aria-hidden="true">
                    {date.getDate()}
                  </span>
                  <span className={styles['visually-hidden']}>{dayAnnouncement}</span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
