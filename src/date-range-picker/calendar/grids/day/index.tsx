// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import { DateRangePickerProps } from '../../../interfaces';
import { getDaysInMonth, isAfter, isBefore, isLastDayOfMonth, isSameMonth, isToday as isTodayFn } from 'date-fns';
import { getDateLabel } from '../../../../calendar/utils/intl';
import clsx from 'clsx';
import { KeyCode } from '../../../../internal/keycode.js';
import useFocusVisible from '../../../../internal/hooks/focus-visible';
import { formatDate } from '../../../../internal/utils/date-time';

interface GridDayProps {
  locale: string;
  baseDate: Date;
  date: Date;

  isDateInFirstRow: boolean;
  isDateInFirstColumn: boolean;
  isDateInLastColumn: boolean;
  isDateInSelectionStartWeek: boolean;
  isDateInSelectionEndWeek: boolean;

  isFocusedDate: boolean;
  isDateEnabled?: DateRangePickerProps.IsDateEnabledFunction;
  todayAriaLabel: string;
  onSelectDate: (date: Date) => void;
  onFocusDate: (date: Date) => void;
  isInRange: boolean;
  isSelected: boolean;

  // these only exist for the test-utils
  isStartDate: boolean;
  isEndDate: boolean;
  // used for refresh styles
  onlyOneSelected: boolean;
  isRangeStartDate: boolean;
  isRangeEndDate: boolean;

  focusedDateRef: React.RefObject<HTMLDivElement>;
}

export default function GridDay({
  locale,
  baseDate,
  date,
  isSelected,
  isStartDate,
  isEndDate,
  onlyOneSelected,
  isRangeStartDate,
  isRangeEndDate,
  isFocusedDate,
  isDateEnabled,
  todayAriaLabel,
  onSelectDate,
  onFocusDate,
  isDateInFirstRow,
  isDateInFirstColumn,
  isDateInLastColumn,
  isDateInSelectionStartWeek,
  isDateInSelectionEndWeek,
  isInRange,
  focusedDateRef,
}: GridDayProps) {
  const dayLabel = getDateLabel(locale, date);

  const labels = [dayLabel];

  const isEnabled = !isDateEnabled || isDateEnabled(date);
  const isFocusable = isFocusedDate && isEnabled;
  const isToday = isTodayFn(date);
  const computedAttributes: React.HTMLAttributes<HTMLDivElement> = {};

  const focusVisible = useFocusVisible();

  const baseClasses = {
    [styles['in-first-row']]: isDateInFirstRow,
    [styles['in-first-column']]: isDateInFirstColumn,
  };

  if (!isSameMonth(date, baseDate)) {
    const classNames = clsx(styles.day, baseClasses, {
      [styles['in-previous-month']]: isBefore(date, baseDate),
      [styles['last-day-of-month']]: isLastDayOfMonth(date),
      [styles['in-next-month']]: isAfter(date, baseDate),
    });
    return <div className={classNames} ref={isFocusedDate ? focusedDateRef : undefined}></div>;
  }

  const classNames = clsx(styles.day, baseClasses, {
    [styles['in-current-month']]: isSameMonth(date, baseDate),
    [styles.enabled]: isEnabled,
    [styles.selected]: isSelected,
    [styles['start-date']]: isStartDate,
    [styles['end-date']]: isEndDate,
    [styles['range-start-date']]: isRangeStartDate,
    [styles['range-end-date']]: isRangeEndDate,
    [styles['no-range']]: isSelected && onlyOneSelected,
    [styles['in-range']]: isInRange,
    [styles['in-range-border-top']]: isDateInSelectionStartWeek || date.getDate() <= 7,
    [styles['in-range-border-bottom']]: isDateInSelectionEndWeek || date.getDate() > getDaysInMonth(date) - 7,
    [styles['in-range-border-left']]: isDateInFirstColumn || date.getDate() === 1 || isRangeStartDate,
    [styles['in-range-border-right']]: isDateInLastColumn || isLastDayOfMonth(date) || isRangeEndDate,
    [styles.today]: isToday,
  });

  computedAttributes['aria-pressed'] = isSelected || isInRange;

  if (isToday) {
    labels.push(todayAriaLabel);
    computedAttributes['aria-current'] = 'date';
  }

  if (isEnabled) {
    computedAttributes.onClick = () => onSelectDate(date);
    computedAttributes.onFocus = () => onFocusDate(date);
    computedAttributes.tabIndex = -1;
  }

  if (isFocusable) {
    computedAttributes.tabIndex = 0;
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === KeyCode.space) {
      event.preventDefault();
      onSelectDate(date);
    }
  };

  return (
    <div
      className={classNames}
      aria-label={labels.join('. ')}
      data-date={formatDate(date)}
      role="button"
      {...computedAttributes}
      ref={isFocusedDate ? focusedDateRef : undefined}
      onKeyDown={onKeyDown}
      {...focusVisible}
    >
      <span className={styles['day-inner']}>{date.getDate()}</span>
    </div>
  );
}
