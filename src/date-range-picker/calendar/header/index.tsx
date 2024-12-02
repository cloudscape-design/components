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
  onChangePage: (n: number) => void;
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
  const isMonthPicker = granularity === 'month';
  const renderLabel = isMonthPicker ? renderYear : renderMonthAndYear;
  const prevPageLabel = renderLabel(locale, add(baseDate, granularity === 'month' ? { years: -1 } : { months: -1 }));
  const currentPageLabel = renderLabel(locale, baseDate);
  const pageUnit = isMonthPicker ? 'year' : 'month';

  return (
    <>
      <div className={styles['calendar-header']}>
        <PrevPageButton
          ariaLabel={i18n(
            isMonthPicker ? 'i18nStrings.previousYearAriaLabel' : 'previousMonthAriaLabel',
            previousPageLabel
          )}
          onChangePage={onChangePage}
        />
        <h2 className={styles['calendar-header-pages-wrapper']}>
          {!isSingleGrid && (
            <span className={styles['calendar-header-page']} id={`${headingIdPrefix}-prev${pageUnit}`}>
              {prevPageLabel}
            </span>
          )}
          <span className={styles['calendar-header-page']} id={`${headingIdPrefix}-current${pageUnit}`}>
            {currentPageLabel}
          </span>
        </h2>
        <NextPageButton
          ariaLabel={i18n(isMonthPicker ? 'i18nStrings.nextYearAriaLabel' : 'nextMonthAriaLabel', nextPageLabel)}
          onChangePage={onChangePage}
        />
      </div>
      <InternalLiveRegion hidden={true}>
        {isSingleGrid ? currentPageLabel : `${prevPageLabel}, ${currentPageLabel}`}
      </InternalLiveRegion>
    </>
  );
}
