// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { fireNonCancelableEvent } from '../../internal/events';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { TableProps } from '../interfaces';
import { getTrackableValue } from '../utils';
import { joinStrings } from '../../internal/utils/strings';
import { SelectionProps } from './interfaces';
import { ItemSet } from './utils';

// When selectionType="grouped" the checkboxes cannot be disabled so the `isItemDisabled` property is ignored.
// That is because selecting a group implies selection of children even if children are not loaded so that
// we cannot check if the children are disabled.

type SelectionOptions<T> = Pick<
  TableProps<T>,
  'ariaLabels' | 'items' | 'onSelectionChange' | 'selectedItems' | 'selectionInverted' | 'selectionType' | 'trackBy'
>;

export function useGroupSelection<T>({
  ariaLabels,
  items,
  onSelectionChange,
  selectedItems = [],
  selectionInverted = false,
  selectionType,
  trackBy,
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

  // Selection state for individual items.
  const selectedSet = new ItemSet(trackBy, selectedItems);
  const isItemSelected = selectedSet.has.bind(selectedSet);

  // Derived selection state for all-items checkbox.
  let allEnabledItemsSelected = true;
  for (const item of items) {
    allEnabledItemsSelected = allEnabledItemsSelected && isItemSelected(item);
  }
  const allItemsCheckboxSelected = selectedItems.length > 0 && allEnabledItemsSelected;
  const allItemsCheckboxIndeterminate = selectedItems.length > 0 && !allEnabledItemsSelected;

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

  // Select items that are not already selected or disabled.
  const selectItems = (requestedItems: readonly T[]) => {
    const newSelectedItems = [...selectedItems];
    requestedItems.forEach(newItem => {
      if (!isItemSelected(newItem)) {
        newSelectedItems.push(newItem);
      }
    });
    return newSelectedItems;
  };

  // Unselect items unless they are disabled.
  const deselectItems = (requestedItems: readonly T[]) => {
    const requestedItemsSet = new ItemSet(trackBy, requestedItems);
    const newSelectedItems: Array<T> = [];
    selectedItems.forEach(selectedItem => {
      const shouldUnselect = requestedItemsSet.has(selectedItem);
      if (!shouldUnselect) {
        newSelectedItems.push(selectedItem);
      }
    });
    return newSelectedItems;
  };

  const handleToggleAll = () => {
    const newSelectedItems = allEnabledItemsSelected ? deselectItems(items) : selectItems(items);
    fireNonCancelableEvent(onSelectionChange, { selectedItems: newSelectedItems });
  };

  const handleToggleItem = (item: T) => {
    const requestedItems = shiftPressed ? getShiftSelectedItems(item) : [item];
    const selectedItems = isItemSelected(item) ? deselectItems(requestedItems) : selectItems(requestedItems);
    fireNonCancelableEvent(onSelectionChange, { selectedItems });
    setLastClickedItem(item);
  };

  // TODO:
  // consider selected items optimization on every change
  return {
    // TODO:
    // this function says item is selected when it is actually selected, not indeterminate
    isItemSelected,
    getSelectAllProps: (): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      // TODO:
      // True when all children are effectively selected
      checked: allItemsCheckboxSelected,
      // TODO:
      // True when some but not all children are effectively selected
      indeterminate: allItemsCheckboxIndeterminate,
      // TODO:
      // If checked -> set inverted=false and selectedItems=[]
      // If indeterminate -> set inverted=true and selectedItems=[]
      // If neither -> set inverted=true and selectedItems=[]
      onChange: handleToggleAll,
      // TODO: pass inverted here too
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.allItemsSelectionLabel?.({ selectedItems, selectionInverted })
      ),
    }),
    getItemSelectionProps: (item: T): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      // TODO:
      // True when effectively selected or when all children are effectively selected
      checked: isItemSelected(item),
      // TODO:
      // True when some but not all children are effectively selected
      indeterminate: false,
      // TODO:
      // Optimize or not optimize?
      // Make item effectively selected
      onChange: () => handleToggleItem(item),
      // TODO:
      // Ensure this works as in all imaginable combinations
      onShiftToggle: (value: boolean) => setShiftPressed(value),
      ariaLabel: joinStrings(
        // TODO: see what this label is for and if it needs to be different for groups and items
        ariaLabels?.selectionGroupLabel,
        // TODO: pass inverted here too
        ariaLabels?.itemSelectionLabel?.({ selectedItems, selectionInverted }, item)
      ),
    }),
  };
}
