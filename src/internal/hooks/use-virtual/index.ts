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
  itemOverlap?: number;
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
  itemOverlap = 0,
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
      rowVirtualizer.virtualItems.map((virtualItem, index) => {
        let adjustedStart: number;
        if (firstItemSticky && virtualItem.index !== 0) {
          adjustedStart = virtualItem.start + 1 - index * itemOverlap;
        } else {
          adjustedStart = virtualItem.start - index * itemOverlap;
        }

        return {
          ...virtualItem,
          start: adjustedStart,
          measureRef: (node: null | HTMLElement) => {
            const mountedCount = measuresCache.current.get(items[virtualItem.index]) ?? 0;
            if (mountedCount < MAX_ITEM_MOUNTS) {
              virtualItem.measureRef(node);
              measuresCache.current.set(items[virtualItem.index], mountedCount + 1);
            }
          },
        };
      }),
    [items, rowVirtualizer.virtualItems, firstItemSticky, itemOverlap]
  );

  // Adjust totalSize to account for applied itemOverlap. Since adjustedStart
  // uses the render index (not virtualItem.index) for overlap calculation, we
  // must use the maximum render index to determine the total overlap reduction.
  // The last rendered item has render index (virtualItems.length - 1), so the
  // total overlap applied is (virtualItems.length - 1) * itemOverlap.

  const firstItemSize = virtualItems[0]?.size ?? 0;
  const maxRenderIndex = virtualItems.length - 1;
  const totalOverlapReduction = maxRenderIndex >= 0 ? maxRenderIndex * itemOverlap : 0;

  let adjustedTotalSize = rowVirtualizer.totalSize - totalOverlapReduction;
  adjustedTotalSize = firstItemSticky ? adjustedTotalSize - firstItemSize : adjustedTotalSize;

  return {
    virtualItems,
    totalSize: adjustedTotalSize,
    scrollToIndex: rowVirtualizer.scrollToIndex,
  };
}
