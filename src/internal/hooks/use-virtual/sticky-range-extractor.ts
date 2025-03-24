// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { defaultRangeExtractor } from '../../vendor/react-virtual';

interface Range {
  start: number;
  overscan: number;
  end: number;
  size: number;
}

export default function (range: Range) {
  const defaultRange = defaultRangeExtractor(range);
  return defaultRange[0] === 0 ? defaultRange : [0, ...defaultRange];
}
