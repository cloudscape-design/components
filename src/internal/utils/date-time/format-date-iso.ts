// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';

import { formatTimeOffsetISO } from './format-time-offset';

export default function ({
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
  const formattedOffset = hideTimeOffset || isDateOnly || isMonthOnly ? '' : formatTimeOffsetISO(isoDate, timeOffset);
  if (isMonthOnly) {
    return dayjs(isoDate).format('YYYY-MM');
  }
  return isoDate + formattedOffset;
}
