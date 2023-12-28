// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface UseVirtualProps<Item> {
  items: readonly Item[];
  parentRef: React.RefObject<HTMLElement>;
  estimateSize: () => number;
}

export function useVirtual<Item extends object>({ items, parentRef, estimateSize }: UseVirtualProps<Item>) {
  const count = items.length;
  const getScrollElement = () => parentRef.current;
  const rowVirtualizer = useVirtualizer({ count, getScrollElement, estimateSize, overscan: 5 });
  return {
    virtualItems: rowVirtualizer.getVirtualItems(),
    totalSize: rowVirtualizer.getTotalSize(),
    scrollToIndex: rowVirtualizer.scrollToIndex,
    measureElement: rowVirtualizer.measureElement,
  };
}
