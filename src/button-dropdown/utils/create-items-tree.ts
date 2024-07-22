// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import { isItemGroup } from './utils';

// The function turns a tree of items into a structure optimized for lookup of
// items and corresponding indices as well as iteration on indices in the given order.

// As trees are multidimensional, the index is represented as an array
export type TreeIndex = number[];

interface ItemsTreeApi {
  // Returns an item for the given tree index or null if not found
  getItem: (index: TreeIndex) => ButtonDropdownProps.ItemOrGroup | null;
  // Returns the tree index of the given item. The item must be present
  // in the tree (referential comparison), or an error will be thrown
  getItemIndex: (item: ButtonDropdownProps.ItemOrGroup) => TreeIndex;
  // Returns the index of next or previous sequential node or null if out of bounds
  getSequentialIndex: (index: TreeIndex, direction: -1 | 1) => TreeIndex | null;
  // Returns parent tree index of a given item or null if no parent is present
  getParentIndex: (item: ButtonDropdownProps.ItemOrGroup) => TreeIndex | null;
}

export default function createItemsTree(items: ButtonDropdownProps.Items): ItemsTreeApi {
  const itemToIndex = new Map<ButtonDropdownProps.ItemOrGroup, string>();
  const indexToItem = new Map<string, ButtonDropdownProps.ItemOrGroup>();
  const flatIndices: string[] = [];

  traverseItems(items, (item, index) => {
    const indexKey = stringifyIndex(index);
    itemToIndex.set(item, indexKey);
    indexToItem.set(indexKey, item);
    flatIndices.push(indexKey);
  });

  return {
    getItem: (index: TreeIndex): ButtonDropdownProps.ItemOrGroup | null => {
      const indexKey = stringifyIndex(index);

      return indexToItem.get(indexKey) || null;
    },
    getItemIndex: (item: ButtonDropdownProps.ItemOrGroup): TreeIndex => {
      const indexKey = itemToIndex.get(item);

      if (!indexKey) {
        throw new Error('Invariant violation: item is not found.');
      }

      return parseIndex(indexKey);
    },
    getSequentialIndex: (index: TreeIndex, direction: -1 | 1): TreeIndex | null => {
      const indexKey = stringifyIndex(index);
      const position = flatIndices.indexOf(indexKey);

      const nextIndexKey = flatIndices[position + direction];

      if (!nextIndexKey) {
        return null;
      }

      return parseIndex(nextIndexKey);
    },
    getParentIndex: (item: ButtonDropdownProps.ItemOrGroup): TreeIndex | null => {
      const indexKey = itemToIndex.get(item);

      if (!indexKey) {
        throw new Error('Invariant violation: item is not found.');
      }

      const index = parseIndex(indexKey);

      // No parent
      if (index.length === 1) {
        return null;
      }

      return index.slice(0, index.length - 1);
    },
  };
}

export function traverseItems(
  items: ButtonDropdownProps.Items,
  act: (item: ButtonDropdownProps.ItemOrGroup, index: TreeIndex) => void,
  parentIndex: TreeIndex = []
) {
  items.forEach((item, index) => {
    const itemIndex = [...parentIndex, index];
    act(item, itemIndex);

    if (isItemGroup(item)) {
      traverseItems(item.items, act, itemIndex);
    }
  });
}

function stringifyIndex(index: TreeIndex): string {
  return index.join('-');
}

function parseIndex(index: string): TreeIndex {
  return index.split('-').map(it => parseInt(it));
}
