// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
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

export interface GridProps {
  locale: string;
  baseDate: Date;
  isDateEnabled: DatePickerProps.IsDateEnabledFunction;
  focusedDate: Date | null;
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
  onSelectDate,
  onFocusDate,
  onChangeMonth,
  startOfWeek,
  todayAriaLabel,
  selectedDate,
  handleFocusMove,
}: GridProps) {
  const onGridKeyDownHandler = (event: React.KeyboardEvent) => {
    let updatedFocusDate;

    if (focusedDate === null) {
      return;
    }

    switch (event.keyCode) {
      case KeyCode.enter:
        event.preventDefault();
        if (focusedDate) {
          onFocusDate(null);
          onSelectDate(focusedDate);
        }
        return;
      case KeyCode.right:
        event.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addDays(date, 1));
        break;
      case KeyCode.left:
        event.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addDays(date, -1));
        break;
      case KeyCode.up:
        event.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addWeeks(date, -1));
        break;
      case KeyCode.down:
        event.preventDefault();
        updatedFocusDate = handleFocusMove(focusedDate, isDateEnabled, date => addWeeks(date, 1));
        break;
      default:
        return;
    }

    if (!isSameMonth(updatedFocusDate, baseDate)) {
      onChangeMonth(updatedFocusDate);
    }
    onFocusDate(updatedFocusDate);
  };

  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: startOfWeek }),
    [baseDate, startOfWeek]
  );

  const focusVisible = useFocusVisible();

  return (
    <table role="none" className={styles['calendar-grid']}>
      <thead>
        <tr className={styles['calendar-grid-row']}>
          {rotateDayIndexes(startOfWeek).map(dayIndex => (
            <th
              key={dayIndex}
              scope="col"
              className={clsx(styles['calendar-grid-cell'], styles['calendar-day-header'])}
            >
              {renderDayName(locale, dayIndex)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles['calendar-grid-body']} onKeyDown={onGridKeyDownHandler}>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex} className={clsx(styles['calendar-grid-row'], styles['calendar-week'])}>
            {week.map((date, dateIndex) => {
              const isDateInLastWeek = weeks.length - 1 === weekIndex;
              const isFocusable = !!focusedDate && isSameDay(date, focusedDate);
              const isSelected = !!selectedDate && isSameDay(date, selectedDate);
              const isEnabled = !isDateEnabled || isDateEnabled(date);
              const isDateOnSameDay = isSameDay(date, new Date());

              const dayAnnouncement = isDateOnSameDay
                ? `${getDateLabel(locale, date)}. ${todayAriaLabel}`
                : getDateLabel(locale, date);

              const computedAttributes: React.HTMLAttributes<HTMLDivElement> = {};

              if (isSelected) {
                computedAttributes['aria-current'] = 'date';
              }

              if (isEnabled) {
                computedAttributes.onClick = () => onSelectDate(date);
                computedAttributes.tabIndex = -1;
              } else {
                computedAttributes['aria-disabled'] = true;
              }

              if (isFocusable && isEnabled) {
                computedAttributes.tabIndex = 0;
              }

              return (
                <td
                  key={`${weekIndex}:${dateIndex}`}
                  role="button"
                  aria-label={dayAnnouncement}
                  className={clsx(styles['calendar-grid-cell'], styles['calendar-day'], {
                    [styles['calendar-day-in-last-week']]: isDateInLastWeek,
                    [styles['calendar-day-current-month']]: isSameMonth(date, baseDate),
                    [styles['calendar-day-enabled']]: isEnabled,
                    [styles['calendar-day-selected']]: isSelected,
                    [styles['calendar-day-today']]: isDateOnSameDay,
                  })}
                  {...computedAttributes}
                  {...focusVisible}
                >
                  <span className={styles['day-inner']} aria-hidden="true">
                    {date.getDate()}
                  </span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
