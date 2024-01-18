// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { InternalFrameUpdate, InternalVirtualItem } from './interfaces';
import { createVirtualIndices } from './utils';

interface VirtualFrameProps {
  defaultItemSize: number;
  onSizesUpdated: () => void;
}

/**
 * A data structure to maintain items / virtual frame relation.
 */
export class VirtualFrame<Item extends object> {
  private _items: readonly Item[] = [];
  private _defaultItemSize: number;
  private _frameStart = 0;
  private _frameSize = 0;
  private _virtualItems: readonly InternalVirtualItem[] = [];
  private _cachedItemSizesByIndex: (number | null)[] = [];
  private _cachedItemSizesByTrackedProperty = new Map<any, number>();
  private _measuredSizes = new Set<number>();
  private trackBy: (item: Item) => any;

  constructor({ defaultItemSize }: VirtualFrameProps) {
    this._defaultItemSize = defaultItemSize;

    // When no explicit trackBy provided default to identity function - the items will be matched by reference.
    // When the item identity is not maintained it is not possible to keep the cached sizes which may result
    // in scrollbar size "jumps" (when the item size differs from the default) that can be otherwise avoided.
    this.trackBy = item => item;

    window.addEventListener('resize', this.updateFrameIfNeeded);
  }

  public cleanup = () => {
    window.removeEventListener('resize', this.updateFrameIfNeeded);
  };
  public get defaultItemSize() {
    return this._defaultItemSize;
  }
  public get frameStart() {
    return this._frameStart;
  }
  public get frameSize() {
    return this._frameSize;
  }
  public get totalSize() {
    return this._items.length;
  }

  // TODO: make scroll offset direction aware. Depending on the direction align focused index
  // to the start or end of the corresponding element edge.
  // TODO: maintain offset between currently focused cell and cell edge when scrolling to index.
  public getScrollOffset(index: number) {
    let scrollOffset = 0;
    for (let i = 0; i < index; i++) {
      scrollOffset += this.getSizeForIndex(i);
    }
    // if (index > this._frameStart) {
    //   for (let i = index; i < this.totalSize; i++) {
    //     scrollOffset += this.getSizeForIndex(i);
    //   }
    // }
    return scrollOffset;
  }

  public getAverageItemSize() {
    let totalSize = 0;
    let knownSizes = 0;
    for (let i = 0; i < this.totalSize; i++) {
      const itemSize = this._cachedItemSizesByIndex[i];
      if (itemSize !== null) {
        totalSize += itemSize;
        knownSizes++;
      }
    }
    // TODO: update
    return isNaN(totalSize / knownSizes) ? this.defaultItemSize : totalSize / knownSizes;
  }

  // The "ready" state means all item sizes for the current frame have been set with "setItemSize".
  // Non-ready state is possible for a short period of time during the next frame rendering.
  // If the non-ready state persists it is likely to indicate a misuse of the utility.
  public isReady() {
    return this._virtualItems.every(item => this._measuredSizes.has(item.index));
  }

  public setItems(items: readonly Item[]): InternalFrameUpdate {
    this._items = items;
    this.updateCachedSizes();
    return this.updateFrameIfNeeded();
  }

  public setDefaultItemSize(defaultItemSize: number): InternalFrameUpdate {
    this._defaultItemSize = defaultItemSize;
    return this.updateFrameIfNeeded();
  }

  public setFrameStart(frameStart: number): InternalFrameUpdate {
    return this.updateFrame({ frameStart });
  }

  public setItemSize(index: number, size: number) {
    const item = this._items[index];
    if (!item) {
      throw new Error('Invariant violation: item index is out of bounds.');
    }

    this._measuredSizes.add(index);
    this._cachedItemSizesByIndex[index] = size;
    this._cachedItemSizesByTrackedProperty.set(this.trackBy(item), size);

    this.updateFrameIfNeeded();
  }

  public updateFrameIfNeeded(): InternalFrameUpdate {
    if (this.totalSize === 0) {
      return this.updateFrame({ frameSize: 0 });
    }

    const itemSizesMinToMax: number[] = [];
    for (const size of this._cachedItemSizesByIndex) {
      itemSizesMinToMax.push(size ?? this.defaultItemSize);
    }
    itemSizesMinToMax.sort((a, b) => a - b);
    let frameSize = 0;
    let contentSize = 0;
    for (let i = 0; i < itemSizesMinToMax.length; i++) {
      contentSize += itemSizesMinToMax[i];
      frameSize = Math.max(this.frameSize, i + 1);
      if (contentSize > window.innerHeight) {
        break;
      }
    }

    return this.updateFrame({ frameSize });
  }

  private updateFrame({
    frameStart = this.frameStart,
    frameSize = this.frameSize,
  }: {
    frameStart?: number;
    frameSize?: number;
  }): InternalFrameUpdate {
    frameStart = Math.max(0, Math.min(this.totalSize - this.frameSize, frameStart));

    // Update frame props and frame window.
    this._frameStart = frameStart;
    this._frameSize = frameSize;
    const indices = createVirtualIndices({ frameStart, frameSize, totalSize: this.totalSize });

    let accSize = 0;
    for (let i = 0; i < indices[0] && i < this.totalSize; i++) {
      accSize += this.getSizeForIndex(i);
    }

    const nextVirtualItems = indices.map(index => {
      const item = { index, start: accSize };
      accSize += this.getSizeForIndex(index);
      return item;
    });
    if (nextVirtualItems.length !== this._virtualItems.length) {
      this._virtualItems = nextVirtualItems;
    }
    for (let i = 0; i < nextVirtualItems.length; i++) {
      if (
        nextVirtualItems[i].index !== this._virtualItems[i].index ||
        nextVirtualItems[i].start !== this._virtualItems[i].start
      ) {
        this._virtualItems = nextVirtualItems;
        break;
      }
    }

    let totalSize = 0;
    for (let i = 0; i < this.totalSize; i++) {
      totalSize += this.getSizeForIndex(i);
    }

    return { frame: this._virtualItems, totalSize };
  }

  private getSizeForIndex(index: number) {
    return this._cachedItemSizesByIndex[index] ?? this.defaultItemSize;
  }

  private updateCachedSizes() {
    this._cachedItemSizesByIndex = [];
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      const cachedSize = this._cachedItemSizesByTrackedProperty.get(this.trackBy(item));
      this._cachedItemSizesByIndex.push(cachedSize ?? null);
    }
  }
}
