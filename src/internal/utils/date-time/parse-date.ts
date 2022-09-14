// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Parses date string and returns Date object or null.
 *
 * We cannot use new Date(string) constructor, because it produces GMT time that may have different date than the local.
 */
export function parseDate(value: string): Date;
export function parseDate(value: string, strict: boolean): Date | null;
export function parseDate(value: string, strict = false): Date | null {
  const [yearString, monthString, dayString] = value.split('-');

  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (strict) {
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null;
    }
  }

  return new Date(year, (month || 1) - 1, day || 1);
}
