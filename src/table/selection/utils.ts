// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '../interfaces';
import { getTrackableValue } from '../utils';

export const SELECTION_ITEM = 'selection-item';
export const SELECTION_ROOT = 'selection-root';

// A set, that compares items by their "trackables" (the results of applying `trackBy` to them)
export class ItemSet<T> {
  private trackBy: TableProps.TrackBy<T> | undefined;
  private map: Map<unknown, T> = new Map();

  constructor(trackBy: TableProps.TrackBy<T> | undefined, items: ReadonlyArray<T>) {
    this.trackBy = trackBy;
    items.forEach(this.put);
  }

  put = (item: T) => this.map.set.call(this.map, getTrackableValue(this.trackBy, item), item);
  delete = (item: T) => this.map.delete.call(this.map, getTrackableValue(this.trackBy, item));
  has = (item: T) => this.map.has.call(this.map, getTrackableValue(this.trackBy, item));
  forEach = this.map.forEach.bind(this.map);
}

export class ItemMap<T> {
  private trackBy: TableProps.TrackBy<T> | undefined;
  private map: Map<unknown, boolean> = new Map();

  constructor(trackBy: TableProps.TrackBy<T> | undefined) {
    this.trackBy = trackBy;
  }

  set = (item: T, value: boolean) => this.map.set.call(this.map, getTrackableValue(this.trackBy, item), value);
  get = (item: T) => this.map.get.call(this.map, getTrackableValue(this.trackBy, item));
  has = (item: T) => this.map.has.call(this.map, getTrackableValue(this.trackBy, item));
  forEach = this.map.forEach.bind(this.map);
}

const rootItemKey = Symbol('selection-tree-root');

export class ItemSelectionTree<T> {
  private rootItems: readonly T[];
  private trackBy: TableProps.TrackBy<T> | undefined;
  private getChildren: (item: T) => readonly T[];
  private itemKeyToItem = new Map<unknown, T>();
  private itemSelectionState = new Set<unknown>();
  private itemEffectiveSelectionState = new Set<unknown>();
  private itemEffectiveIndeterminateState = new Set<unknown>();

  constructor(
    rootItems: readonly T[],
    selectedItems: readonly T[],
    selectionInverted: boolean,
    trackBy: TableProps.TrackBy<T> | undefined,
    getChildren: (item: T) => readonly T[]
  ) {
    this.rootItems = rootItems;
    this.trackBy = trackBy;
    this.getChildren = getChildren;

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
      const isIndeterminate = this.itemEffectiveIndeterminateState.has(itemKey);
      const isSelected = (isSelfSelected && !isParentSelected) || (!isSelfSelected && isParentSelected);
      if (isSelected && !isIndeterminate) {
        this.itemEffectiveSelectionState.add(itemKey);
      }
      for (const child of this.getChildren(item)) {
        setItemEffectiveSelection(child, isSelected);
      }
    };
    this.rootItems.forEach(item => {
      const isRootSelected = this.itemSelectionState.has(rootItemKey);
      setItemEffectiveSelection(item, isRootSelected);
    });
  }

  toggleAll = () => {
    if (this.isAllItemsSelected()) {
      this.itemSelectionState = new Set<unknown>();
      this.itemEffectiveSelectionState = new Set<unknown>();
      this.itemEffectiveIndeterminateState = new Set<unknown>();
    } else {
      this.itemSelectionState = new Set<unknown>([rootItemKey]);
      this.itemEffectiveSelectionState = new Set<unknown>();
      this.itemEffectiveIndeterminateState = new Set<unknown>();
    }
  };

  toggleSome = (requestedItems: readonly T[]) => {
    this.itemEffectiveSelectionState = new Set<unknown>();
    this.itemEffectiveIndeterminateState = new Set<unknown>();

    const unselectDeep = (item: T) => {
      this.itemSelectionState.delete(getTrackableValue(this.trackBy, item));
      for (const child of this.getChildren(item)) {
        unselectDeep(child);
      }
    };

    for (const requested of requestedItems) {
      const requestedItemKey = getTrackableValue(this.trackBy, requested);
      const isSelected = this.itemSelectionState.has(requestedItemKey);

      unselectDeep(requested);
      if (!isSelected) {
        this.itemSelectionState.add(requestedItemKey);
      }
    }

    this.computeState();
  };

  isSelected = (item: T) => this.itemEffectiveSelectionState.has(getTrackableValue(this.trackBy, item));

  isIndeterminate = (item: T) => this.itemEffectiveIndeterminateState.has(getTrackableValue(this.trackBy, item));

  isAllItemsSelected = () => this.itemEffectiveSelectionState.has(rootItemKey);

  isSomeItemsSelected = () => this.itemEffectiveIndeterminateState.has(rootItemKey);

  getSelectionState = (): T[] => Array.from(this.itemSelectionState).map(itemKey => this.itemKeyToItem.get(itemKey)!);
}

export const focusMarkers = {
  item: { ['data-' + SELECTION_ITEM]: 'item' },
  all: { ['data-' + SELECTION_ITEM]: 'all' },
  root: { ['data-' + SELECTION_ROOT]: 'true' },
};
