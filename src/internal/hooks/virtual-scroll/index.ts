// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { throttle } from '../../utils/throttle';

const OVERSCAN = 5;
const UPDATE_FRAME_THROTTLE_MS = 10;
const SCROLL_TO_OFFSET_DELAY_MS = 25;

export interface VirtualScrollProps {
  size: number;
  defaultItemSize: number;
  containerRef: React.RefObject<HTMLElement>;
}

export interface Virtualizer {
  virtualItems: readonly VirtualItem[];
  totalSize: number;
  scrollToIndex: (index: number) => void;
}

export interface VirtualItem extends InternalVirtualItem {
  measureRef: (node: null | HTMLElement) => void;
}

interface InternalVirtualItem {
  index: number;
  start: number;
}

export function useVirtualScroll({ size, defaultItemSize, containerRef }: VirtualScrollProps): Virtualizer {
  const [virtualItems, setVirtualItems] = useState<readonly VirtualItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);

  const virtualScroll = useMemo(() => new VirtualScroll(), []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      virtualScroll.init({
        scrollContainer: containerRef.current,
        onFrameChange: ({ virtualItems, totalSize }) => {
          setVirtualItems(virtualItems);
          setTotalSize(totalSize);
        },
      });
    }
    return () => virtualScroll.cleanup();
  }, [virtualScroll, containerRef]);

  useEffect(() => {
    virtualScroll.update({ size, defaultItemSize });
  }, [virtualScroll, size, defaultItemSize]);

  const safeVirtualItems = useMemo(() => virtualItems.filter(item => item.index < size), [virtualItems, size]);

  return {
    virtualItems: safeVirtualItems,
    totalSize,
    scrollToIndex: virtualScroll.scrollToIndex,
  };
}

interface VirtualScrollInitProps {
  scrollContainer: HTMLElement;
  onFrameChange: (props: FrameUpdate) => void;
}

interface VirtualScrollUpdateProps {
  size: number;
  defaultItemSize: number;
}

interface FrameUpdate {
  totalSize: number;
  virtualItems: readonly VirtualItem[];
}

export class VirtualScroll {
  // Props
  private scrollContainer: null | HTMLElement = null;
  private onFrameChange: (props: FrameUpdate) => void = () => {};

  // State
  private size = 0;
  private defaultItemSize = 0;
  private frameStart = 0;
  private frameSize = 0;
  private measuredItemSizes: (number | null)[] = [];
  private previousVirtualItems: InternalVirtualItem[] = [];
  private previousTotalSize = 0;
  private previousScrollTop = 0;

  public init = ({ scrollContainer, onFrameChange }: VirtualScrollInitProps) => {
    this.scrollContainer = scrollContainer;
    this.onFrameChange = onFrameChange;

    scrollContainer.addEventListener('scroll', this.onContainerScroll);
    window.addEventListener('resize', this.onWindowResize);

    this.cleanup = () => {
      this.onFrameChange = () => {};
      scrollContainer.removeEventListener('scroll', this.onContainerScroll);
      window.removeEventListener('resize', this.onWindowResize);
    };
  };

  public cleanup = () => {
    // noop
  };

  public update = ({ size, defaultItemSize }: VirtualScrollUpdateProps) => {
    this.size = size;
    this.defaultItemSize = defaultItemSize;
    this.updateFrameIfNeeded();
  };

  public scrollToIndex = (index: number) => {
    this.frameStart = Math.min(this.size, Math.max(0, index));
    this.updateFrameIfNeeded();
    setTimeout(() => {
      let scrollOffset = 0;
      for (let i = 0; i < this.frameStart; i++) {
        scrollOffset += this.getSizeForIndex(i);
      }
      if (!this.scrollContainer) {
        throw new Error('Invariant violation: using virtual scroll before initialization.');
      }
      this.scrollContainer.scrollTop = scrollOffset;
    }, SCROLL_TO_OFFSET_DELAY_MS);
  };

