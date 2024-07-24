// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { TableProps, TableRow } from '../interfaces';

export function useProgressiveLoadingProps<T>({
  items,
  getLoadingStatus,
  getExpandableItemProps,
}: {
  items: readonly T[];
  getLoadingStatus?: (item: null | T) => TableProps.LoadingStatus;
  getExpandableItemProps: (item: T) => { level: number; parent: null | T; isExpanded: boolean; children: readonly T[] };
}) {
  // The rows are either data or loader.
  // A loader row can be added to the root level (level=0) in which case it has no associated item (item=null).
  // Loader rows can be added to expandable rows (level>0) in which case they have an associated item (item!=null).
  // The "from" property of the loader row is the index of the first item to be loaded starting 0. It is used to generate unique React keys.
  const allRows = new Array<TableRow<T>>();

  const getItemParent = (item: T) => getExpandableItemProps(item).parent;
  const getItemChildren = (item: T) => getExpandableItemProps(item).children;
  const getItemLevel = (item?: T) => (item ? getExpandableItemProps(item).level : 0);
  const isItemExpanded = (item: T) => getExpandableItemProps(item).isExpanded;

  for (let i = 0; i < items.length; i++) {
    allRows.push({ type: 'data', item: items[i] });

    // Insert empty expandable item loader
    if (isItemExpanded(items[i]) && getItemChildren(items[i]).length === 0) {
      const status = getLoadingStatus?.(items[i]);
      if (status && (status === 'loading' || status === 'error')) {
        allRows.push({ type: 'loader', item: items[i], level: getItemLevel(items[i]), status, from: 0 });
      } else {
        warnOnce('Table', 'Expanded items without children must have "loading" or "error" loading status.');
      }
    }

    // Insert expandable items loaders
    let currentParent = getItemParent(items[i]);
    let levelsDiff = getItemLevel(items[i]) - getItemLevel(items[i + 1]);
    while (currentParent && levelsDiff > 0) {
      const status = getLoadingStatus?.(currentParent);
      if (status && status !== 'finished') {
        const level = currentParent ? getItemLevel(currentParent) : 0;
        const children = currentParent ? getItemChildren(currentParent) : [];
        allRows.push({ type: 'loader', item: currentParent, level, status, from: children.length });
      }
      currentParent = currentParent && getItemParent(currentParent);
      levelsDiff--;
    }

    // Insert root loader
    const rootLoadingStatus = getLoadingStatus?.(null);
    if (i === items.length - 1 && rootLoadingStatus && rootLoadingStatus !== 'finished') {
      allRows.push({ type: 'loader', item: null, level: 0, status: rootLoadingStatus, from: items.length });
    }
  }

  return { allRows };
}
