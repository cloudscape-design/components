// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

import { SelectionTree, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../internal/events';
import { joinStrings } from '../../internal/utils/strings';
import { InternalExpandableRowsProps } from '../expandable-rows/expandable-rows-utils';
import { InternalSelectionType, TableProps } from '../interfaces';
import { getTrackableValue } from '../utils';
import { SelectionProps } from './interfaces';

type SelectionOptions<T> = Pick<
  TableProps<T>,
  'ariaLabels' | 'items' | 'trackBy' | 'getLoadingStatus' | 'selectedItems' | 'totalItemsCount'
> & {
  rootItems: readonly T[];
  selectionType?: InternalSelectionType;
  expandableRows: InternalExpandableRowsProps<T>;
  setLastUserAction?: (name: string) => void;
};

export function useGroupSelection<T>({
  ariaLabels,
  items,
  rootItems,
  selectedItems = [],
  totalItemsCount,
  trackBy,
  expandableRows,
  selectionType,
  getLoadingStatus,
  setLastUserAction,
}: SelectionOptions<T>): SelectionProps<T> {
  // The name assigned to all controls to combine them in a single group.
  const selectionControlName = useUniqueId();
  const [shiftPressed, setShiftPressed] = useState(false);
  const [lastClickedItem, setLastClickedItem] = useState<null | T>(null);

  if (selectionType !== 'group') {
    return { isItemSelected: () => false };
  }

  const getParent = (item: T) => expandableRows.getExpandableItemProps(item).parent;
  const getChildren = (item: T) => expandableRows.getExpandableItemProps(item).children;
  const getSelectionStateProps = (item: T) => {
    const { itemsCount, selectedItemsCount } = expandableRows.getExpandableItemProps(item);
    return { itemsCount, selectedItemsCount };
  };
  const isComplete = (item: null | T) => !getLoadingStatus || getLoadingStatus(item) === 'finished';
  const treeProps = { rootItems, trackBy, getChildren, isComplete };
  const selectionTree = new SelectionTree(rootItems, treeProps, expandableRows.groupSelection);
  const onChange = (groupSelection: TableProps.GroupSelectionState<T>) => {
    fireNonCancelableEvent(expandableRows.onGroupSelectionChange, { groupSelection });
    setLastUserAction?.('selection');
  };

  // Shift-selection helpers.
  const itemIndexesMap = new Map<T, number>();
  items.forEach((item, i) => itemIndexesMap.set(getTrackableValue(trackBy, item), i));
  const getShiftSelectedItems = (item: T): T[] => {
    const lastClickedItemIndex = lastClickedItem
      ? itemIndexesMap.get(getTrackableValue(trackBy, lastClickedItem))
      : undefined;
    // We use lastClickedItemIndex to determine if filtering/sorting/pagination
    // made previously selected item invisible, therefore we reset state for shift-select.
    if (lastClickedItemIndex !== undefined) {
      const currentItemIndex = itemIndexesMap.get(getTrackableValue(trackBy, item))!;
      const start = Math.min(currentItemIndex, lastClickedItemIndex);
      const end = Math.max(currentItemIndex, lastClickedItemIndex);
      const requestedItems = items.slice(start, end + 1);
      return lastClickedItemIndex < currentItemIndex ? requestedItems : requestedItems.reverse();
    }
    return [item];
  };

  const handleToggleAll = () => onChange(selectionTree.toggleAll().getState());

  const handleToggleItem = (item: T) => {
    setLastClickedItem(item);
    const requestedItems = shiftPressed ? getShiftSelectedItems(item) : [item];
    const requestedItemParents = requestedItems.reduce((set, item) => set.add(getParent(item)), new Set<null | T>());
    // Shift-selection is only allowed on items with the same parent.
    if (requestedItemParents.size === 1) {
      onChange(selectionTree.toggleSome(requestedItems).getState());
    }
  };

  const createLoaderToggleHandle = (item: null | T) => () =>
    onChange(!item ? selectionTree.invertAll().getState() : selectionTree.invertOne(item).getState());

  return {
    isItemSelected: selectionTree.isItemSelected,
    getSelectAllProps: () => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      checked: selectionTree.isAllItemsSelected(),
      indeterminate: selectionTree.isAllItemsIndeterminate(),
      onChange: handleToggleAll,
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.allItemsSelectionLabel?.({
          selectedItems,
          itemsCount: expandableRows.totalItemsCount ?? totalItemsCount,
          selectedItemsCount: expandableRows.totalSelectedItemsCount ?? selectedItems.length,
        })
      ),
    }),
    getItemSelectionProps: item => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      checked: selectionTree.isItemSelected(item),
      indeterminate: selectionTree.isItemIndeterminate(item),
      onChange: () => handleToggleItem(item),
      onShiftToggle: value => setShiftPressed(value),
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.itemSelectionLabel?.({ selectedItems, ...getSelectionStateProps(item) }, item)
      ),
    }),
    getLoaderSelectionProps: item => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      checked: item ? selectionTree.isItemSelected(item) : selectionTree.getState().inverted,
      indeterminate: false,
      onChange: createLoaderToggleHandle(item),
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.itemLoaderSelectionLabel?.({ selectedItems }, item)
      ),
    }),
  };
}
