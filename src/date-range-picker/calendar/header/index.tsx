// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { add } from 'date-fns';

import { CalendarProps } from '../../../calendar/interfaces';
import { renderMonthAndYear, renderYear } from '../../../calendar/utils/intl';
import { useInternalI18n } from '../../../i18n/context.js';
import InternalLiveRegion from '../../../live-region/internal';
import { NextPageButton, PrevPageButton } from './header-button';

import styles from '../../styles.css.js';

interface CalendarHeaderProps {
  baseDate: Date;
  locale: string;
  onChangePage: (date: Date) => void;
  previousPageLabel?: string;
  nextPageLabel?: string;
  isSingleGrid: boolean;
  headingIdPrefix: string;
  granularity?: CalendarProps.Granularity;
}

export default function CalendarHeader({
  baseDate,
  locale,
  onChangePage,
  previousPageLabel,
  nextPageLabel,
  isSingleGrid,
  headingIdPrefix,
  granularity = 'day',
}: CalendarHeaderProps) {
  const i18n = useInternalI18n('calendar');
  const renderLabel = granularity === 'day' ? renderMonthAndYear : renderYear;
  const prevPageLabel = renderLabel(locale, add(baseDate, granularity === 'day' ? { months: -1 } : { years: -1 }));
  const currentPageLabel = renderLabel(locale, baseDate);
  const pageUnit = granularity === 'day' ? 'month' : 'year';

  return (
    <>
      <div className={styles['calendar-header']}>
        <PrevPageButton
          ariaLabel={i18n(
            granularity === 'day' ? 'previousMonthAriaLabel' : 'i18nStrings.previousYearAriaLabel',
            previousPageLabel
          )}
          baseDate={baseDate}
          onChangePage={onChangePage}
        />
        <h2 className={styles['calendar-header-months-wrapper']}>
          {!isSingleGrid && (
            <span className={styles['calendar-header-month']} id={`${headingIdPrefix}-prev${pageUnit}`}>
              {prevPageLabel}
            </span>
          )}
          <span className={styles['calendar-header-month']} id={`${headingIdPrefix}-current${pageUnit}`}>
            {currentPageLabel}
          </span>
        </h2>
        <NextPageButton
          ariaLabel={i18n(
            granularity === 'day' ? 'nextMonthAriaLabel' : 'i18nStrings.nextYearAriaLabel',
            nextPageLabel
          )}
          baseDate={baseDate}
          onChangePage={onChangePage}
        />
      </div>
      <InternalLiveRegion hidden={true}>
        {isSingleGrid ? currentPageLabel : `${prevPageLabel}, ${currentPageLabel}`}
      </InternalLiveRegion>
    </>
  );
}
