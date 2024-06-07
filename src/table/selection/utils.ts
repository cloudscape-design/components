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

const rootItemKey = Symbol('selection-tree-root');

export class ItemSelectionTree<T> {
  private rootItems: readonly T[];
  private trackBy: TableProps.TrackBy<T> | undefined;
  private getChildren: (item: T) => readonly T[];
  private isComplete: (item: null | T) => boolean;
  private itemKeyToItem = new Map<unknown, T>();
  private itemSelectionState = new Set<unknown>();
  private itemEffectiveSelectionState = new Set<unknown>();
  private itemEffectiveIndeterminateState = new Set<unknown>();

  constructor(
    rootItems: readonly T[],
    selectedItems: readonly T[],
    selectionInverted: boolean,
    trackBy: TableProps.TrackBy<T> | undefined,
    getChildren: (item: T) => readonly T[],
    isComplete: (item: null | T) => boolean
  ) {
    this.rootItems = rootItems;
    this.trackBy = trackBy;
    this.getChildren = getChildren;
    this.isComplete = isComplete;

    // Record input selection state as is.
    if (selectionInverted) {
      this.itemSelectionState.add(rootItemKey);
    }
    for (const item of selectedItems) {
      this.itemSelectionState.add(getTrackableValue(trackBy, item));
    }

    this.computeState();
  }

  private computeState() {
    // Transform input items tree to selection buckets.
    const selectionBuckets = new Map<number, unknown[][]>();
    const createSelectionBuckets = (item: T, level: number) => {
      const itemKey = getTrackableValue(this.trackBy, item);
      this.itemKeyToItem.set(itemKey, item);

      const levelBuckets = selectionBuckets.get(level) ?? [];
      const children = this.getChildren(item);
      const bucket: unknown[] = [itemKey];
      for (const child of children) {
        bucket.push(getTrackableValue(this.trackBy, child));
        createSelectionBuckets(child, level + 1);
      }
      levelBuckets.push(bucket);
      selectionBuckets.set(level, levelBuckets);
    };
    const rootBucket: unknown[] = [rootItemKey];
    for (const item of this.rootItems) {
      rootBucket.push(getTrackableValue(this.trackBy, item));
      createSelectionBuckets(item, 1);
    }
    selectionBuckets.set(0, [rootBucket]);

    // Reverse buckets to start from the deepest level first.
    const selectionBucketEntries = Array.from(selectionBuckets.entries())
      .sort(([a], [b]) => b - a)
      .map(([, v]) => v);

    // Normalize selection state.
    for (const levelBuckets of selectionBucketEntries) {
      for (const bucket of levelBuckets) {
        // No optimization possible for 1-element buckets.
        if (bucket.length === 1) {
          continue;
        }
        // Cannot optimize incomplete buckets.
        if (this.isComplete(this.itemKeyToItem.get(bucket[0]) ?? null) === false) {
          continue;
        }
        let selectedCount = 0;
        for (const itemKey of bucket) {
          if (this.itemSelectionState.has(itemKey)) {
            selectedCount++;
          } else {
            break;
          }
        }
        // Remove selection state from buckets where both the parent and all children are selected.
        if (selectedCount === bucket.length) {
          for (const itemKey of bucket) {
            this.itemSelectionState.delete(itemKey);
          }
        }
        // Optimize selection state when all children are selected but the parent is not.
        if (selectedCount === bucket.length - 1 && !this.itemSelectionState.has(bucket[0])) {
          for (const itemKey of bucket) {
            this.itemSelectionState.delete(itemKey);
          }
          this.itemSelectionState.add(bucket[0]);
        }
      }
    }

    // Compute effective indeterminate state.
    for (const levelBuckets of selectionBucketEntries) {
      for (const bucket of levelBuckets) {
        let indeterminate = false;
        for (let i = 1; i < bucket.length; i++) {
          if (this.itemSelectionState.has(bucket[i]) || this.itemEffectiveIndeterminateState.has(bucket[i])) {
            indeterminate = true;
            break;
          }
        }
        if (indeterminate) {
          this.itemEffectiveIndeterminateState.add(bucket[0]);
        }
      }
    }

    const setItemEffectiveSelection = (item: T, isParentSelected: boolean) => {
      const itemKey = getTrackableValue(this.trackBy, item);
      const isSelfSelected = this.itemSelectionState.has(itemKey);
      const isSelected = (isSelfSelected && !isParentSelected) || (!isSelfSelected && isParentSelected);
      if (isSelected) {
        this.itemEffectiveSelectionState.add(itemKey);
      }
      for (const child of this.getChildren(item)) {
        setItemEffectiveSelection(child, isSelected);
      }
    };
    this.rootItems.forEach(item => {
      const isRootSelected = this.itemSelectionState.has(rootItemKey);
      if (isRootSelected) {
        this.itemEffectiveSelectionState.add(rootItemKey);
      }
      setItemEffectiveSelection(item, isRootSelected);
    });
  }

