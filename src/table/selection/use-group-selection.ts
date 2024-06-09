// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { fireNonCancelableEvent } from '../../internal/events';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { TableProps } from '../interfaces';
import { getTrackableValue } from '../utils';
import { joinStrings } from '../../internal/utils/strings';
import { SelectionProps } from './interfaces';
import { ItemSelectionTree } from './utils';

// When selectionType="grouped" the checkboxes cannot be disabled so the `isItemDisabled` property is ignored.
// That is because selecting a group implies selection of children even if children are not loaded so that
// we cannot check if the children are disabled.

type SelectionOptions<T> = Pick<
  TableProps<T>,
  | 'ariaLabels'
  | 'items'
  | 'onSelectionChange'
  | 'selectedItems'
  | 'selectionInverted'
  | 'selectionType'
  | 'trackBy'
  | 'getLoadingStatus'
> & {
  getExpandableItemProps: (item: T) => { level: number; children: readonly T[] };
};

export function useGroupSelection<T>({
  ariaLabels,
  items,
  onSelectionChange,
  selectedItems = [],
  selectionInverted = false,
  selectionType,
  trackBy,
  getExpandableItemProps,
  getLoadingStatus,
}: SelectionOptions<T>): {
  isItemSelected: (item: T) => boolean;
  getSelectAllProps?: () => SelectionProps;
  getItemSelectionProps?: (item: T) => SelectionProps;
} {
  // The name assigned to all controls to combine them in a single group.
  const selectionControlName = useUniqueId();
  const [shiftPressed, setShiftPressed] = useState(false);
  const [lastClickedItem, setLastClickedItem] = useState<null | T>(null);

  if (selectionType !== 'group') {
    return { isItemSelected: () => false };
  }

  const rootItems = items.filter(item => getExpandableItemProps(item).level === 1);
  const getChildren = (item: T) => getExpandableItemProps(item).children;
  const isComplete = (item: null | T) => !getLoadingStatus || getLoadingStatus(item) === 'finished';
  const treeProps = { rootItems, trackBy, getChildren, isComplete };
  const selectionTree = new ItemSelectionTree(selectionInverted, selectedItems, treeProps);

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
      return items.slice(start, end + 1);
    }
    return [item];
  };

  const handleToggleAll = () => {
    fireNonCancelableEvent(onSelectionChange, selectionTree.toggleAll().getState());
  };

  const handleToggleItem = (item: T) => {
    setLastClickedItem(item);

    const requestedItems = shiftPressed ? getShiftSelectedItems(item) : [item];
    const getLevel = (item: T) => getExpandableItemProps(item).level;
    const requestedItemLevels = requestedItems.reduce((set, item) => set.add(getLevel(item)), new Set<number>());
    // Shift-selection is only allowed on the items of the same level.
    if (requestedItemLevels.size === 1) {
      fireNonCancelableEvent(onSelectionChange, selectionTree.toggleSome(requestedItems).getState());
    }
  };

  return {
    isItemSelected: selectionTree.isItemSelected,
    getSelectAllProps: (): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      checked: selectionInverted,
      indeterminate: selectionTree.isSomeItemsSelected(),
      onChange: handleToggleAll,
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.allItemsSelectionLabel?.({ selectedItems, selectionInverted })
      ),
    }),
    getItemSelectionProps: (item: T): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      checked: selectionTree.isItemSelected(item),
      indeterminate: selectionTree.isItemIndeterminate(item),
      onChange: () => handleToggleItem(item),
      onShiftToggle: (value: boolean) => setShiftPressed(value),
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.itemSelectionLabel?.({ selectedItems, selectionInverted }, item)
      ),
    }),
  };
}
