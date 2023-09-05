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
  const [shiftPressed, setShiftPressed] = useState(false);
  const [lastClickedItem, setLastClickedItem] = useState<T | null>(null);
  const selectionName = useUniqueId();
  const finalSelectedItems = selectionType === 'single' ? selectedItems.slice(0, 1) : selectedItems;
  const selectedSet = new ItemSet(trackBy, finalSelectedItems);
  const itemIndexesMap = new Map();
  items.forEach((item, i) => itemIndexesMap.set(getTrackableValue(trackBy, item), i));
  const isItemSelected = selectedSet.has.bind(selectedSet);
  const getItemState = (item: T) => ({
    disabled: isItemDisabled(item),
    selected: isItemSelected(item),
  });
  const [allDisabled, allEnabledSelected] = selectionType
    ? items.reduce(
        ([allDisabled, allEnabledSelected], item) => {
          const { disabled, selected } = getItemState(item);
          return [
            // all items are disabled (or none are present)
            allDisabled && disabled,
            // all enabled items are selected (or none are present)
            allEnabledSelected && (selected || disabled),
          ];
        },
        [true, true]
      )
    : [true, true];

  // the page has at least one selected item
  const hasSelected = finalSelectedItems.length > 0;

  const handleToggleAll = () => {
    const requestedItems = new ItemSet(trackBy, items);
    const newSelectedItems = allEnabledSelected ? deselectItems(requestedItems) : selectItems(requestedItems);
    fireNonCancelableEvent(onSelectionChange, { selectedItems: newSelectedItems });
  };

  const getRequestedItems = (item: T) => {
    const requestedItems = new ItemSet(trackBy, [item]);
    let lastClickedItemIndex = lastClickedItem ? itemIndexesMap.get(getTrackableValue(trackBy, lastClickedItem)) : -1;
    if (lastClickedItemIndex === undefined) {
      lastClickedItemIndex = -1;
    }
    // we use lastClickedItemIndex to determine if filtering/sorting/pagination
    // made previously selected item invisible, therefore we reset state for shift-select
    if (shiftPressed && lastClickedItemIndex !== -1) {
      // item is always in items
      const currentItemIndex = itemIndexesMap.get(getTrackableValue(trackBy, item)) as number;
      const start = Math.min(currentItemIndex, lastClickedItemIndex);
      const end = Math.max(currentItemIndex, lastClickedItemIndex);
      items.slice(start, end + 1).forEach(item => requestedItems.put(item));
    }
    return requestedItems;
  };

  const deselectItems = (requestedItems: ItemSet<T>) => {
    const newSelectedItems: Array<T> = [];
    selectedItems.forEach(selectedItem => {
      const toUnselect = requestedItems.has(selectedItem);
      if (!toUnselect || isItemDisabled(selectedItem)) {
        newSelectedItems.push(selectedItem);
      }
    });
    return newSelectedItems;
  };

  const selectItems = (requestedItems: ItemSet<T>) => {
    const newSelectedItems = [...selectedItems];
    requestedItems.forEach(newItem => {
      const { selected, disabled } = getItemState(newItem);
      if (!selected && !disabled) {
        newSelectedItems.push(newItem);
      }
    });
    return newSelectedItems;
  };

  const handleToggleItem = (item: T) => () => {
    const { disabled, selected } = getItemState(item);
    if (disabled || (selectionType === 'single' && selected)) {
      return;
    }
    if (selectionType === 'single') {
      fireNonCancelableEvent(onSelectionChange, { selectedItems: [item] });
    } else {
      const requestedItems = getRequestedItems(item);
      const selectedItems = selected ? deselectItems(requestedItems) : selectItems(requestedItems);
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
        name: selectionName,
        disabled: allDisabled || !!loading,
        selectionType: selectionType,
        indeterminate: hasSelected && !allEnabledSelected,
        checked: hasSelected && allEnabledSelected,
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
        name: selectionName,
        selectionType: selectionType,
        ariaLabel: joinStrings(
          ariaLabels?.selectionGroupLabel,
          ariaLabels?.itemSelectionLabel?.({ selectedItems }, item)
        ),
        onChange: handleToggleItem(item),
        checked: isItemSelected(item),
        disabled: isItemDisabled(item),
      };
    },
    updateShiftToggle: (value: boolean) => {
      setShiftPressed(value);
    },
  };
}
