// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { format, isValid, parseISO } from 'date-fns';

import { formatTimeOffsetISO } from './format-time-offset';

function isValidFormatDateIsoStr(dateStr: string): boolean {
  if (dateStr.includes('T') || dateStr.length > 4) {
    try {
      const date = parseISO(dateStr);
      return isValid(date);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  } else {
    return !isNaN(Number(dateStr));
  }
}

/**
 * Converts a date string to ISO format, with special handling for short year inputs
 * @param dateStr Date string to convert
 * @returns A string in ISO format (YYYY-MM-DD)
 */
export function updateShortDateStrings(dateStr: string): string {
  if (!isValidFormatDateIsoStr(dateStr)) {
    return '2001-01-01';
  }
  // Check if input is just digits (potential year)
  if (/^\d{1,3}$/.test(dateStr)) {
    // Convert 1, 2 or 3 digit years to 2000+year
    const year = 2000 + parseInt(dateStr, 10);
    return `${year}-01-01`;
  } else if (/^\d{4}$/.test(dateStr)) {
    // 4 digit years
    return `${dateStr}-01-01`;
  }
  // Return as is if it's already in ISO format or another format
  return dateStr;
}

/**
 * Formats a date string in ISO format with optional time offset
 *
 * @param {Object} params - Function parameters
 * @param {string} params.date - ISO date string to format
 * @param {boolean} [params.hideTimeOffset] - When true, time offset will not be included
 * @param {boolean} params.isDateOnly - When true, formats as date only (no time offset)
 * @param {boolean} params.isMonthOnly - When true, formats as year and month only (yyyy-MM)
 * @param {number} [params.timeOffset] - Optional time offset in minutes to apply
 * @returns {string} Formatted date string in ISO format
 */
export function formatDateIso({
  date: isoDate,
  hideTimeOffset,
  isDateOnly,
  timeOffset,
  isMonthOnly,
}: {
  date: string;
  hideTimeOffset?: boolean;
  isDateOnly: boolean;
  isMonthOnly: boolean;
  timeOffset?: number;
}) {
  const updatedIsoDate = updateShortDateStrings(isoDate);

  // Calculate time offset string or empty string if offset should be hidden
  const formattedOffset =
    hideTimeOffset || isDateOnly || isMonthOnly ? '' : formatTimeOffsetISO(updatedIsoDate, timeOffset);
  // For month-only format, return just year and month
  if (isMonthOnly) {
    return format(parseISO(updatedIsoDate), 'yyyy-MM');
  }

  // Return the ISO date with optional time offset
  return updatedIsoDate + formattedOffset;
}
