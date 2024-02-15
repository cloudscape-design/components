// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { renderDayName } from '../utils/intl';
import styles from '../styles.css.js';

export default function CalendarGridHeader({ locale, rows }: { locale: string; rows: Date[][] }) {
  return (
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
}
