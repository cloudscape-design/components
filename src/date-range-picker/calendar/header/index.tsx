// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { add } from 'date-fns';

import { renderMonthAndYear } from '../../../calendar/utils/intl';
import { useInternalI18n } from '../../../i18n/context.js';
import InternalLiveRegion from '../../../live-region/internal';
import { NextMonthButton, PrevMonthButton } from './header-button';

import styles from '../../styles.css.js';

interface CalendarHeaderProps {
  baseDate: Date;
  locale: string;
  onChangeMonth: (date: Date) => void;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
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
  const i18n = useInternalI18n('calendar');
  const prevMonthLabel = renderMonthAndYear(locale, add(baseDate, { months: -1 }));
  const currentMonthLabel = renderMonthAndYear(locale, baseDate);

  return (
    <>
      <div className={styles['calendar-header']}>
        <PrevMonthButton
          ariaLabel={i18n('previousMonthAriaLabel', previousMonthLabel)}
          baseDate={baseDate}
          onChangeMonth={onChangeMonth}
        />
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
        <NextMonthButton
          ariaLabel={i18n('nextMonthAriaLabel', nextMonthLabel)}
          baseDate={baseDate}
          onChangeMonth={onChangeMonth}
        />
      </div>
      <InternalLiveRegion hidden={true}>
        {isSingleGrid ? currentMonthLabel : `${prevMonthLabel}, ${currentMonthLabel}`}
      </InternalLiveRegion>
    </>
  );
}
