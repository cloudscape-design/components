// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { normalizeStartOfWeek } from '../../internal/utils/locale/index.js';
import { getCalendarMonth } from 'mnth';

export default function useCalendarGridRows({
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

  return rows;
}
