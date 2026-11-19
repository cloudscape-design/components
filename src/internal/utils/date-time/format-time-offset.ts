// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { padLeftZeros } from '../strings';

/**
 * Formats timezone offset values used in for APIs, maintaining backward compatibility. Always
 * returns "+HH:MM" format, even for UTC ("+00:00"). Used by onChange events to preserve existing
 * API behavior.
 */
export function formatTimeOffsetISOInternal(isoDate: string, offsetInMinutes?: number) {
  offsetInMinutes = defaultToLocal(isoDate, offsetInMinutes);
  const { hours, minutes } = getMinutesAndHours(offsetInMinutes);

  const sign = offsetInMinutes < 0 ? '-' : '+';
  const formattedOffset = `${sign}${formatISO2Digits(hours)}:${formatISO2Digits(minutes)}`;

  return formattedOffset;
}

/**
 * Formats timezone offset for display purposes using succinct UTC notation.
 * Returns "Z" for UTC, "+HH:MM" for other offsets.
 * Used for visual display in components like date-range-picker trigger text.
 */
export function formatTimeOffsetISO(isoDate: string, offsetInMinutes?: number) {
  offsetInMinutes = defaultToLocal(isoDate, offsetInMinutes);
  if (offsetInMinutes === 0) {
    return 'Z';
  }
  const { hours, minutes } = getMinutesAndHours(offsetInMinutes);

  const sign = offsetInMinutes < 0 ? '-' : '+';
  const formattedOffset = `${sign}${formatISO2Digits(hours)}:${formatISO2Digits(minutes)}`;

  return formattedOffset;
}

export function formatTimeOffsetLocalized(isoDate: string, offsetInMinutes?: number) {
  offsetInMinutes = defaultToLocal(isoDate, offsetInMinutes);
  if (offsetInMinutes === 0) {
    return '(UTC)';
  }
  const { hours, minutes } = getMinutesAndHours(offsetInMinutes);

  const sign = offsetInMinutes < 0 ? '-' : '+';
  const formattedMinutes = minutes === 0 ? '' : `:${minutes}`;
  const formattedOffset = `(UTC${sign}${hours}${formattedMinutes})`;

  return formattedOffset;
}

function defaultToLocal(isoDate: string, offsetInMinutes?: number) {
  return offsetInMinutes ?? 0 - new Date(isoDate).getTimezoneOffset();
}

function getMinutesAndHours(minutes: number) {
  return { hours: Math.floor(Math.abs(minutes) / 60), minutes: Math.abs(minutes % 60) };
}

function formatISO2Digits(n: number) {
  return padLeftZeros(n.toFixed(0), 2);
}
