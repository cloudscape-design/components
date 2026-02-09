// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useInternalI18n } from '../../i18n/context';
import { fireNonCancelableEvent } from '../../internal/events';
import { TableProps } from '../interfaces';
import { ItemSet } from '../selection/utils';

interface ExpandableItemProps<T> extends ExpandableItemDetail<T> {
  isExpandable: boolean;
  isExpanded: boolean;
  onExpandableItemToggle: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
  itemsCount?: number;
  selectedItemsCount?: number;
}

interface ExpandableItemDetail<T> {
  level: number;
  setSize: number;
  posInSet: number;
  parent: null | T;
  children: readonly T[];
}

export interface InternalExpandableRowsProps<T> {
  isExpandable: boolean;
  allItems: readonly T[];
  getExpandableItemProps(item: T): ExpandableItemProps<T>;
  hasGroupSelection: boolean;
  groupSelection: TableProps.GroupSelectionState<T>;
  onGroupSelectionChange?: TableProps.OnGroupSelectionChange<T>;
  totalItemsCount?: number;
  totalSelectedItemsCount?: number;
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
}): InternalExpandableRowsProps<T> {
  const i18n = useInternalI18n('table');
  const isExpandable = !!expandableRows;

  const expandedSet = new ItemSet(trackBy, expandableRows?.expandedItems ?? []);

  let allItems = items;
  const itemToDetail = new Map<T, ExpandableItemDetail<T>>();
  const getItemLevel = (item: T) => itemToDetail.get(item)?.level ?? 0;

  if (isExpandable) {
    const visibleItems = new Array<T>();

    const traverse = (item: T, detail: Omit<ExpandableItemDetail<T>, 'children'>, visible: boolean) => {
      const children = expandableRows.getItemChildren(item);
      itemToDetail.set(item, { ...detail, children });

      if (visible) {
        visibleItems.push(item);
      }
      children.forEach((child, index) =>
        traverse(
          child,
          { level: detail.level + 1, setSize: children.length, posInSet: index + 1, parent: item },
          visible && expandedSet.has(item)
        )
      );
    };
    items.forEach((item, index) =>
      traverse(item, { level: 1, setSize: items.length, posInSet: index + 1, parent: null }, true)
    );

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

  const getExpandableItemProps = (item: T): ExpandableItemProps<T> => {
    const { level = 1, setSize = 1, posInSet = 1, parent = null, children = [] } = itemToDetail.get(item) ?? {};
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
      parent,
      children,
      itemsCount: expandableRows?.getItemsCount?.(item),
      selectedItemsCount: expandableRows?.getSelectedItemsCount?.(item),
    };
  };

  return {
    isExpandable,
    allItems,
    getExpandableItemProps,
    hasGroupSelection: !!expandableRows?.groupSelection,
    groupSelection: expandableRows?.groupSelection ?? { inverted: false, toggledItems: [] },
    onGroupSelectionChange: expandableRows?.onGroupSelectionChange,
    totalItemsCount: expandableRows?.totalItemsCount,
    totalSelectedItemsCount: expandableRows?.totalSelectedItemsCount,
  };
}