  isItemSelected = (item: T) => this.itemEffectiveSelectionState.has(getTrackableValue(this.trackBy, item));

  isItemIndeterminate = (item: T) => this.itemEffectiveIndeterminateState.has(getTrackableValue(this.trackBy, item));

  isAllItemsSelected = () =>
    this.itemEffectiveSelectionState.has(rootItemKey) && !this.itemEffectiveIndeterminateState.has(rootItemKey);

  isSomeItemsSelected = () => this.itemEffectiveIndeterminateState.has(rootItemKey);

  getState = (): { selectionInverted: boolean; selectedItems: T[] } => {
    const selectionInverted = this.itemSelectionState.has(rootItemKey);
    const selectedItems = Array.from(this.itemSelectionState)
      .filter(itemKey => itemKey !== rootItemKey)
      .map(itemKey => this.itemKeyToItem.get(itemKey)!);
    return { selectionInverted, selectedItems };
  };

  toggleAll = (): ItemSelectionTree<T> => {
    const clone = this.clone();

    if (clone.isAllItemsSelected()) {
      clone.itemSelectionState = new Set<unknown>();
      clone.itemEffectiveSelectionState = new Set<unknown>();
      clone.itemEffectiveIndeterminateState = new Set<unknown>();
    } else {
      clone.itemSelectionState = new Set<unknown>([rootItemKey]);
      clone.itemEffectiveSelectionState = new Set<unknown>();
      clone.itemEffectiveIndeterminateState = new Set<unknown>();
    }
    clone.computeState();

    return clone;
  };

  toggleSome = (requestedItems: readonly T[]): ItemSelectionTree<T> => {
    const clone = this.clone();

    const unselectDeep = (item: T) => {
      clone.itemSelectionState.delete(getTrackableValue(clone.trackBy, item));
      for (const child of clone.getChildren(item)) {
        unselectDeep(child);
      }
    };

    for (const requested of requestedItems) {
      const requestedItemKey = getTrackableValue(clone.trackBy, requested);
      const isIndeterminate = clone.itemEffectiveIndeterminateState.has(requestedItemKey);
      const isSelfSelected = clone.itemSelectionState.has(requestedItemKey);

      unselectDeep(requested);
      if (isIndeterminate || !isSelfSelected) {
        clone.itemSelectionState.add(requestedItemKey);
      }
    }
    clone.itemEffectiveSelectionState = new Set<unknown>();
    clone.itemEffectiveIndeterminateState = new Set<unknown>();
    clone.computeState();

    return clone;
  };

  private clone(): ItemSelectionTree<T> {
    const clone = new ItemSelectionTree([], [], false, this.trackBy, this.getChildren, this.isComplete);
    clone.rootItems = [...this.rootItems];
    clone.itemKeyToItem = new Map(this.itemKeyToItem);
    clone.itemSelectionState = new Set(this.itemSelectionState);
    clone.itemEffectiveSelectionState = new Set(this.itemEffectiveSelectionState);
    clone.itemEffectiveIndeterminateState = new Set(this.itemEffectiveIndeterminateState);
    return clone;
  }
}

export const focusMarkers = {
  item: { ['data-' + SELECTION_ITEM]: 'item' },
  all: { ['data-' + SELECTION_ITEM]: 'all' },
  root: { ['data-' + SELECTION_ROOT]: 'true' },
};
