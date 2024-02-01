// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatISOTimezoneOffset } from './format-timezone-offset';

export default function ({
  date: isoDate,
  hideTimeOffset,
  isDateOnly,
  timeOffset,
}: {
  date: string;
  hideTimeOffset?: boolean;
  isDateOnly: boolean;
  timeOffset?: number;
}) {
  const formattedOffset = hideTimeOffset || isDateOnly ? '' : formatISOTimezoneOffset(isoDate, timeOffset);
  return isoDate + formattedOffset;
}
