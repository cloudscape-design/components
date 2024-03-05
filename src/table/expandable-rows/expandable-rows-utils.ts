// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fireNonCancelableEvent } from '../../internal/events';
import { TableProps } from '../interfaces';
import { ItemSet } from '../selection/utils';

export function getExpandableTableProps<T>({
  items,
  expandableRows,
  trackBy,
}: {
  items: readonly T[];
  expandableRows?: TableProps.ExpandableRows<T>;
  trackBy?: TableProps.TrackBy<T>;
}) {
  const isExpandable = !!expandableRows;

  const expandedSet = new ItemSet(trackBy, expandableRows?.expandedItems ?? []);

  let allItems = items;
  const itemToLevel = new Map<T, number>();

  if (isExpandable) {
    const visibleItems = new Array<T>();

    const traverse = (item: T, level = 1) => {
      itemToLevel.set(item, level);
      visibleItems.push(item);
      if (expandedSet.has(item)) {
        const children = expandableRows.getItemChildren(item);
        children.forEach(child => traverse(child, level + 1));
      }
    };

    items.forEach(item => traverse(item));

    for (let index = 0; index < visibleItems.length; index++) {
      const item = visibleItems[index];
      const isExpanded = expandedSet.has(item);
      if (isExpanded) {
        let insertionIndex = index + 1;
        for (insertionIndex; insertionIndex < visibleItems.length; insertionIndex++) {
          const insertionItem = visibleItems[insertionIndex];
          if ((itemToLevel.get(item) ?? 0) >= (itemToLevel.get(insertionItem) ?? 0)) {
            break;
          }
        }
        insertionIndex--;
      }
    }

    allItems = visibleItems;
  }

  const getExpandableItemProps = (item: T) => ({
    level: itemToLevel.get(item) ?? 1,
    isExpandable: expandableRows?.isItemExpandable(item) ?? true,
    isExpanded: expandedSet.has(item),
    onExpandableItemToggle: () =>
      fireNonCancelableEvent(expandableRows?.onExpandableItemToggle, { item, expanded: !expandedSet.has(item) }),
  });

  return { isExpandable, allItems, getExpandableItemProps };
}
