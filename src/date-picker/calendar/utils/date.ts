// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const isoToDisplay = (value: string) => value.replace(/-/g, '/');
export const displayToIso = (value: string) => value.replace(/\//g, '-');

export const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const padLeftZeros = (value: string, length: number) => {
  while (value.length < length) {
    value = `0${value}`;
  }
  return value;
};

// we cannot use new Date(string) constructor, because it produces GMT time that may have different date than the local
export function parseDate(value: string): Date;
export function parseDate(value: string, strict: boolean): Date | null;
export function parseDate(value: string, strict = false): Date | null {
  const [year, month, day] = value.split('-');

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (strict) {
    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return null;
    }
  }

  return new Date(y, (m || 1) - 1, d || 1);
}

// we cannot use Date.toISOString because it produces GMT time where the date can be different than local
export const formatDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = padLeftZeros(`${value.getMonth() + 1}`, 2);
  const date = padLeftZeros(`${value.getDate()}`, 2);
  return `${year}-${month}-${date}`;
};

export const formatTime = (value: Date): string => {
  const hours = padLeftZeros(`${value.getHours()}`, 2);
  const minutes = padLeftZeros(`${value.getMinutes()}`, 2);
  const seconds = padLeftZeros(`${value.getSeconds()}`, 2);
  return `${hours}:${minutes}:${seconds}`;
};

export function formatISOStringWithoutTimezone(dateString: string, timeString: string) {
  return `${dateString}T${timeString}`;
}

// reuse date instances, to allow shallow equality checking
const memoCache: Record<string, Date> = {};
export const memoizedDate = (key: string, date: string | null) => {
  const parsed = date && date.length >= 4 && parseDate(date);
  if (!(memoCache[key] && parsed && memoCache[key].getTime() === parsed.getTime())) {
    memoCache[key] = parsed as Date;
  }
  return memoCache[key];
};
