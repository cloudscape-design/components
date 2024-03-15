// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';

const OVERSCAN = 5;
const UPDATE_FRAME_THROTTLE_MS = 10;
const KILL_SWITCH_THRESHOLD = 5000;

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

  // Requesting an update every time the component is rendered, including re-renders caused by internal state.
  // The code can cause an infinite loop if the effect of the state update constantly changes the output
  // in a way such that another update is required. That is unexpected yet possible. In that case the
  // loop is stopped by a kill-switch upon reaching a threshold.
  // See https://github.com/cloudscape-design/components/pull/1202 for more detail.
  useEffect(() => {
    virtualScroll.requestUpdate({ size, defaultItemSize });
  });

  // Ensuring virtual items array never exceeds the size to avoid overflows.
  // Using indices instead of virtualItems.length because they do not start from 0 when the list is scrolled.
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

    // Request updates every time container width changes.
    const disconnectObserver = this.setupContainerResizeObserver();

    // Request updates every time container is scrolled.
    scrollContainer.addEventListener('scroll', this.onContainerScroll);

    // Request updates every time window dimensions change.
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

  public requestUpdate = ({ size, defaultItemSize }: VirtualScrollUpdateProps) => {
    this.size = size;
    this.defaultItemSize = defaultItemSize;
    this.triggerUpdate({ batchUpdates: false });
  };

  // Scroll container to bring the requested item into view.
  public scrollToIndex = (index: number) => {
    if (!this.scrollContainer) {
      throw new Error('Invariant violation: scrollToIndex used before initialization.');
    }

    index = Math.max(0, Math.min(this.size - 1, index));

    let scrollOffset = 0;
    for (let i = 0; i < index; i++) {
      scrollOffset += this.getSizeOrDefaultForIndex(i);
    }
    const itemSize = this.getSizeOrDefaultForIndex(index);

    const frameTop = this.scrollContainer.scrollTop;
    const containerHeight = this.scrollContainer.getBoundingClientRect().height;
    const frameBottom = frameTop + containerHeight;

    // If the requested item is above the first visible item, update the scrollTop for it to be the first one.
    if (scrollOffset < frameTop) {
      this.scrollContainer.scrollTop = scrollOffset;
    }
    // If the requested item is below the last visible item, update scrollTop for it to be the last one.
    else if (frameBottom < scrollOffset + itemSize) {
      this.scrollContainer.scrollTop = scrollOffset + itemSize - containerHeight;
    }
  };

  private onContainerScroll = (event: Event) => {
    const scrollTop = (event.target as HTMLElement).scrollTop;

    // Compute average item size from the default size and known sizes.
    // This way it is more precise than the default size.
    let totalSize = this.defaultItemSize;
    let knownSizes = 1;
    for (let i = 0; i < this.size; i++) {
      totalSize += this.getSizeForIndex(i) || 0;
      knownSizes += this.getSizeForIndex(i) ? 1 : 0;
    }
    const averageSize = Math.round(totalSize / knownSizes);

    // Update frame start so that the first item offset is the closest to the container scroll.
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

    this.triggerUpdate({ batchUpdates: true });
  };

  private onWindowResize = () => {
    this.triggerUpdate({ batchUpdates: true });
  };

  private onContainerResize = (entries: ResizeObserverEntry[]) => {
    // We only care about container width because the height should never cause a difference due to virtualization.
    // When the width changes, we trigger measures for the visible items only.
    const containerWidth = entries[0].contentBoxSize[0].inlineSize;
    if (containerWidth !== this.previousContainerWidth) {
      this.previousContainerWidth = containerWidth;
      for (let i = this.frameStart; i < this.frameStart + this.frameSize && i < this.size; i++) {
        this.measureRef(i, this.measuredItems[i]);
      }
    }
  };

  // The function is used whenever an item it rendered or unmounted.
  // This way, we always receive the most relevant item height unless it was updated w/o React render.
  private measureRef = (index: number, node: null | HTMLElement) => {
    if (index < 0 || index >= this.size) {
      throw new Error('Invariant violation: measured item index is out of bounds.');
    }
    if (!node && this.getSizeForIndex(index) === null) {
      return;
    }
    this.measuredItems[index] = node;
    this.triggerUpdate({ batchUpdates: true });
  };

  private updateTimer: null | number = null;
  private triggerUpdate = ({ batchUpdates }: { batchUpdates: boolean }) => {
    // Warn if detected an infinite loop and reset the counter.
    this.killSwitchCounter--;
    if (this.killSwitchCounter <= 0) {
      warnOnce('virtual-scroll', 'Reached safety counter, check for infinite loops.');
      setTimeout(() => (this.killSwitchCounter = KILL_SWITCH_THRESHOLD), UPDATE_FRAME_THROTTLE_MS * 2);
    }
    // Issue a batched or an instant frame update.
    else {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      if (batchUpdates) {
        this.updateTimer = setTimeout(() => {
          this.updateFrameIfNeeded();
          this.killSwitchCounter = KILL_SWITCH_THRESHOLD;
        }, UPDATE_FRAME_THROTTLE_MS);
      } else {
        this.updateFrameIfNeeded();
      }
    }
  };

  private updateFrameIfNeeded = () => {
    this.updateFrameSize();

    // Compute indices of the next virtual items.
    const indices: number[] = [];
    for (let i = Math.max(0, this.frameStart - OVERSCAN); i < this.frameStart + this.frameSize && i < this.size; i++) {
      indices.push(i);
    }

    // The first virtual item offset is the cumulative size of all items preceding the frame.
    let runningStart = 0;
    for (let i = 0; indices.length > 0 && i < indices[0]; i++) {
      runningStart += this.getSizeOrDefaultForIndex(i);
    }
    // A state update is required if the next virtual items are any different from the previous.
    let updateRequired = indices.length !== this.previousVirtualItems.length;
    const nextVirtualItems: InternalVirtualItem[] = [];
    for (let i = 0; i < indices.length; i++) {
      const virtualIndex = indices[i];
      const item = { index: virtualIndex, start: runningStart };
      const previousItem = this.previousVirtualItems[i];
      if (!previousItem || previousItem.index !== item.index || previousItem.start !== item.start) {
        updateRequired = true;
      }
      runningStart += this.getSizeOrDefaultForIndex(virtualIndex);
      nextVirtualItems.push(item);
    }

    // The total size is a sum of sizes of all (visible and not) items.
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

  // Frame size is the number of rendered items (the length of virtual items).
  // It is computed by comparing the cumulative size of items sorted from smallest to biggest to the screen hight.
  // This ensures the frame size is always enough to fit the dropdown, assuming the dropdown never exceeds screen height.
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
