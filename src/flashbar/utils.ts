// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FlashbarProps, FlashType } from './interfaces';

// Since the position of a notification changes when the Flashbar is collapsed,
// it is useful on some situations (e.g, for animating) to know the original position of the item
// in the non-collapsed state.
export interface StackableItem extends FlashbarProps.MessageDefinition {
  expandedIndex: number;
  collapsedIndex?: number;
}

const typesToColors: Record<FlashType, string> = {
  error: 'red',
  info: 'blue',
  progress: 'blue',
  success: 'green',
  warning: 'blue',
};

function getColorFromType(type?: FlashType): string {
  const defaultColor = 'blue';
  return type ? typesToColors[type] || defaultColor : defaultColor;
}

function getItemType(item: FlashbarProps.MessageDefinition) {
  if (item.loading) {
    return 'progress';
  } else {
    return item.type || 'info';
  }
}

function getItemColor(item: FlashbarProps.MessageDefinition) {
  if (item.loading) {
    return 'blue';
  }
  return getColorFromType(getItemType(item));
}

/*
 Returns a selection of notifications, preserving the order when possible but making sure that all different colors in
 the stack are represented in the returned array.
 The order corresponds to how they are represented when using the stackable feature (newest first, oldest last).
 */
export function getStackedItems(
  items: ReadonlyArray<FlashbarProps.MessageDefinition>,
  desiredLength: number
): ReadonlyArray<StackableItem> {
  const selectedItems: StackableItem[] = [];

  // First `desiredLength` items in the original array,
  // together with `isColorRepeated` to tell if they can be subject to be replaced later on if necessary
  const itemsOnTop: { item: StackableItem; isColorRepeated: boolean }[] = [];

  // Items that fall outside `desiredIndexLength` but need to be "promoted" because they are of a different color
  // which otherwise wouldn't be represented
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
    } else if (!isColorRepeated) {
      itemsToPromote.push({ ...item, expandedIndex: i });
    }
    if (addedColors.size === allPossibleColors) {
      // No need to keep looking for unrepresented colors, we can stop looping
      break;
    }
    addedColors.add(color);
  }

  // Generate the new array with the selected items, by picking from both arrays.
  // We loop `itemsOnTop` starting from the end because we prefer to preserve the first ones rather than the old ones
  for (let j = itemsOnTop.length - 1; j >= 0; j--) {
    if (itemsOnTop[j].isColorRepeated && itemsToPromote.length) {
      // Explicitly tell TypeScript that .pop() will return an element of the expected type and not undefined,
      // even though we check the array length in the condition above, because of a TypeScript limitation:
      // https://github.com/microsoft/TypeScript/issues/30406#issuecomment-473037675
      selectedItems[j] = itemsToPromote.pop() as StackableItem;
    } else {
      selectedItems[j] = itemsOnTop[j].item;
    }
  }
  return selectedItems;
}

export function getFlashTypeCount(items: readonly FlashbarProps.MessageDefinition[]): Record<FlashType, number> {
  const count = { error: 0, info: 0, progress: 0, success: 0, warning: 0 };
  for (const item of items) {
    const type = getItemType(item);
    count[type] += 1;
  }
  return count;
}
