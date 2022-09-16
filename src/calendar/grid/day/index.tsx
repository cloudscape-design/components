// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from '../../styles.css.js';
import { DatePickerProps } from '../../../date-picker/interfaces';
import { isSameDay, isSameMonth } from 'date-fns';
import { getDateLabel } from '../../utils/intl';
import clsx from 'clsx';
import useFocusVisible from '../../../internal/hooks/focus-visible/index.js';

interface GridDayProps {
  locale: string;
  baseDate: Date;
  date: Date;
  selectedDate?: Date | null;
  focusedDate: Date | null;
  isDateEnabled?: DatePickerProps.IsDateEnabledFunction;
  todayAriaLabel: string;
  onSelectDate: (date: Date) => void;
}

export default function GridDay({
  locale,
  baseDate,
  date,
  selectedDate,
  focusedDate,
  isDateEnabled,
  todayAriaLabel,
  onSelectDate,
}: GridDayProps) {
  const labels = [getDateLabel(locale, date)];
  const isFocusable = !!focusedDate && isSameDay(date, focusedDate);
  const isSelected = !!selectedDate && isSameDay(date, selectedDate);
  const isEnabled = !isDateEnabled || isDateEnabled(date);
  const isDateOnSameDay = isSameDay(date, new Date());
  const computedAttributes: React.HTMLAttributes<HTMLDivElement> = {};
  const classNames = clsx(styles['calendar-day'], {
    [styles['calendar-day-current-month']]: isSameMonth(date, baseDate),
    [styles['calendar-day-enabled']]: isEnabled,
    [styles['calendar-day-selected']]: isSelected,
    [styles['calendar-day-today']]: isDateOnSameDay,
    [styles['calendar-day-focusable']]: isFocusable && isEnabled,
  });
  const focusVisible = useFocusVisible();

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
    <div className={classNames} aria-label={labels.join('. ')} role="button" {...computedAttributes} {...focusVisible}>
      <span className={styles['day-inner']}>{date.getDate()}</span>
    </div>
  );
}
