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

type SelectionOptions<T> = Pick<
  TableProps<T>,
  | 'ariaLabels'
  | 'isItemDisabled'
  | 'items'
  | 'loading'
  | 'onSelectionChange'
  | 'selectedItems'
  | 'selectionType'
  | 'trackBy'
>;

export function useSelection<T>(options: SelectionOptions<T>): {
  isItemSelected: (item: T) => boolean;
  getSelectAllProps?: () => SelectionProps;
  getItemSelectionProps?: (item: T) => SelectionProps;
} {
  const singleSelectionProps = useSingleSelection(options);
  const multiSelectionProps = useMultiSelection(options);
  return options.selectionType === 'single' ? singleSelectionProps : multiSelectionProps;
}

function useSingleSelection<T>({
  ariaLabels,
  isItemDisabled = () => false,
  onSelectionChange,
  selectedItems = [],
  selectionType,
  trackBy,
}: SelectionOptions<T>) {
  // The name assigned to all controls to combine them in a single group.
  const selectionControlName = useUniqueId();

  if (selectionType !== 'single') {
    return { isItemSelected: () => false };
  }

  // Selection state for individual items.
  const selectedSet = new ItemSet(trackBy, selectedItems.slice(0, 1));
  const isItemSelected = selectedSet.has.bind(selectedSet);

  const handleToggleItem = (item: T) => {
    if (!isItemDisabled(item) && !isItemSelected(item)) {
      fireNonCancelableEvent(onSelectionChange, { selectedItems: [item] });
    }
  };

  return {
    isItemSelected,
    getItemSelectionProps: (item: T): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'single',
      disabled: isItemDisabled(item),
      checked: isItemSelected(item),
      onChange: () => handleToggleItem(item),
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.itemSelectionLabel?.({ selectedItems }, item)
      ),
    }),
  };
}

function useMultiSelection<T>({
  ariaLabels,
  isItemDisabled = () => false,
  items,
  loading,
  onSelectionChange,
  selectedItems = [],
  selectionType,
  trackBy,
}: SelectionOptions<T>) {
  // The name assigned to all controls to combine them in a single group.
  const selectionControlName = useUniqueId();
  const [shiftPressed, setShiftPressed] = useState(false);
  const [lastClickedItem, setLastClickedItem] = useState<null | T>(null);

  if (selectionType !== 'multi') {
    return { isItemSelected: () => false };
  }

  // Selection state for individual items.
  const selectedSet = new ItemSet(trackBy, selectedItems);
  const isItemSelected = selectedSet.has.bind(selectedSet);

  // Derived selection state for all-items checkbox.
  let allItemsDisabled = true;
  let allEnabledItemsSelected = true;
  for (const item of items) {
    allItemsDisabled = allItemsDisabled && isItemDisabled(item);
    allEnabledItemsSelected = allEnabledItemsSelected && (isItemSelected(item) || isItemDisabled(item));
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
      if (!isItemSelected(newItem) && !isItemDisabled(newItem)) {
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
      if (!shouldUnselect || isItemDisabled(selectedItem)) {
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
    if (!isItemDisabled(item)) {
      const requestedItems = shiftPressed ? getShiftSelectedItems(item) : [item];
      const selectedItems = isItemSelected(item) ? deselectItems(requestedItems) : selectItems(requestedItems);
      fireNonCancelableEvent(onSelectionChange, { selectedItems });
      setLastClickedItem(item);
    }
  };

  return {
    isItemSelected,
    getSelectAllProps: (): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: allItemsDisabled || !!loading,
      checked: allItemsCheckboxSelected,
      indeterminate: allItemsCheckboxIndeterminate,
      onChange: handleToggleAll,
      ariaLabel: joinStrings(ariaLabels?.selectionGroupLabel, ariaLabels?.allItemsSelectionLabel?.({ selectedItems })),
    }),
    getItemSelectionProps: (item: T): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: isItemDisabled(item),
      checked: isItemSelected(item),
      onChange: () => handleToggleItem(item),
      onShiftToggle: (value: boolean) => setShiftPressed(value),
      ariaLabel: joinStrings(
        ariaLabels?.selectionGroupLabel,
        ariaLabels?.itemSelectionLabel?.({ selectedItems }, item)
      ),
    }),
  };
}
