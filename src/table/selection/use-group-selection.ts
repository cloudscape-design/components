// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { fireNonCancelableEvent } from '../../internal/events';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { TableProps } from '../interfaces';
import { getTrackableValue } from '../utils';
import { joinStrings } from '../../internal/utils/strings';
import { SelectionProps } from './interfaces';
import { ItemMap, ItemSet } from './utils';

// When selectionType="grouped" the checkboxes cannot be disabled so the `isItemDisabled` property is ignored.
// That is because selecting a group implies selection of children even if children are not loaded so that
// we cannot check if the children are disabled.

type SelectionOptions<T> = Pick<
  TableProps<T>,
  'ariaLabels' | 'items' | 'onSelectionChange' | 'selectedItems' | 'selectionInverted' | 'selectionType' | 'trackBy'
> & {
  getExpandableItemProps: (item: T) => { level: number; parent: null | T; children: readonly T[] };
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

  const selectionTree = createSelectionTree({
    items,
    selectedItems,
    selectionInverted,
    trackBy,
    getExpandableItemProps,
  });

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
    if (selectionTree.isAllSelected) {
      fireNonCancelableEvent(onSelectionChange, { selectionInverted: false, selectedItems: [] });
    } else {
      fireNonCancelableEvent(onSelectionChange, { selectionInverted: true, selectedItems: [] });
    }
  };

  const handleToggleItem = (item: T) => {
    const requestedItems = shiftPressed ? getShiftSelectedItems(item) : [item];
    const hasChildren = (item: T) => getExpandableItemProps(item).children.length > 0;
    const isRequestedItemsValid = requestedItems.length === 1 || requestedItems.filter(hasChildren).length === 0;
    if (!isRequestedItemsValid) {
      return;
    }
    fireNonCancelableEvent(onSelectionChange, selectionTree.updateSelection(requestedItems));
    setLastClickedItem(item);
  };

  return {
    isItemSelected: selectionTree.isItemSelected,
    getSelectAllProps: (): SelectionProps => ({
      name: selectionControlName,
      selectionType: 'multi',
      disabled: false,
      checked: selectionTree.isAllSelected,
      indeterminate: selectionTree.isAllIndeterminate,
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

function createSelectionTree<T>({
  items,
  selectedItems = [],
  selectionInverted = false,
  trackBy,
  getExpandableItemProps,
}: Pick<SelectionOptions<T>, 'items' | 'selectedItems' | 'selectionInverted' | 'trackBy' | 'getExpandableItemProps'>) {
  const selfSelectedSet = new ItemSet(trackBy, selectedItems);
  const effectivelySelectedMap = new ItemMap(trackBy);
  const effectivelyIndeterminateMap = new ItemMap(trackBy);

  const isItemSelected = (item: T): boolean => {
    const cachedValue = effectivelySelectedMap.get(item);
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    const { parent } = getExpandableItemProps(item);
    const isSelfSelected = selfSelectedSet.has(item);
    const isParentSelected = parent ? isItemSelected(parent) : selectionInverted;
    const isSelected = (isSelfSelected && !isParentSelected) || (!isSelfSelected && isParentSelected);
    effectivelySelectedMap.set(item, isSelected);
    return isSelected;
  };

  const isItemIndeterminate = (item: T): boolean => {
    const cachedValue = effectivelyIndeterminateMap.get(item);
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    const { children } = getExpandableItemProps(item);
    let allChildrenSelected = true;
    let someChildrenSelected = false;
    for (const childItem of children) {
      const isSelected = isItemSelected(childItem);
      const isIndeterminate = isItemIndeterminate(childItem);
      allChildrenSelected = allChildrenSelected && isSelected && !isIndeterminate;
      someChildrenSelected = someChildrenSelected || isSelected || isIndeterminate;
    }
    const isIndeterminate = children.length > 0 && !allChildrenSelected && someChildrenSelected;
    effectivelyIndeterminateMap.set(item, isIndeterminate);

    // Fix invalid selection state when both parent and all children are explicitly set as selected.
    if (selfSelectedSet.has(item) && children.length > 0 && !someChildrenSelected) {
      effectivelySelectedMap.set(item, false);
    } else if (children.length > 0 && allChildrenSelected) {
      effectivelySelectedMap.set(item, true);
    }

    return isIndeterminate;
  };

  let allChildrenSelected = true;
  let someChildrenSelected = false;
  for (const item of items) {
    const isSelected = isItemSelected(item);
    const isIndeterminate = isItemIndeterminate(item);
    allChildrenSelected = allChildrenSelected && isSelected && !isIndeterminate;
    someChildrenSelected = someChildrenSelected || isSelected || isIndeterminate;
  }
  const isAllSelected = allChildrenSelected;
  const isAllIndeterminate = items.length > 0 && !allChildrenSelected && someChildrenSelected;

  const updateSelection = (requestedItems: readonly T[]): { selectedItems: T[]; selectionInverted: boolean } => {
    const selfSelectedSet = new ItemSet(trackBy, selectedItems);
    const unselectDeep = (item: T) => {
      selfSelectedSet.delete(item);
      for (const child of getExpandableItemProps(item).children) {
        unselectDeep(child);
      }
    };
    const checkParentSelected = (item: T) => {
      const { parent } = getExpandableItemProps(item);
      return parent ? isItemSelected(parent) : selectionInverted;
    };
    for (const requested of requestedItems) {
      unselectDeep(requested);

      const isSelected = !(isItemSelected(requested) && !isItemIndeterminate(requested));
      const isParentSelected = checkParentSelected(requested);
      if ((isParentSelected && isSelected) || (!isParentSelected && !isSelected)) {
        selfSelectedSet.delete(requested);
      } else {
        selfSelectedSet.put(requested);
      }
    }
    const tempSelectedItems: T[] = [];
    selfSelectedSet.forEach(item => tempSelectedItems.push(item));

    const nextSelectionTree = createSelectionTree({
      items,
      selectedItems: tempSelectedItems,
      selectionInverted,
      trackBy,
      getExpandableItemProps,
    });
    const nextSelectionInverted = selectionInverted || nextSelectionTree.isAllSelected;
    const nextSelectedItems: T[] = [];

    function checkItemSelection(item: T, parentState: boolean) {
      const itemState = nextSelectionTree.isItemSelected(item);
      if (itemState !== parentState) {
        nextSelectedItems.push(item);
      }
      for (const childItem of getExpandableItemProps(item).children) {
        checkItemSelection(childItem, itemState);
      }
    }
    for (const item of items) {
      const { level } = getExpandableItemProps(item);
      if (level === 1) {
        checkItemSelection(item, nextSelectionInverted);
      }
    }

    return { selectionInverted: nextSelectionInverted, selectedItems: nextSelectedItems };
  };

  return { isAllSelected, isAllIndeterminate, isItemSelected, isItemIndeterminate, updateSelection };
}
