// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from '../../../styles.css.js';
import { DatePickerProps } from '../../../interfaces';
import { isSameDay, isSameMonth } from 'date-fns';
import { renderDayLabel } from '../../utils/intl';
import clsx from 'clsx';

interface GridDayProps {
  locale: string;
  baseDate: Date;
  date: Date;
  selectedDate?: Date | null;
  focusedDate: Date | null;
  isDateEnabled?: DatePickerProps.IsDateEnabledFunction;
  todayAriaLabel: string;
  onSelectDate: (date: Date) => void;
  isDateInLastWeek: boolean;
}

const GridDay = ({
  locale,
  baseDate,
  date,
  selectedDate,
  focusedDate,
  isDateEnabled,
  todayAriaLabel,
  onSelectDate,
  isDateInLastWeek,
}: GridDayProps) => {
  const labels = [renderDayLabel(locale, date)];
  const isFocusable = !!focusedDate && isSameDay(date, focusedDate);
  const isSelected = !!selectedDate && isSameDay(date, selectedDate);
  const isEnabled = !isDateEnabled || isDateEnabled(date);
  const isDateOnSameDay = isSameDay(date, new Date());
  const computedAttributes: React.HTMLAttributes<HTMLDivElement> = {};
  const classNames = clsx(styles['calendar-day'], {
    [styles['calendar-day-in-last-week']]: isDateInLastWeek,
    [styles['calendar-day-current-month']]: isSameMonth(date, baseDate),
    [styles['calendar-day-enabled']]: isEnabled,
    [styles['calendar-day-selected']]: isSelected,
    [styles['calendar-day-today']]: isDateOnSameDay,
    [styles['calendar-day-focusable']]: isFocusable && isEnabled,
  });

  if (isSelected) {
    computedAttributes['aria-current'] = 'date';
  }

  if (isDateOnSameDay) {
    labels.push(todayAriaLabel);
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
    <div className={classNames} aria-label={labels.join('. ')} role="button" {...computedAttributes}>
      <span className={styles['day-inner']}>{date.getDate()}</span>
    </div>
  );
};

export default GridDay;
