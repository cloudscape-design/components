// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CalendarProps } from '../../../calendar/interfaces';
import { padLeftZeros } from '../strings';

/**
 * Transforms Date's object date part to a string.
 *
 * We cannot use Date.toISOString because it produces GMT time where the date can be different than local.
 */
export function formatDate(value: Date, granularity: CalendarProps.Granularity = 'day'): string {
  const year = value.getFullYear();
  const month = padLeftZeros(`${value.getMonth() + 1}`, 2);
  if (granularity === 'month') {
    return `${year}-${month}`;
  }
  const date = padLeftZeros(`${value.getDate()}`, 2);
  return `${year}-${month}-${date}`;
}
