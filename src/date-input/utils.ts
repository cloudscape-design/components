// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getDaysInMonth } from 'date-fns';

import { CalendarProps } from '../calendar/interfaces';
import { MaskArgs } from '../internal/components/masked-input/utils/mask-format';
import { displayToIso, parseDate } from '../internal/utils/date-time';

const yearMask = { min: 0, max: 9999, default: 2000, length: 4 };
const monthMask = { min: 1, max: 12, length: 2 };
const dayMask = { min: 1, max: getMaxDaysForDate, length: 2 };

function getMaxDaysForDate(value: string): number {
  // Forcing to first day in month to ensure the correct month is used in case the date is incorrect.
  // For example, the date '2018-02-30' is parsed as '2018-03-02' (because there is only 28 days in February 2018).
  const baseDate = displayToIso(value).substring(0, 7);
  return getDaysInMonth(parseDate(baseDate));
}

export interface GenerateMaskArgsProps extends Pick<CalendarProps, 'granularity'> {
  isIso?: boolean;
}

export const generateMaskArgs = ({
  granularity = 'day',
  /**
   * There are only two options, 'iso' and 'slashed' which is our current default format. If more formats are entered
   * we should take the formatting type rather than the boolean when we make an update.
   */
  isIso = false,
}: GenerateMaskArgsProps = {}): MaskArgs => {
  return {
    separator: isIso ? '-' : '/',
    inputSeparators: isIso ? ['/', '.', ' '] : ['-', '.', ' '],
    segments: granularity === 'month' ? [yearMask, monthMask] : [yearMask, monthMask, dayMask],
  };
};

/**
 * Normalizes a partial ISO date string by trimming incomplete segments.
 *
 * @param dateString - The date string to normalize (e.g., "2012-", "2012-0", "2012-01-3").
 * @param granularity - The level of detail required ('month' or 'day').
 * @returns a properly formatted date string or empty string, if invalid.
 */
export function normalizeIsoDateString(dateString: string, granularity: CalendarProps.Granularity): string {
  if (!dateString) {
    return '';
  }
  const match = dateString.match(/^(\d{4})(?:-(\d{1,2})?)?(?:-(\d{1,2})?)?$/);
  if (!match) {
    return '';
  }
  const [, year, month, day] = match;
  if (granularity === 'day' && month?.length === 2 && day?.length === 2) {
    return `${year}-${month}-${day}`;
  }
  if (month?.length === 2) {
    return `${year}-${month}`;
  }
  return year;
}
