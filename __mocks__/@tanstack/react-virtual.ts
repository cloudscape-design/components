// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { range } from 'lodash';
import { useEffect } from 'react';

export const scrollToIndex = jest.fn();
export const measureElement = jest.fn();

export function useVirtualizer({
  count,
  getScrollElement,
  estimateSize,
}: {
  count: number;
  getScrollElement: () => null | HTMLElement;
  estimateSize?: () => number;
}) {
  useEffect(() => {
    const element = getScrollElement();
    if (!element) {
      throw new Error('Scroll element is missing');
    }

    const size = estimateSize ? estimateSize() : 0;
    if (isNaN(size)) {
      throw new Error('Invalid estimated size');
    }
  });

  return {
    getVirtualItems: () =>
      range(0, count)
        .slice(0, 10)
        .map((_, index) => ({ key: index, index, start: index, end: index + 1, size: 1, lane: 0 })),
    getTotalSize: () => 10,
    scrollToIndex,
    measureElement,
  };
}
