// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { add } from 'date-fns';
import React from 'react';
import styles from '../../styles.css.js';
import { renderMonthAndYear } from '../../../calendar/utils/intl';
import { PrevMonthButton, NextMonthButton } from './header-button';
import LiveRegion from '../../../internal/components/live-region';

interface CalendarHeaderProps {
  baseDate: Date;
  locale: string;
  onChangeMonth: (date: Date) => void;
  previousMonthLabel: string;
  nextMonthLabel: string;
  isSingleGrid: boolean;
  headingIdPrefix: string;
}

export default function CalendarHeader({
  baseDate,
  locale,
  onChangeMonth,
  previousMonthLabel,
  nextMonthLabel,
  isSingleGrid,
  headingIdPrefix,
}: CalendarHeaderProps) {
  const prevMonthLabel = renderMonthAndYear(locale, add(baseDate, { months: -1 }));
  const currentMonthLabel = renderMonthAndYear(locale, baseDate);

  return (
    <>
      <div className={styles['calendar-header']}>
        <PrevMonthButton ariaLabel={previousMonthLabel} baseDate={baseDate} onChangeMonth={onChangeMonth} />
        <h2 className={styles['calendar-header-months-wrapper']}>
          {!isSingleGrid && (
            <span className={styles['calendar-header-month']} id={`${headingIdPrefix}-prevmonth`}>
              {prevMonthLabel}
            </span>
          )}
          <span className={styles['calendar-header-month']} id={`${headingIdPrefix}-currentmonth`}>
            {currentMonthLabel}
          </span>
        </h2>
        <NextMonthButton ariaLabel={nextMonthLabel} baseDate={baseDate} onChangeMonth={onChangeMonth} />
      </div>
      <LiveRegion>{isSingleGrid ? currentMonthLabel : `${prevMonthLabel}, ${currentMonthLabel}`}</LiveRegion>
    </>
  );
}
