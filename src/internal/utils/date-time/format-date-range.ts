// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatTimezoneOffset } from './format-timezone-offset';
import { isIsoDateOnly } from './is-iso-date-only';

export function formatDateRange(startDate: string, endDate: string, timeOffset?: number): string {
  const isDateOnly = isIsoDateOnly(startDate) && isIsoDateOnly(endDate);
  const formattedStartOffset = isDateOnly ? '' : formatTimezoneOffset(startDate, timeOffset);
  const formattedEndOffset = isDateOnly ? '' : formatTimezoneOffset(endDate, timeOffset);
  return startDate + formattedStartOffset + ' ' + '—' + ' ' + endDate + formattedEndOffset;
}
