// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import styles from '../styles.css.js';
import GridDay from './day';
import { KeyCode } from '../../internal/keycode';
import { addDays, addWeeks, isSameMonth } from 'date-fns';
import { getCalendarMonth } from 'mnth';
import { DayIndex } from '../internal';
import { MoveFocusHandler } from '../utils/move-focus-handler';
import { DatePickerProps } from '../../date-picker/interfaces';
import rotateDayIndexes from '../utils/rotate-day-indexes';
import { renderDayName } from '../utils/intl';

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

const Grid = ({
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
}: GridProps) => {
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

  return (
    <div>
      <div className={styles['calendar-day-names']}>
        {rotateDayIndexes(startOfWeek).map(i => (
          <div key={`day-name-${i}`} className={styles['calendar-day-name']}>
            {renderDayName(locale, i)}
          </div>
        ))}
      </div>
      <div className={styles['calendar-dates']} onKeyDown={onGridKeyDownHandler}>
        {weeks.map((week, weekIndex) => {
          return (
            <div key={`week-${weekIndex}`} className={styles['calendar-week']}>
              {week.map((date, dateIndex) => {
                return (
                  <GridDay
                    key={`date-${weekIndex}-${dateIndex}`}
                    locale={locale}
                    baseDate={baseDate}
                    selectedDate={selectedDate}
                    date={date}
                    focusedDate={focusedDate}
                    todayAriaLabel={todayAriaLabel}
                    onSelectDate={date => onSelectDate(date)}
                    isDateEnabled={isDateEnabled}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
