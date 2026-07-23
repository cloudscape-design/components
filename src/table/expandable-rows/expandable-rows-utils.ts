// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useInternalI18n } from '../../i18n/context';
import { fireNonCancelableEvent } from '../../internal/events';
import { TableProps } from '../interfaces';
import { ItemSet } from '../selection/utils';

interface ExpandableItemProps<T> extends ExpandableItemDetail<T> {
  isExpandable: boolean;
  isExpanded: boolean;
  isMatched: boolean;
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
  // Number of items (at any nesting level) that satisfy `expandableRows.isItemMatched`.
  // Only meaningful when `highlightMatched` is enabled; otherwise 0.
  matchedItemsCount: number;
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

  // Filter highlighting (opt-in, backward compatible): when `highlightMatched` is enabled and an
  // `isItemMatched` predicate is provided, we keep ancestor rows of matching descendants visible,
  // auto-expand those ancestors so the matches are reachable, and flag matched rows for highlighting.
  const highlightMatched = isExpandable && !!expandableRows?.highlightMatched && !!expandableRows?.isItemMatched;
  const matchedSet = new ItemSet<T>(trackBy, []);
  const autoExpandedSet = new ItemSet<T>(trackBy, []);
  let matchedItemsCount = 0;

  if (highlightMatched) {
    const isItemMatched = expandableRows!.isItemMatched!;
    // Traverse the full tree (regardless of the current expansion state) to discover matched items
    // and every ancestor on the path to a match. Ancestors are collected into `autoExpandedSet` so
    // that the visible traversal below reveals the matches.
    const collectMatches = (item: T): boolean => {
      const children = expandableRows!.getItemChildren(item);
      let subtreeHasMatch = false;
      if (isItemMatched(item)) {
        matchedSet.put(item);
        matchedItemsCount++;
        subtreeHasMatch = true;
      }
      let hasMatchingDescendant = false;
      for (const child of children) {
        if (collectMatches(child)) {
          hasMatchingDescendant = true;
        }
      }
      if (hasMatchingDescendant) {
        autoExpandedSet.put(item);
        subtreeHasMatch = true;
      }
      return subtreeHasMatch;
    };
    items.forEach(item => collectMatches(item));
  }

  // An item is "effectively expanded" when the consumer expanded it, or when it is auto-expanded to
  // reveal a matching descendant during filtering.
  const isEffectivelyExpanded = (item: T) => expandedSet.has(item) || autoExpandedSet.has(item);

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
        children.forEach((child, index) =>
          traverse(
            child,
            { level: detail.level + 1, setSize: children.length, posInSet: index + 1, parent: item },
            isEffectivelyExpanded(item)
          )
        );
      }
    };
    items.forEach((item, index) =>
      traverse(item, { level: 1, setSize: items.length, posInSet: index + 1, parent: null }, true)
    );

    for (let index = 0; index < visibleItems.length; index++) {
      const item = visibleItems[index];
      if (isEffectivelyExpanded(item)) {
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
    const isExpanded = isEffectivelyExpanded(item);
    return {
      level,
      setSize,
      posInSet,
      isExpandable: expandableRows?.isItemExpandable(item) ?? true,
      isExpanded,
      isMatched: matchedSet.has(item),
      onExpandableItemToggle: () =>
        fireNonCancelableEvent(expandableRows?.onExpandableItemToggle, { item, expanded: !isExpanded }),
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
    matchedItemsCount,
  };
}
