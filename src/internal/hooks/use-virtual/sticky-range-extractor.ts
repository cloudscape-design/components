// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { defaultRangeExtractor, Range } from '../../vendor/react-virtual';

export default function (range: Range) {
  const defaultRange = defaultRangeExtractor(range);
  return defaultRange[0] === 0 ? defaultRange : [0, ...defaultRange];
}
