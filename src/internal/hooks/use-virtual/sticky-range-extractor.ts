// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

interface Range {
  start: number;
  overscan: number;
  end: number;
  size: number;
}

export default function (range: Range) {
  const defaultRange = [];
  const start = Math.max(range.start - range.overscan, 0);
  const end = Math.min(range.end + range.overscan, range.size - 1);

  for (let i = start; i <= end; i++) {
    defaultRange.push(i);
  }

  return defaultRange[0] === 0 ? defaultRange : [0, ...defaultRange];
}
