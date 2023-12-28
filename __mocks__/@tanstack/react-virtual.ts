// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { range } from 'lodash';

export function useVirtualizer({ count }: { count: number }) {
  return {
    getVirtualItems: () =>
      range(0, count)
        .slice(0, 10)
        .map((_, index) => ({ key: index, index, start: index, end: index + 1, size: 1, lane: 0 })),
    getTotalSize: () => 10,
    scrollToIndex: () => {},
    measureElement: () => {},
  };
}
