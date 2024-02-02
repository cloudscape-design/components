// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from '../styles.css.js';
import { renderMonthAndYear } from '../utils/intl';
import { HeaderPrevButton, HeaderNextButton } from './header-button';

interface CalendarHeaderProps {
  baseDate: Date;
  locale: string;
  onChange: (date: Date) => void;
  previousLabel?: string;
  nextLabel?: string;
  headingId: string;
  granularity?: 'month' | 'day';
}

const CalendarHeader = ({
  baseDate,
  locale,
  onChange,
  previousLabel: previousMonthLabel,
  nextLabel: nextMonthLabel,
  headingId,
  granularity,
}: CalendarHeaderProps) => {
  return (
    <div className={styles['calendar-header']}>
      <HeaderPrevButton
        ariaLabel={previousMonthLabel}
        baseDate={baseDate}
        onChange={onChange}
        granularity={granularity}
      />
      <h2 className={styles['calendar-header-title']} id={headingId}>
        {granularity === 'month' ? baseDate.getFullYear() : renderMonthAndYear(locale, baseDate)}
      </h2>
      <HeaderNextButton ariaLabel={nextMonthLabel} baseDate={baseDate} onChange={onChange} granularity={granularity} />
    </div>
  );
};

export default CalendarHeader;
