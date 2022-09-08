// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Extracts timezone offset from ISO8601 date string.
 */
export function parseTimezoneOffset(isoDate: string): number {
  const [, time = ''] = isoDate.split('T');
  const [, signCharacter, offsetPart] = time.split(/(-|\+)/);

  if (signCharacter && offsetPart) {
    const [offsetHours, offsetMinutes] = offsetPart.split(':');
    return Number(signCharacter + '1') * (Number(offsetHours) * 60 + Number(offsetMinutes));
  }

  const utcTimezoneIndicator = isoDate.indexOf('Z');
  if (utcTimezoneIndicator !== -1) {
    return 0;
  }

  const date = new Date(isoDate);
  return 0 - date.getTimezoneOffset();
}
