// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TimeInputProps } from '../../time-input/interfaces';

function setDayIndex(date: Date, dayIndex: number): void {
  const diff = dayIndex - date.getDay();
  date.setDate(date.getDate() + diff);
}

export function renderDayName(locale: string, dayIndex: number, mode: 'short' | 'long'): string {
  const tempDate = new Date();
  setDayIndex(tempDate, dayIndex);
  return tempDate.toLocaleDateString(locale, { weekday: mode });
}

export function renderMonthAndYear(locale: string, baseDate: Date): string {
  const result = baseDate.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });

  return result;
}

export function renderYear(locale: string, date: Date): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
  });
}

/*
 `toLocaleDateString` is expensive (10+ ms) to calculate in IE11.
*/
const dayLabelCache = new Map<string, string>();
export function getDateLabel(locale: string, date: Date, mode: 'full' | 'short' = 'full'): string {
  const cacheKey = locale + date.getTime() + mode;
  const cachedValue = dayLabelCache.get(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }
  const value = date.toLocaleDateString(locale, {
    weekday: mode === 'full' ? 'long' : undefined,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  dayLabelCache.set(cacheKey, value);
  return value;
}

export function renderTimeLabel(locale: string, date: Date, format?: TimeInputProps.Format): string {
  let options: Intl.DateTimeFormatOptions = {};
  if (format === 'hh') {
    options = { hour: '2-digit' };
  }
  if (format === 'hh:mm') {
    options = { hour: '2-digit', minute: '2-digit' };
  }
  const value = date.toLocaleTimeString(locale, options);
  return value;
}
