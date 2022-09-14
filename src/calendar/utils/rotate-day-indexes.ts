// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DayIndex } from '../internal';

const days: DayIndex[] = [0, 1, 2, 3, 4, 5, 6];

// Given a start day of week, return an array of day indexes starting at that given day.
export default function rotateDayIndexes(startOfWeek: DayIndex): DayIndex[] {
  function mapDay(_: DayIndex, i: number): DayIndex {
    return days[(i + startOfWeek) % 7];
  }

  return days.map(mapDay);
}
