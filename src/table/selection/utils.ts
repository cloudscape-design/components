// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '../interfaces';
import { getTrackableValue } from '../utils';

export const SELECTION_ITEM = 'selection-item';
export const SELECTION_ROOT = 'selection-root';

// A set, that compares items by their "trackables" (the results of applying `trackBy` to them)
export class ItemSet<T> {
  private trackBy: TableProps.TrackBy<T> | undefined;
  private map = new Map<unknown, T>();

  constructor(trackBy: TableProps.TrackBy<T> | undefined, items: ReadonlyArray<T>) {
    this.trackBy = trackBy;
    items.forEach(this.put);
  }

  put = (item: T) => this.map.set.call(this.map, getTrackableValue(this.trackBy, item), item);
  has = (item: T) => this.map.has.call(this.map, getTrackableValue(this.trackBy, item));
  forEach = this.map.forEach.bind(this.map);
}

type ItemKey = unknown;

interface TreeProps<T> {
  rootItems: readonly T[];
  trackBy: TableProps.TrackBy<T> | undefined;
  getChildren: (item: T) => readonly T[];
  isComplete: (item: null | T) => boolean;
}

const rootItemKey = Symbol('selection-tree-root');

export class ItemSelectionTree<T> {
  private treeProps: TreeProps<T>;
  private itemKeyToItem = new Map<ItemKey, T>();
  private itemSelectionState = new Set<ItemKey>();
  private itemProjectedSelectionState = new Set<ItemKey>();
  private itemProjectedParentSelectionState = new Set<ItemKey>();
  private itemProjectedIndeterminateState = new Set<ItemKey>();

  constructor(selectionInverted: boolean, selectedItems: readonly T[], treeProps: TreeProps<T>) {
    this.treeProps = treeProps;

    // Record input selection state as is.
    if (selectionInverted) {
      this.itemSelectionState.add(rootItemKey);
    }
    for (const item of selectedItems) {
      this.itemSelectionState.add(this.getKey(item));
    }
    // Populate item key to item mapping.
    const traverse = (item: T) => {
      this.itemKeyToItem.set(this.getKey(item), item);
      treeProps.getChildren(item).forEach(traverse);
    };
    treeProps.rootItems.forEach(traverse);

    this.computeState();
  }

  private getKey(item: T): ItemKey {
    return getTrackableValue(this.treeProps.trackBy, item);
  }

  private getItemForKey(itemKey: ItemKey): null | T {
    if (itemKey === rootItemKey) {
      return null;
    }
    return this.itemKeyToItem.get(itemKey)!;
  }

  private computeState() {
    this.itemProjectedSelectionState = new Set();
    this.itemProjectedIndeterminateState = new Set();

    // Transform input items tree to selection buckets.
    // Selection buckets are organized in a map by level.
    // Each bucket has a parent element (index=0) and might have children elements (index>=1).
    const selectionBuckets = new Map<number, ItemKey[][]>();
    const createSelectionBuckets = (item: T, level: number) => {
      const itemKey = this.getKey(item);
      const levelBuckets = selectionBuckets.get(level) ?? [];
      const children = this.treeProps.getChildren(item);
      const bucket: ItemKey[] = [itemKey];
      for (const child of children) {
        bucket.push(this.getKey(child));
        createSelectionBuckets(child, level + 1);
      }
      levelBuckets.push(bucket);
      selectionBuckets.set(level, levelBuckets);
    };
    // On level=0 there is a root bucket to hold the selection-inverted state.
    // On level>0 there are buckets that represent selection for every item.
    const rootBucket: ItemKey[] = [rootItemKey];
    for (const item of this.treeProps.rootItems) {
      rootBucket.push(this.getKey(item));
      createSelectionBuckets(item, 1);
    }
    selectionBuckets.set(0, [rootBucket]);

    // Transform buckets map to an array of buckets where those with bigger levels come first.
    const selectionBucketEntries = Array.from(selectionBuckets.entries())
      .sort(([a], [b]) => b - a)
      .flatMap(([, v]) => v);

    // Normalize selection state.
    for (const bucket of selectionBucketEntries) {
      // Cannot normalize 1-element buckets.
      if (bucket.length === 1) {
        continue;
      }
      // Cannot optimize incomplete buckets (those where not all children are loaded).
      // That is alright because the "show-more" item cannot be selected by the user,
      // which means the normalization conditions are never met.
      if (this.treeProps.isComplete(this.getItemForKey(bucket[0])) === false) {
        continue;
      }
      let selectedCount = 0;
      for (let i = bucket.length - 1; i >= 0; i--) {
        if (this.itemSelectionState.has(bucket[i])) {
          selectedCount++;
        } else {
          break;
        }
      }
      // Normalize selection state when all children are selected but the parent is not.
      if (selectedCount === bucket.length - 1 && !this.itemSelectionState.has(bucket[0])) {
        bucket.forEach(itemKey => this.itemSelectionState.delete(itemKey));
        this.itemSelectionState.add(bucket[0]);
      }
      // Normalize selection state when all children and the parent are selected.
      if (selectedCount === bucket.length) {
        bucket.forEach(itemKey => this.itemSelectionState.delete(itemKey));
      }
    }

    // Compute projected indeterminate state.
    // The parent (bucket[0]) is indeterminate when any of its children (bucket[1+]) is selected or indeterminate.
    for (const bucket of selectionBucketEntries) {
      let indeterminate = false;
      for (let i = 1; i < bucket.length; i++) {
        if (this.itemSelectionState.has(bucket[i]) || this.itemProjectedIndeterminateState.has(bucket[i])) {
          indeterminate = true;
          break;
        }
      }
      if (indeterminate) {
        this.itemProjectedIndeterminateState.add(bucket[0]);
      }
    }

    // Compute projected selected state.
    // An item is selected either when it is present in selection state but its parent is not selected,
    // or when it is not present in selection state but its parent is selected.
    // An item can be selected and indeterminate at the same time.
    const setItemProjectedSelection = (item: T, isParentSelected: boolean) => {
      const itemKey = this.getKey(item);
      const isSelfSelected = this.itemSelectionState.has(itemKey);
      const isSelected = (isSelfSelected && !isParentSelected) || (!isSelfSelected && isParentSelected);
      if (isSelected) {
        this.itemProjectedSelectionState.add(itemKey);
      }
      if (isParentSelected) {
        this.itemProjectedParentSelectionState.add(itemKey);
      }
      this.treeProps.getChildren(item).forEach(child => setItemProjectedSelection(child, isSelected));
    };
    // The projected selection computation starts from the root pseudo-item (selection inverted state).
    this.treeProps.rootItems.forEach(item => {
      const isRootSelected = this.itemSelectionState.has(rootItemKey);
      if (isRootSelected) {
        this.itemProjectedSelectionState.add(rootItemKey);
      }
      setItemProjectedSelection(item, isRootSelected);
    });
  }

