// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { TableProps, TableRow } from '../interfaces';

export function useProgressiveLoadingProps<T>({
  items,
  expandableRows,
  loadingStatus,
  getExpandableItemProps,
}: {
  items: readonly T[];
  expandableRows?: TableProps.ExpandableRows<T>;
  loadingStatus?: TableProps.LoadingStatus;
  getExpandableItemProps: (item: T) => { level: number; parent: null | T; isExpanded: boolean; children: readonly T[] };
}) {
  const allRows = new Array<TableRow<T>>();

  const getItemParent = (item: T) => getExpandableItemProps(item).parent;
  const getItemChildren = (item: T) => getExpandableItemProps(item).children;
  const getItemLevel = (item?: T) => (item ? getExpandableItemProps(item).level : 0);
  const isItemExpanded = (item: T) => getExpandableItemProps(item).isExpanded;

  for (let i = 0; i < items.length; i++) {
    allRows.push({ type: 'data', item: items[i] });

    // Insert empty expandable item loader
    if (isItemExpanded(items[i]) && getItemChildren(items[i]).length === 0) {
      const status = expandableRows?.getItemLoadingStatus?.(items[i]);
      if (status && status !== 'pending' && status !== 'finished') {
        allRows.push({ type: 'loader', item: items[i], level: getItemLevel(items[i]), status, first: true });
      } else {
        warnOnce('Table', 'Expanded items must define children or loading status other than "pending" and "finished".');
      }
    }

    // Insert expandable items loaders
    let currentParent = getItemParent(items[i]);
    let levelsDiff = getItemLevel(items[i]) - getItemLevel(items[i + 1]);
    while (currentParent && levelsDiff > 0) {
      const status = currentParent ? expandableRows?.getItemLoadingStatus?.(currentParent) : loadingStatus;
      if (status && status !== 'finished') {
        const level = currentParent ? getItemLevel(currentParent) : 0;
        allRows.push({ type: 'loader', item: currentParent, level, status, first: false });
      }
      currentParent = currentParent && getItemParent(currentParent);
      levelsDiff--;
    }

    // Insert root loader
    if (i === items.length - 1 && loadingStatus && loadingStatus !== 'finished') {
      allRows.push({ type: 'loader', item: null, level: 0, status: loadingStatus, first: false });
    }
  }

  return { allRows };
}
