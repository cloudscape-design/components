// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from '../styles.css.js';
import { renderMonthAndYear } from '../utils/intl';
import { HeaderPrevButton, HeaderNextButton } from './header-button';
import { CalendarProps } from '../interfaces.js';
import { addMonths, addYears } from 'date-fns';

interface CalendarHeaderProps {
  baseDate: Date;
  locale: string;
  onChange: (date: Date) => void;
  previousLabel?: string;
  nextLabel?: string;
  headingId: string;
  granularity?: CalendarProps.Granularity;
}

const CalendarHeader = ({
  baseDate,
  locale,
  onChange,
  previousLabel,
  nextLabel,
  headingId,
  granularity,
}: CalendarHeaderProps) => {
  const isMonthPicker = granularity === 'month';
  const moveDate = isMonthPicker ? addYears : addMonths;
  const formattedDate = isMonthPicker ? baseDate.getFullYear() : renderMonthAndYear(locale, baseDate);
  return (
    <div className={styles['calendar-header']}>
      <HeaderPrevButton ariaLabel={previousLabel} onClick={() => onChange(moveDate(baseDate, -1))} />
      <h2 className={styles['calendar-header-title']} id={headingId}>
        {formattedDate}
      </h2>
      <HeaderNextButton ariaLabel={nextLabel} onClick={() => onChange(moveDate(baseDate, -1))} />
    </div>
  );
};

export default CalendarHeader;
