// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef } from 'react';

import { useVirtual as useVirtualDefault, VirtualItem } from '../../vendor/react-virtual';
import stickyRangeExtractor from './sticky-range-extractor';

// Maximum allowed synchronous (nested) item mounts before forcing a bail-out.
// Mirrors React’s internal safeguard for nested updates: React throws
// "Maximum update depth exceeded" once >50 sync updates occur within a single commit.
// See: https://github.com/facebook/react/commit/d8c90fa48d3addefe4b805ec56a3c65e4ee39127
const MAX_ITEM_MOUNTS = 50 - 1;

interface UseVirtualProps<Item> {
  items: readonly Item[];
  parentRef: React.RefObject<HTMLElement>;
  estimateSize: () => number;
  firstItemSticky?: boolean;
}

interface RowVirtualizer {
  virtualItems: VirtualItem[];
  totalSize: number;
  scrollToIndex: (index: number) => void;
}

/**
 * The useVirtual from react-virtual@2 might produce an infinite update loop caused by setting
 * measured item sizes in the render cycle (as part of the measureRef assignment):
 *      The sum of all measured item sizes is returned as totalSize which is then set on the list container.
 *      Enforcing new container height might result in an items size change e.g. when the content wraps.
 *
 * The infinite update cycle causes React "Maximum update depth exceeded" error and can be additionally confirmed
 * by logging the totalSize which should then bounce between two values.
 *
 * The number of item refs assignments is limited to MAX_ITEM_MOUNTS unless items or indices change.
 * That is based on the assumption the item height stays constant after its first render.
 */
export function useVirtual<Item extends object>({
  items,
  parentRef,
  estimateSize,
  firstItemSticky,
}: UseVirtualProps<Item>): RowVirtualizer {
  const rowVirtualizer = useVirtualDefault({
    size: items.length,
    parentRef,
    estimateSize,
    overscan: 5,
    rangeExtractor: firstItemSticky ? stickyRangeExtractor : undefined,
  });

  // Cache virtual item mounts to limit the amount of mounts per item.
  const measuresCache = useRef(new WeakMap<Item, number>());

  // Clear mounts cache every time indices, items, or size estimate change.
  const indicesKey = rowVirtualizer.virtualItems.map(item => `${item.index}`).join(':');
  useEffect(() => {
    measuresCache.current = new WeakMap();
  }, [indicesKey, items, estimateSize]);

  const virtualItems = useMemo(
    () =>
      rowVirtualizer.virtualItems.map(virtualItem => {
        return {
          ...virtualItem,
          start: virtualItem.start,
          measureRef: (node: null | HTMLElement) => {
            const mountedCount = measuresCache.current.get(items[virtualItem.index]) ?? 0;
            if (mountedCount < MAX_ITEM_MOUNTS) {
              virtualItem.measureRef(node);
              measuresCache.current.set(items[virtualItem.index], mountedCount + 1);
            }
          },
        };
      }),
    [items, rowVirtualizer.virtualItems]
  );

  // If first item is sticky, substract that item's size from the total size
  const firstItemSize = virtualItems[0]?.size ?? 0;
  const adjustedTotalSize = firstItemSticky ? rowVirtualizer.totalSize - firstItemSize : rowVirtualizer.totalSize;

  return {
    virtualItems,
    totalSize: adjustedTotalSize,
    scrollToIndex: rowVirtualizer.scrollToIndex,
  };
}
