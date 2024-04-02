// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '../interfaces';

export interface ItemLoader<T> {
  item: null | T;
  level: number;
  status: TableProps.LoadingStatus;
}

export function useProgressiveLoadingProps<T>({
  items,
  expandableRows,
  loadingStatus,
  getItemLevel,
  getItemParent,
}: {
  items: readonly T[];
  expandableRows?: TableProps.ExpandableRows<T>;
  loadingStatus?: TableProps.LoadingStatus;
  getItemLevel: (item: T) => number;
  getItemParent: (item: T) => null | T;
}) {
  const itemToLoaders = new Map<T, ItemLoader<T>[]>();
  for (let i = 0; i < items.length; i++) {
    const itemLoaders = new Array<ItemLoader<T>>();
    let currentParent = getItemParent(items[i]);
    let levelsDiff = getItemLevel(items[i]) - getItemLevel(items[i + 1]);
    while (levelsDiff > 0) {
      const status = currentParent ? expandableRows?.getItemLoadingStatus?.(currentParent) : loadingStatus;
      if (status && status !== 'finished') {
        const level = currentParent ? getItemLevel(currentParent) : 0;
        itemLoaders.push({ item: currentParent, level, status });
      }
      currentParent = currentParent && getItemParent(currentParent);
      levelsDiff--;
    }
    itemToLoaders.set(items[i], itemLoaders);
  }

  const getItemLoaders = (item: T) => itemToLoaders.get(item) ?? [];

  return { getItemLoaders };
}
