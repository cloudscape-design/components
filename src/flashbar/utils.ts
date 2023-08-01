// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FlashbarProps } from './interfaces';
import { IconProps } from '../icon/interfaces';

export const FOCUS_THROTTLE_DELAY = 2000;

// Since the position of a notification changes when the Flashbar is collapsed,
// it is useful on some situations (e.g, for animating) to know the original position of the item
// in the non-collapsed state.
export interface StackableItem extends FlashbarProps.MessageDefinition {
  expandedIndex: number;
  collapsedIndex?: number;
}

const typesToColors: Record<FlashbarProps.Type, string> = {
  error: 'red',
  info: 'blue',
  'in-progress': 'blue',
  success: 'green',
  warning: 'yellow',
};

function getColorFromType(type?: FlashbarProps.Type): string {
  const defaultColor = 'blue';
  return type ? typesToColors[type] || defaultColor : defaultColor;
}

export function getItemType(item: FlashbarProps.MessageDefinition) {
  if (item.loading) {
    return 'in-progress';
  } else {
    return item.type || 'info';
  }
}

export function getItemColor(item: FlashbarProps.MessageDefinition) {
  return getColorFromType(getItemType(item));
}

/*
 Returns a selection of notifications, preserving the order when possible but making sure that all different colors in
 the stack are represented in the returned array.
 The order corresponds to how they are represented when using the collapsible feature (newest first, oldest last).
 */
export function getVisibleCollapsedItems(
  items: ReadonlyArray<FlashbarProps.MessageDefinition>,
  desiredLength: number
): ReadonlyArray<StackableItem> {
  // First `desiredLength` items in the original array,
  // together with `isColorRepeated` to tell if they can be subject to be replaced later on if necessary
  const itemsOnTop: { item: StackableItem; isColorRepeated: boolean }[] = [];

  // Items that fall outside `desiredIndexLength` but need to be "promoted" if possible
  // because they are of a different color which otherwise wouldn't be represented
  const itemsToPromote: StackableItem[] = [];

  const addedColors: Set<string> = new Set();
  const allPossibleColors = Object.keys(typesToColors).length;
  const finalLength = Math.min(items.length, desiredLength);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const color = getItemColor(item);
    const isColorRepeated = addedColors.has(color);
    if (i < finalLength) {
      itemsOnTop.push({ item: { ...item, expandedIndex: i }, isColorRepeated });
    } else {
      if (addedColors.size === allPossibleColors) {
        // No need to keep looking for unrepresented colors, we can stop looping
        break;
      } else if (!isColorRepeated) {
        itemsToPromote.push({ ...item, expandedIndex: i });
      }
    }
    addedColors.add(color);
  }
  // Generate the new array with the selected items, by picking from both arrays.
  // First, from the non-repeated items within the desired length...
  // We loop `itemsOnTop` starting from the end because we prefer to preserve the first ones rather than the old ones
  const reversedInitialSelection = [];
  let slotsReservedForPromotions = 0;
  for (let j = itemsOnTop.length - 1; j >= 0; j--) {
    const item = itemsOnTop[j];
    if (item.isColorRepeated && slotsReservedForPromotions < itemsToPromote.length) {
      slotsReservedForPromotions += 1;
    } else {
      reversedInitialSelection.push(item.item);
    }
  }
  const selectedItems = reversedInitialSelection.reverse();
  // ...and then complete the selection with as many promotable items as we can fit in the rest of the array
  for (let k = 0; selectedItems.length < desiredLength; k++) {
    selectedItems.push(itemsToPromote[k]);
  }
  return selectedItems;
}

export function getFlashTypeCount(
  items: readonly FlashbarProps.MessageDefinition[]
): Record<FlashbarProps.Type, number> {
  const count = { error: 0, info: 0, 'in-progress': 0, success: 0, warning: 0 };
  for (const item of items) {
    const type = getItemType(item);
    count[type] += 1;
  }
  return count;
}

export type LabelName =
  | 'errorIconAriaLabel'
  | 'warningIconAriaLabel'
  | 'successIconAriaLabel'
  | 'infoIconAriaLabel'
  | 'inProgressIconAriaLabel';

export const counterTypes: {
  type: FlashbarProps.Type;
  labelName: LabelName;
  iconName: IconProps.Name;
}[] = [
  { type: 'error', labelName: 'errorIconAriaLabel', iconName: 'status-negative' },
  { type: 'warning', labelName: 'warningIconAriaLabel', iconName: 'status-warning' },
  { type: 'success', labelName: 'successIconAriaLabel', iconName: 'status-positive' },
  { type: 'info', labelName: 'infoIconAriaLabel', iconName: 'status-info' },
  { type: 'in-progress', labelName: 'inProgressIconAriaLabel', iconName: 'status-in-progress' },
];
