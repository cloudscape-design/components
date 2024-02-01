// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { padLeftZeros } from '../strings';

export function formatISOTimezoneOffset(isoDate: string, offsetInMinutes?: number) {
  offsetInMinutes = offsetInMinutes ?? 0 - new Date(isoDate).getTimezoneOffset();
  const hoursOffset = padLeftZeros(Math.floor(Math.abs(offsetInMinutes) / 60).toFixed(0), 2);
  const minuteOffset = padLeftZeros(Math.abs(offsetInMinutes % 60).toFixed(0), 2);

  const sign = offsetInMinutes < 0 ? '-' : '+';
  const formattedOffset = `${sign}${hoursOffset}:${minuteOffset}`;

  return formattedOffset;
}
