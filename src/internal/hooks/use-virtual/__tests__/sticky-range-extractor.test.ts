// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import stickyRangeExtractor from '.././../../../../lib/components/internal/hooks/use-virtual/sticky-range-extractor';

describe('stickyRangeExtractor', () => {
  test('prepends 0 to the range if it does not start with 0', () => {
    const initialRangeDefinition = { start: 10, end: 15, size: 50, overscan: 5 };
    const finalRange = stickyRangeExtractor(initialRangeDefinition);
    expect(finalRange).toEqual([0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  test('does not change anything if the generated range already starts with 0', () => {
    const initialRangeDefinition = { start: 0, end: 10, size: 50, overscan: 5 };
    const finalRange = stickyRangeExtractor(initialRangeDefinition);
    expect(finalRange).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });
});
