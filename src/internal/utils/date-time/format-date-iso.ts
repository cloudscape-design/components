// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
  //todo  what about granularity of a month
  const formattedOffset = hideTimeOffset || isDateOnly || isMonthOnly ? '' : formatTimeOffsetISO(isoDate, timeOffset);
  return isoDate + formattedOffset;
}
