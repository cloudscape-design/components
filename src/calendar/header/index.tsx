// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from '../styles.css.js';
import { renderMonthAndYear } from '../utils/intl';
import { PrevMonthButton, NextMonthButton } from './header-button';

interface CalendarHeaderProps {
  baseDate: Date;
  locale: string;
  onChangeMonth: (date: Date) => void;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  headingId: string;
}

const CalendarHeader = ({
  baseDate,
  locale,
  onChangeMonth,
  previousMonthLabel,
  nextMonthLabel,
  headingId,
}: CalendarHeaderProps) => {
  return (
    <div className={styles['calendar-header']}>
      <PrevMonthButton ariaLabel={previousMonthLabel} baseDate={baseDate} onChangeMonth={onChangeMonth} />
      <h2 className={styles['calendar-header-month']} id={headingId}>
        {renderMonthAndYear(locale, baseDate)}
      </h2>
      <NextMonthButton ariaLabel={nextMonthLabel} baseDate={baseDate} onChangeMonth={onChangeMonth} />
    </div>
  );
};

export default CalendarHeader;
