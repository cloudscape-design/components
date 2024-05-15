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

export function useSelection<T>({
  items,
  selectedItems = [],
  selectionType,
  isItemDisabled = () => false,
  trackBy,
  onSelectionChange,
  ariaLabels,
  loading,
}: Pick<
  TableProps<T>,
  | 'ariaLabels'
  | 'items'
  | 'selectedItems'
  | 'selectionType'
  | 'isItemDisabled'
  | 'trackBy'
  | 'onSelectionChange'
  | 'loading'
>) {
  // The name assigned to all radio- controls to combine them in a single group.
  const selectionControlName = useUniqueId();

  // Selection state for individual items.
  const finalSelectedItems = selectionType === 'single' ? selectedItems.slice(0, 1) : selectedItems;
  const selectedSet = new ItemSet(trackBy, finalSelectedItems);
  const isItemSelected = selectedSet.has.bind(selectedSet);

  // Derived selection state for all-items checkbox.
  let allItemsDisabled = true;
  let allEnabledItemsSelected = true;
  if (selectionType === 'multi') {
    for (const item of items) {
      allItemsDisabled = allItemsDisabled && isItemDisabled(item);
      allEnabledItemsSelected = allEnabledItemsSelected && (isItemSelected(item) || isItemDisabled(item));
    }
  }
  const allItemsCheckboxSelected = finalSelectedItems.length > 0 && allEnabledItemsSelected;
  const allItemsCheckboxIndeterminate = finalSelectedItems.length > 0 && !allEnabledItemsSelected;

  // Shift-selection helpers.
  const [shiftPressed, setShiftPressed] = useState(false);
  const [lastClickedItem, setLastClickedItem] = useState<null | T>(null);
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
    if (isItemDisabled(item)) {
      return;
    }
    if (selectionType === 'single' && !isItemSelected(item)) {
      fireNonCancelableEvent(onSelectionChange, { selectedItems: [item] });
    }
    if (selectionType === 'multi') {
      const requestedItems = shiftPressed ? getShiftSelectedItems(item) : [item];
      const selectedItems = isItemSelected(item) ? deselectItems(requestedItems) : selectItems(requestedItems);
      fireNonCancelableEvent(onSelectionChange, { selectedItems });
      setLastClickedItem(item);
    }
  };

  return {
    isItemSelected,
    getSelectAllProps: (): SelectionProps => {
      if (!selectionType) {
        throw new Error('Invariant violation: calling selection props with missing selection type.');
      }
      return {
        name: selectionControlName,
        selectionType: selectionType,
        disabled: allItemsDisabled || !!loading,
        checked: allItemsCheckboxSelected,
        indeterminate: allItemsCheckboxIndeterminate,
        onChange: handleToggleAll,
        ariaLabel: joinStrings(
          ariaLabels?.selectionGroupLabel,
          ariaLabels?.allItemsSelectionLabel?.({ selectedItems })
        ),
      };
    },
    getItemSelectionProps: (item: T): SelectionProps => {
      if (!selectionType) {
        throw new Error('Invariant violation: calling selection props with missing selection type.');
      }
      return {
        name: selectionControlName,
        selectionType: selectionType,
        disabled: isItemDisabled(item),
        checked: isItemSelected(item),
        indeterminate: false,
        onChange: () => handleToggleItem(item),
        onShiftToggle: (value: boolean) => setShiftPressed(value),
        ariaLabel: joinStrings(
          ariaLabels?.selectionGroupLabel,
          ariaLabels?.itemSelectionLabel?.({ selectedItems }, item)
        ),
      };
    },
  };
}
