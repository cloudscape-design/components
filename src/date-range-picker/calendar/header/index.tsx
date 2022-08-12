// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { add } from 'date-fns';
import React from 'react';
import styles from '../../styles.css.js';
import { renderMonthAndYear } from '../../../date-picker/calendar/utils/intl';
import HeaderButton from './button';

interface CalendarHeaderProps {
  baseDate: Date;
  locale: string;
  onChangeMonth: (prev?: boolean) => void;
  previousMonthLabel: string;
  nextMonthLabel: string;
  isSingleGrid: boolean;
}

const CalendarHeader = ({
  baseDate,
  locale,
  onChangeMonth,
  previousMonthLabel,
  nextMonthLabel,
  isSingleGrid,
}: CalendarHeaderProps) => {
  return (
    <div className={styles['calendar-header']}>
      <HeaderButton ariaLabel={previousMonthLabel} isPrevious={true} onChangeMonth={onChangeMonth} />
      <div aria-live="polite" className={styles['calendar-header-months-wrapper']}>
        {!isSingleGrid && (
          <div className={styles['calendar-header-month']}>
            {renderMonthAndYear(locale, add(baseDate, { months: -1 }))}
          </div>
        )}
        <div className={styles['calendar-header-month']}>{renderMonthAndYear(locale, baseDate)}</div>
      </div>
      <HeaderButton ariaLabel={nextMonthLabel} isPrevious={false} onChangeMonth={onChangeMonth} />
    </div>
  );
};

export default CalendarHeader;