  private onContainerScroll = (event: Event) => {
    const scrollTop = (event.target as HTMLElement).scrollTop;

    if (scrollTop !== this.previousScrollTop) {
      this.previousScrollTop = scrollTop;

      let totalSize = this.defaultItemSize;
      let knownSizes = 1;
      for (let i = 0; i < this.size; i++) {
        totalSize += this.measuredItemSizes[i] || 0;
        knownSizes += this.measuredItemSizes[i] ? 1 : 0;
      }
      const averageSize = Math.round(totalSize / knownSizes);

      this.frameStart = this.size - 1;
      for (let i = 0, start = 0; i < this.size; i++) {
        const next = start + (this.measuredItemSizes[i] ?? averageSize);
        if (start <= scrollTop && scrollTop <= next) {
          this.frameStart = Math.min(this.size - 1, scrollTop - start < next - scrollTop ? i : i + 1);
          break;
        }
        start = next;
      }

      this.updateFrameIfNeeded();
    }
  };

  private onWindowResize = () => {
    this.updateFrameIfNeeded();
  };

  private measureRef = (index: number, node: null | HTMLElement) => {
    if (!node && this.measuredItemSizes[index] === null) {
      return;
    }
    if (!node) {
      this.measuredItemSizes[index] = null;
      this.updateFrameIfNeeded();
      return;
    }
    if (index < 0 || index >= this.size) {
      throw new Error('Invariant violation: measured item index is out of bounds.');
    }
    const size = node.getBoundingClientRect().height;
    if (size === this.measuredItemSizes[index]) {
      return;
    }
    this.measuredItemSizes[index] = size;
    this.updateFrameIfNeeded();
  };

  private updateFrameIfNeeded = throttle(() => {
    this.updateFrameSize();

    const indices: number[] = [];
    for (let i = Math.max(0, this.frameStart - OVERSCAN); i < this.frameStart + this.frameSize && i < this.size; i++) {
      indices.push(i);
    }

    let runningStart = 0;
    for (let i = 0; indices.length > 0 && i < indices[0]; i++) {
      runningStart += this.getSizeForIndex(i);
    }
    let updateRequired = indices.length !== this.previousVirtualItems.length;
    const nextVirtualItems: InternalVirtualItem[] = [];
    for (let i = 0; i < indices.length; i++) {
      const virtualIndex = indices[i];
      const item = { index: virtualIndex, start: runningStart };
      const previousItem = this.previousVirtualItems[i];
      if (!updateRequired && (previousItem.index !== item.index || previousItem.start !== item.start)) {
        updateRequired = true;
      }
      runningStart += this.getSizeForIndex(virtualIndex);
      nextVirtualItems.push(item);
    }

    let totalSize = 0;
    for (let i = 0; i < this.size; i++) {
      totalSize += this.getSizeForIndex(i);
    }
    if (totalSize !== this.previousTotalSize) {
      updateRequired = true;
    }

    if (updateRequired) {
      this.previousVirtualItems = nextVirtualItems;
      this.previousTotalSize = totalSize;
      this.onFrameChange({
        totalSize,
        virtualItems: nextVirtualItems.map(item => ({ ...item, measureRef: this.measureRef.bind(this, item.index) })),
      });
    }
  }, UPDATE_FRAME_THROTTLE_MS);

  private updateFrameSize = () => {
    const itemSizesMinToMax: number[] = [];
    for (const size of this.measuredItemSizes) {
      itemSizesMinToMax.push(size ?? this.defaultItemSize);
    }
    itemSizesMinToMax.sort((a, b) => a - b);

    this.frameSize = this.size;
    let contentSize = 0;
    for (let i = 0; i < this.size; i++) {
      contentSize += itemSizesMinToMax[i];
      if (contentSize > window.innerHeight) {
        this.frameSize = i;
        break;
      }
    }
  };

  private getSizeForIndex(index: number) {
    return this.measuredItemSizes[index] ?? this.defaultItemSize;
  }
}