  isItemSelected = (item: T) => this.itemProjectedSelectionState.has(this.getKey(item));

  isItemIndeterminate = (item: T) => this.itemProjectedIndeterminateState.has(this.getKey(item));

  isAllItemsSelected = () =>
    this.itemProjectedSelectionState.has(rootItemKey) && !this.itemProjectedIndeterminateState.has(rootItemKey);

  isSomeItemsSelected = () => this.itemProjectedIndeterminateState.has(rootItemKey);

  // The selection state might be different from the input selectionInverted and selectedItems
  // because of the applied normalization.
  getState = (): { selectionInverted: boolean; selectedItems: T[] } => {
    const selectionInverted = this.itemSelectionState.has(rootItemKey);
    const selectedItems: T[] = [];
    for (const itemKey of Array.from(this.itemSelectionState)) {
      const item = this.getItemForKey(itemKey);
      item && selectedItems.push(item);
    }
    return { selectionInverted, selectedItems };
  };

  toggleAll = (): ItemSelectionTree<T> => {
    return this.isAllItemsSelected()
      ? new ItemSelectionTree(false, [], this.treeProps)
      : new ItemSelectionTree(true, [], this.treeProps);
  };

  toggleSome = (requestedItems: readonly T[]): ItemSelectionTree<T> => {
    const clone = this.clone();
    const lastItemKey = clone.getKey(requestedItems[requestedItems.length - 1]);
    const isParentSelected = clone.itemProjectedParentSelectionState.has(lastItemKey);
    const isSelected = clone.itemProjectedSelectionState.has(lastItemKey);
    const isIndeterminate = clone.itemProjectedIndeterminateState.has(lastItemKey);
    const nextIsSelected = !(isSelected && !isIndeterminate);
    const nextIsSelfSelected = (isParentSelected && !nextIsSelected) || (!isParentSelected && nextIsSelected);

    for (const requested of requestedItems) {
      clone.unselectDeep(requested);
      if (nextIsSelfSelected) {
        clone.itemSelectionState.add(this.getKey(requested));
      }
    }
    clone.computeState();

    return clone;
  };

  private unselectDeep = (item: T) => {
    this.itemSelectionState.delete(this.getKey(item));
    this.treeProps.getChildren(item).forEach(child => this.unselectDeep(child));
  };

  private clone(): ItemSelectionTree<T> {
    const clone = new ItemSelectionTree(false, [], this.treeProps);
    clone.itemKeyToItem = new Map(this.itemKeyToItem);
    clone.itemSelectionState = new Set(this.itemSelectionState);
    clone.itemProjectedSelectionState = new Set(this.itemProjectedSelectionState);
    clone.itemProjectedParentSelectionState = new Set(this.itemProjectedParentSelectionState);
    clone.itemProjectedIndeterminateState = new Set(this.itemProjectedIndeterminateState);
    return clone;
  }
}

export const focusMarkers = {
  item: { ['data-' + SELECTION_ITEM]: 'item' },
  all: { ['data-' + SELECTION_ITEM]: 'all' },
  root: { ['data-' + SELECTION_ROOT]: 'true' },
};
