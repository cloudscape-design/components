// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { add } from 'date-fns';

import { CalendarProps } from '../../../calendar/interfaces';
import { renderMonthAndYear, renderYear } from '../../../calendar/utils/intl';
import { useInternalI18n } from '../../../i18n/context.js';
import InternalLiveRegion from '../../../live-region/internal';
import { NextPageButton, PrevPageButton } from './header-button';

import styles from '../../styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';

interface CalendarHeaderProps extends Pick<CalendarProps, 'granularity'> {
  baseDate: Date;
  locale: string;
  onChangePage: (n: number) => void;
  previousPageLabel?: string;
  nextPageLabel?: string;
  isSingleGrid: boolean;
  headingIdPrefix: string;
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
  const i18n = useInternalI18n('date-range-picker');
  const isMonthPicker = granularity === 'month';
  const renderLabel = isMonthPicker ? renderYear : renderMonthAndYear;
  const prevPageHeaderLabel = renderLabel(
    locale,
    add(baseDate, granularity === 'month' ? { years: -1 } : { months: -1 })
  );
  const currentPageHeaderLabel = renderLabel(locale, baseDate);
  const pageUnit = isMonthPicker ? 'year' : 'month';

  return (
    <>
      <div className={clsx(testutilStyles['calendar-header'], styles['calendar-header'])}>
        <PrevPageButton
          ariaLabel={i18n(
            isMonthPicker ? 'i18nStrings.previousYearAriaLabel' : 'i18nStrings.previousMonthAriaLabel',
            previousPageLabel
          )}
          onChangePage={onChangePage}
        />
        <h2 className={styles['calendar-header-pages-wrapper']}>
          {!isSingleGrid && (
            <span className={styles['calendar-header-page']} id={`${headingIdPrefix}-prev${pageUnit}`}>
              {prevPageHeaderLabel}
            </span>
          )}
          <span className={styles['calendar-header-page']} id={`${headingIdPrefix}-current${pageUnit}`}>
            {currentPageHeaderLabel}
          </span>
        </h2>
        <NextPageButton
          ariaLabel={i18n(
            isMonthPicker ? 'i18nStrings.nextYearAriaLabel' : 'i18nStrings.nextMonthAriaLabel',
            nextPageLabel
          )}
          onChangePage={onChangePage}
        />
      </div>
      <InternalLiveRegion hidden={true}>
        {isSingleGrid ? currentPageHeaderLabel : `${prevPageHeaderLabel}, ${currentPageHeaderLabel}`}
      </InternalLiveRegion>
    </>
  );
}
