// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { normalizeStartOfWeek } from '../../internal/utils/locale/index.js';
import { getCalendarMonth } from 'mnth';
import { CalendarProps } from '../interfaces.js';

export default function useCalendarGridRows({
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

  const rows = useMemo<Date[][]>(
    () =>
      isMonthPicker
        ? getCalendarYear(baseDate)
        : getCalendarMonth(baseDate, { firstDayOfWeek: normalizeStartOfWeek(startOfWeek, locale) }),
    [baseDate, isMonthPicker, startOfWeek, locale]
  );

  return rows;
}

// Returns a 3-by-4 matrix with dates corresponding to the initial date-time of each month of the year for a given date.
function getCalendarYear(date: Date): Date[][] {
  const year = date.getFullYear();
  return new Array(4).fill(0).map((_, i: number) =>
    new Array(3).fill(0).map((_, j: number) => {
      const d = new Date(year, i * 3 + j);
      return d;
    })
  );
}
