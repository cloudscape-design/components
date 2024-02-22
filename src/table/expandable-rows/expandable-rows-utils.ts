// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { NonCancelableEventHandler, fireNonCancelableEvent } from '../../internal/events';
import { TableProps } from '../interfaces';

export function getExpandableTableProps<T>({
  items,
  getItemChildren,
  getItemExpandable,
  getItemExpanded,
  onExpandableItemToggle,
}: {
  items: readonly T[];
  getItemChildren?: (item: T) => readonly T[];
  getItemExpandable?: (item: T) => boolean;
  getItemExpanded?: (item: T) => boolean;
  onExpandableItemToggle?: NonCancelableEventHandler<TableProps.ExpandableItemToggleDetail<T>>;
}) {
  const isExpandable = !!getItemChildren;

  let allItems = items;
  const itemToLevel = new Map<T, number>();

  if (isExpandable) {
    const visibleItems = new Array<T>();

    const traverse = (item: T, level = 1) => {
      itemToLevel.set(item, level);
      visibleItems.push(item);
      if (!getItemExpanded || getItemExpanded(item)) {
        const children = getItemChildren(item);
        children.forEach(child => traverse(child, level + 1));
      }
    };

    items.forEach(item => traverse(item));

    for (let index = 0; index < visibleItems.length; index++) {
      const item = visibleItems[index];
      const isExpanded = getItemExpanded && getItemExpanded(item);
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

  const getItemLevel = (item: T) => itemToLevel.get(item) ?? 1;

  const getExpandableItemProps = (item: T) => {
    return {
      level: getItemLevel(item),
      isExpandable: getItemExpandable?.(item) ?? true,
      isExpanded: getItemExpanded?.(item) ?? true,
      onExpandableItemToggle: (item: T, expanded: boolean) =>
        fireNonCancelableEvent(onExpandableItemToggle, { item, expanded }),
    };
  };

  return { isExpandable, allItems, getItemLevel, getExpandableItemProps };
}
