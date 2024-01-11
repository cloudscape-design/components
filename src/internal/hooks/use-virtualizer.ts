// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { VirtualItem, Virtualizer, useVirtualizer as useTanstackVirtualizer } from '@tanstack/react-virtual';

export const useVirtualizer: typeof useTanstackVirtualizer = options => {
  if (typeof ResizeObserver !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTanstackVirtualizer(options);
  }

  // Fake output for when resize observer is not available to not let unit tests fail.
  return {
    getVirtualItems: () => {
      const items: VirtualItem[] = [];
      for (let index = 0; index < options.count; index++) {
        items.push({ index, key: index, start: 0, end: 0, size: 0, lane: 0 });
      }
      return items;
    },
    getTotalSize: () => 0,
    scrollToIndex: () => {},
    measureElement: () => {},
  } as unknown as Virtualizer<any, any>;
};
