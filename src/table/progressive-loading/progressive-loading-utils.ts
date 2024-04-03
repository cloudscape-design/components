// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '../interfaces';

export type TableRow<T> = TableDataRow<T> | TableLoaderRow<T>;

export interface TableDataRow<T> {
  type: 'data';
  item: T;
}

export interface TableLoaderRow<T> {
  type: 'loader';
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
  const allRows = new Array<TableRow<T>>();

  for (let i = 0; i < items.length; i++) {
    allRows.push({ type: 'data', item: items[i] });
    let currentParent = getItemParent(items[i]);
    let levelsDiff = getItemLevel(items[i]) - getItemLevel(items[i + 1]);
    while (levelsDiff > 0) {
      const status = currentParent ? expandableRows?.getItemLoadingStatus?.(currentParent) : loadingStatus;
      if (status && status !== 'finished') {
        const level = currentParent ? getItemLevel(currentParent) : 0;
        allRows.push({ type: 'loader', item: currentParent, level, status });
      }
      currentParent = currentParent && getItemParent(currentParent);
      levelsDiff--;
    }
  }

  return { allRows };
}
