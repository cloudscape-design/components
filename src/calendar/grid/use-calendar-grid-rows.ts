// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { getCalendarMonthWithSixRows, getCalendarYear } from '../../internal/utils/date-time/calendar.js';
import { normalizeStartOfWeek } from '../../internal/utils/locale/index.js';
import { CalendarProps } from '../interfaces.js';

export default function useCalendarGridRows({
  baseDate,
  granularity,
  locale,
  startOfWeek: rawStartOfWeek,
}: {
  baseDate: Date;
  granularity: CalendarProps.Granularity;
  locale: string;
  startOfWeek?: number;
}) {
  const isMonthPicker = granularity === 'month';

  const rows = useMemo<Date[][]>(() => {
    if (isMonthPicker) {
      return getCalendarYear(baseDate);
    } else {
      const startOfWeek = normalizeStartOfWeek(rawStartOfWeek, locale);
      return getCalendarMonthWithSixRows(baseDate, { startOfWeek, padDates: 'after' });
    }
  }, [baseDate, isMonthPicker, rawStartOfWeek, locale]);

  return rows;
}
