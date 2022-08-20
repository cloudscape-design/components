// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getBrowserTimezoneOffset } from './get-browser-timezone-offset';

/**
 * Extracts timezone offset from ISO8601 date string.
 */
export function parseTimezoneOffset(date: string): number {
  const [, time] = date.split('T');
  const [, signCharacter, offsetPart] = time.split(/(-|\+)/);

  if (signCharacter && offsetPart) {
    const [offsetHours, offsetMinutes] = offsetPart.split(':');
    return Number(signCharacter + '1') * (Number(offsetHours) * 60 + Number(offsetMinutes));
  }

  const utcTimezoneIndicator = date.indexOf('Z');
  if (utcTimezoneIndicator !== -1) {
    return 0;
  }

  return getBrowserTimezoneOffset();
}
