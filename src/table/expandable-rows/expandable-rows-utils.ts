// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fireNonCancelableEvent } from '../../internal/events';
import { TableProps } from '../interfaces';
import { ItemSet } from '../selection/utils';

interface ItemPlacement {
  level: number;
  setSize: number;
  posInSet: number;
}

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
  const itemToPlacement = new Map<T, ItemPlacement>();
  const getItemLevel = (item: T) => itemToPlacement.get(item)?.level ?? 0;

  if (isExpandable) {
    const visibleItems = new Array<T>();

    const traverse = (item: T, placement: ItemPlacement) => {
      itemToPlacement.set(item, placement);

      visibleItems.push(item);
      if (expandedSet.has(item)) {
        const children = expandableRows.getItemChildren(item);
        expandableRows
          .getItemChildren(item)
          .forEach((child, index) =>
            traverse(child, { level: placement.level + 1, setSize: children.length, posInSet: index + 1 })
          );
      }
    };
    items.forEach((item, index) => traverse(item, { level: 1, setSize: items.length, posInSet: index + 1 }));

    for (let index = 0; index < visibleItems.length; index++) {
      const item = visibleItems[index];
      const isExpanded = expandedSet.has(item);
      if (isExpanded) {
        let insertionIndex = index + 1;
        for (insertionIndex; insertionIndex < visibleItems.length; insertionIndex++) {
          const insertionItem = visibleItems[insertionIndex];
          if (getItemLevel(item) >= getItemLevel(insertionItem)) {
            break;
          }
        }
        insertionIndex--;
      }
    }

    allItems = visibleItems;
  }

  const getExpandableItemProps = (item: T) => {
    const { level, setSize, posInSet } = itemToPlacement.get(item) ?? { level: 1, setSize: 1, posInSet: 1 };
    return {
      level,
      setSize,
      posInSet,
      isExpandable: expandableRows?.isItemExpandable(item) ?? true,
      isExpanded: expandedSet.has(item),
      onExpandableItemToggle: () =>
        fireNonCancelableEvent(expandableRows?.onExpandableItemToggle, { item, expanded: !expandedSet.has(item) }),
    };
  };

  return { isExpandable, allItems, getExpandableItemProps };
}
