// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from '../../styles.css.js';
import { renderMonthAndYear } from '../utils/intl';
import HeaderButton from './button';

interface CalendarHeaderProps {
  headerId: string;
  baseDate: Date;
  locale: string;
  onChangeMonth: (prev?: boolean) => void;
  previousMonthLabel: string;
  nextMonthLabel: string;
  calendarHasFocus: boolean;
}

const CalendarHeader = ({
  headerId,
  baseDate,
  locale,
  onChangeMonth,
  previousMonthLabel,
  nextMonthLabel,
  calendarHasFocus,
}: CalendarHeaderProps) => {
  return (
    <div className={styles['calendar-header']}>
      <HeaderButton
        ariaLabel={previousMonthLabel}
        isPrevious={true}
        onChangeMonth={onChangeMonth}
        focusable={calendarHasFocus}
      />
      <div className={styles['calendar-header-month']} id={headerId} aria-live="polite">
        {renderMonthAndYear(locale, baseDate)}
      </div>
      <HeaderButton
        ariaLabel={nextMonthLabel}
        isPrevious={false}
        onChangeMonth={onChangeMonth}
        focusable={calendarHasFocus}
      />
    </div>
  );
};

export default CalendarHeader;
