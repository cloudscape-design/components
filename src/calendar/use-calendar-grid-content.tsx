// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';
import { normalizeStartOfWeek } from '../internal/utils/locale';
import { getCalendarMonth } from 'mnth';
import ScreenreaderOnly from '../internal/components/screenreader-only/index.js';
import { renderDayName } from './utils/intl';

export default function useCalendarGridContent({
  baseDate,
  locale,
  startOfWeek,
}: {
  baseDate: Date;
  locale: string;
  startOfWeek?: number;
}) {
  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, locale);

  const rows = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: normalizedStartOfWeek }),
    [baseDate, normalizedStartOfWeek]
  );

  const header = (
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
