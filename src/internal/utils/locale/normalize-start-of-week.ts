// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getWeekStartByLocale } from 'weekstart';

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function normalizeStartOfWeek(startOfWeek: number | undefined, locale: string) {
  return (typeof startOfWeek === 'number' ? startOfWeek % 7 : getWeekStartByLocale(locale)) as DayIndex;
}
