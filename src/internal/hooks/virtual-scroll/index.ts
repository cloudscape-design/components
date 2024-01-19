// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';

const OVERSCAN = 5;
const UPDATE_FRAME_THROTTLE_MS = 10;
const KILL_SWITCH_THRESHOLD = 10000;

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
  });

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

class VirtualScroll {
  // Props
  private scrollContainer: null | HTMLElement = null;
  private onFrameChange: (props: FrameUpdate) => void = () => {};

  // State
  private size = 0;
  private defaultItemSize = 0;
  private frameStart = 0;
  private frameSize = 0;
  private measuredItems: (null | HTMLElement)[] = [];
  private previousVirtualItems: InternalVirtualItem[] = [];
  private previousTotalSize = 0;
  private previousContainerWidth = 0;
  private killSwitchCounter = KILL_SWITCH_THRESHOLD;

  public init = ({ scrollContainer, onFrameChange }: VirtualScrollInitProps) => {
    this.scrollContainer = scrollContainer;
    this.onFrameChange = onFrameChange;

    const disconnectObserver = this.setupContainerResizeObserver();
    scrollContainer.addEventListener('scroll', this.onContainerScroll);
    window.addEventListener('resize', this.onWindowResize);

    this.cleanup = () => {
      this.onFrameChange = () => {};
      disconnectObserver();
      scrollContainer.removeEventListener('scroll', this.onContainerScroll);
      window.removeEventListener('resize', this.onWindowResize);
    };
  };

  public cleanup = () => {
    // noop
  };

  private setupContainerResizeObserver = () => {
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(this.onContainerResize);
      resizeObserver.observe(this.scrollContainer!);
      return () => resizeObserver.disconnect();
    }
    return () => {};
  };

  public update = ({ size, defaultItemSize }: VirtualScrollUpdateProps) => {
    this.size = size;
    this.defaultItemSize = defaultItemSize;
    this.requestUpdate(false);
  };

  public scrollToIndex = (index: number) => {
    index = Math.max(0, Math.min(this.size - 1, index));

    let scrollOffset = 0;
    for (let i = 0; i < index; i++) {
      scrollOffset += this.getSizeOrDefaultForIndex(i);
    }
    const itemSize = this.getSizeOrDefaultForIndex(index);

    if (!this.scrollContainer) {
      throw new Error('Invariant violation: scrollToIndex used before initialization.');
    }
    const frameTop = this.scrollContainer.scrollTop;
    const containerHeight = this.scrollContainer.getBoundingClientRect().height;
    const frameBottom = frameTop + containerHeight;
    if (scrollOffset < frameTop) {
      this.scrollContainer.scrollTop = scrollOffset;
    } else if (frameBottom < scrollOffset + itemSize) {
      this.scrollContainer.scrollTop = scrollOffset + itemSize - containerHeight;
    }
  };

  private onContainerScroll = (event: Event) => {
    const scrollTop = (event.target as HTMLElement).scrollTop;

    let totalSize = this.defaultItemSize;
    let knownSizes = 1;
    for (let i = 0; i < this.size; i++) {
      totalSize += this.getSizeForIndex(i) || 0;
      knownSizes += this.getSizeForIndex(i) ? 1 : 0;
    }
    const averageSize = Math.round(totalSize / knownSizes);

    this.frameStart = this.size - 1;
    for (let i = 0, start = 0; i < this.size; i++) {
      const next = start + (this.getSizeForIndex(i) ?? averageSize);
      if (start <= scrollTop && scrollTop <= next) {
        this.frameStart = scrollTop - start < next - scrollTop ? i : i + 1;
        break;
      }
      start = next;
    }
    this.frameStart = Math.max(0, Math.min(this.size - this.frameSize, this.frameStart));

    this.requestUpdate();
  };

  private onWindowResize = () => {
    this.requestUpdate();
  };

  private onContainerResize = (entries: ResizeObserverEntry[]) => {
    const containerWidth = entries[0].contentBoxSize[0].inlineSize;
    if (containerWidth !== this.previousContainerWidth) {
      this.previousContainerWidth = containerWidth;
      for (let i = this.frameStart; i < this.frameStart + this.frameSize && i < this.size; i++) {
        this.measureRef(i, this.measuredItems[i]);
      }
    }
  };

  private measureRef = (index: number, node: null | HTMLElement) => {
    if (!node && this.getSizeForIndex(index) === null) {
      return;
    }
    if (!node) {
      this.measuredItems[index] = null;
      this.requestUpdate();
      return;
    }
    if (index < 0 || index >= this.size) {
      throw new Error('Invariant violation: measured item index is out of bounds.');
    }
    this.measuredItems[index] = node;
    this.requestUpdate();
  };

  private updateTimer: null | number = null;
  private requestUpdate = (batch = true) => {
    this.killSwitchCounter--;
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    if (this.killSwitchCounter > 0) {
      this.updateTimer = setTimeout(() => {
        if (batch) {
          this.updateFrameIfNeeded();
          this.killSwitchCounter = KILL_SWITCH_THRESHOLD;
        }
      }, UPDATE_FRAME_THROTTLE_MS);

      if (!batch) {
        this.updateFrameIfNeeded();
      }
    } else {
      warnOnce('virtual-scroll', 'Reached safety counter, check for infinite loops.');
    }
  };

  private updateFrameIfNeeded = () => {
    this.updateFrameSize();

    const indices: number[] = [];
    for (let i = Math.max(0, this.frameStart - OVERSCAN); i < this.frameStart + this.frameSize && i < this.size; i++) {
      indices.push(i);
    }

    let runningStart = 0;
    for (let i = 0; indices.length > 0 && i < indices[0]; i++) {
      runningStart += this.getSizeOrDefaultForIndex(i);
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
      runningStart += this.getSizeOrDefaultForIndex(virtualIndex);
      nextVirtualItems.push(item);
    }

    let totalSize = 0;
    for (let i = 0; i < this.size; i++) {
      totalSize += this.getSizeOrDefaultForIndex(i);
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
  };

  private updateFrameSize = () => {
    const itemSizesMinToMax: number[] = [];
    for (let i = 0; i < this.size; i++) {
      itemSizesMinToMax.push(this.getSizeOrDefaultForIndex(i));
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

  private getSizeOrDefaultForIndex = (index: number) => {
    return this.getSizeForIndex(index) ?? this.defaultItemSize;
  };

  private getSizeForIndex = (index: number) => {
    return this.measuredItems[index]?.getBoundingClientRect().height ?? null;
  };
}
