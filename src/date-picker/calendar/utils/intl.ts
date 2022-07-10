// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DayIndex } from '../index';
import { TimeInputProps } from '../../../time-input/interfaces';

function setDayIndex(date: Date, dayIndex: DayIndex): void {
  const diff = dayIndex - date.getDay();
  date.setDate(date.getDate() + diff);
}

export function renderDayName(locale: string, dayIndex: DayIndex): string {
  const tempDate = new Date();
  setDayIndex(tempDate, dayIndex);
  return tempDate.toLocaleDateString(locale, { weekday: 'short' });
}

export function renderMonthAndYear(locale: string, baseDate: Date): string {
  const result = baseDate.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });

  return result;
}

/*
 `toLocaleDateString` is expensive (10+ ms) to calculate in IE11.
*/
const dayLabelCache = new Map<string, string>();
export function getDateLabel(locale: string, date: Date): string;
export function getDateLabel(locale: string, date: Date | null): string | null;
export function getDateLabel(locale: string, date: Date | null): string | null {
  if (!date) {
    return null;
  }

  const cacheKey = locale + date.getTime();
  const cachedValue = dayLabelCache.get(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }
  const value = date.toLocaleDateString(locale, {
    weekday: 'long',
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
