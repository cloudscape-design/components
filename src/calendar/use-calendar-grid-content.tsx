// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';
import { CalendarProps } from './interfaces';
import { normalizeStartOfWeek } from '../internal/utils/locale';
import { getCalendarMonth } from 'mnth';
import ScreenreaderOnly from '../internal/components/screenreader-only/index.js';
import { renderDayName } from './utils/intl';

export default function useCalendarGridContent({
  baseDate,
  granularity,
  locale,
  startOfWeek,
}: {
  baseDate: Date;
  granularity: CalendarProps.Granularity;
  locale: string;
  startOfWeek?: number;
}) {
  const isMonthPicker = granularity === 'month';

  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, locale);

  const rows = useMemo<Date[][]>(
    () =>
      isMonthPicker
        ? new Array(4).fill(0).map((_, i: number) =>
            new Array(3).fill(0).map((_, j: number) => {
              const d = new Date(baseDate);
              d.setMonth(i * 3 + j);
              return d;
            })
          )
        : getCalendarMonth(baseDate, { firstDayOfWeek: normalizedStartOfWeek }),
    [baseDate, isMonthPicker, normalizedStartOfWeek]
  );

  const header = isMonthPicker ? null : (
    <thead>
      <tr>
        {rows[0]
          .map(date => date.getDay())
          .map(dayIndex => (
            <th
              key={dayIndex}
              scope="col"
              className={clsx(styles['calendar-grid-cell'], styles['calendar-date-header'])}
            >
              <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
              <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
            </th>
          ))}
      </tr>
    </thead>
  );

  return { header, rows };
}
