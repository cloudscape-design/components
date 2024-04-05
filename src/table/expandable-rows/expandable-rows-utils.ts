// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useInternalI18n } from '../../i18n/context';
import { fireNonCancelableEvent } from '../../internal/events';
import { TableProps } from '../interfaces';
import { ItemSet } from '../selection/utils';

interface ExpandableItemProps extends ExpandableItemPlacement {
  isExpandable: boolean;
  isExpanded: boolean;
  onExpandableItemToggle: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
}

interface ExpandableItemPlacement {
  level: number;
  setSize?: number;
  posInSet?: number;
}

export function useExpandableTableProps<T>({
  items,
  expandableRows,
  trackBy,
  ariaLabels,
}: {
  items: readonly T[];
  expandableRows?: TableProps.ExpandableRows<T>;
  trackBy?: TableProps.TrackBy<T>;
  ariaLabels?: TableProps.AriaLabels<T>;
  loadingStatus?: TableProps.LoadingStatus;
}) {
  const i18n = useInternalI18n('table');
  const isExpandable = !!expandableRows;

  const expandedSet = new ItemSet(trackBy, expandableRows?.expandedItems ?? []);

  let allItems = items;
  const itemToParent = new Map<T, null | T>();
  const itemToPlacement = new Map<T, ExpandableItemPlacement>();
  const getItemLevel = (item: T) => itemToPlacement.get(item)?.level ?? 0;
  const getItemParent = (item: T) => itemToParent.get(item) ?? null;

  if (isExpandable) {
    const visibleItems = new Array<T>();

    const traverse = (item: T, parent: null | T, placement: ExpandableItemPlacement) => {
      itemToParent.set(item, parent);
      itemToPlacement.set(item, placement);

      visibleItems.push(item);
      if (expandedSet.has(item)) {
        const children = expandableRows.getItemChildren(item);
        expandableRows
          .getItemChildren(item)
          .forEach((child, index) =>
            traverse(child, item, { level: placement.level + 1, setSize: children.length, posInSet: index + 1 })
          );
      }
    };
    items.forEach((item, index) => traverse(item, null, { level: 1, setSize: items.length, posInSet: index + 1 }));

    for (let index = 0; index < visibleItems.length; index++) {
      const item = visibleItems[index];
      if (expandedSet.has(item)) {
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

  const getExpandableItemProps = (item: T): ExpandableItemProps => {
    const { level, setSize, posInSet } = itemToPlacement.get(item) ?? { level: 1, setSize: 1, posInSet: 1 };
    return {
      level,
      setSize,
      posInSet,
      isExpandable: expandableRows?.isItemExpandable(item) ?? true,
      isExpanded: expandedSet.has(item),
      onExpandableItemToggle: () =>
        fireNonCancelableEvent(expandableRows?.onExpandableItemToggle, { item, expanded: !expandedSet.has(item) }),
      expandButtonLabel: i18n('ariaLabels.expandButtonLabel', ariaLabels?.expandButtonLabel?.(item)),
      collapseButtonLabel: i18n('ariaLabels.collapseButtonLabel', ariaLabels?.collapseButtonLabel?.(item)),
    };
  };

  return { isExpandable, allItems, getExpandableItemProps, getItemLevel, getItemParent };
}
