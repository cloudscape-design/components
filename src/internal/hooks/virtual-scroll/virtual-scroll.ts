// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { throttle } from '../../utils/throttle';
import { InternalFrameUpdate } from './interfaces';
import { VirtualFrame } from './virtual-frame';

const SCROLL_THROTTLE_MS = 10;
const ON_SIZES_UPDATED_THROTTLE_MS = 25;

interface VirtualScrollProps<Item> {
  items: readonly Item[];
  defaultItemSize: number;
  scrollContainer: HTMLElement;
  onFrameChange: (props: InternalFrameUpdate) => void;
}

export class VirtualScrollModel<Item extends object> {
  // Props
  public readonly scrollContainer: HTMLElement;
  private onFrameChange: (props: InternalFrameUpdate) => void;

  // State
  private frame: VirtualFrame<Item>;
  private scrollTop = 0;
  private cleanupCallbacks: (() => void)[] = [];

  constructor({ defaultItemSize, scrollContainer, onFrameChange }: VirtualScrollProps<Item>) {
    this.scrollContainer = scrollContainer;
    this.onFrameChange = onFrameChange;

    const onSizesUpdated = throttle(() => {
      const nextFrame = this.frame.updateFrameIfNeeded();
      onFrameChange(nextFrame);
    }, ON_SIZES_UPDATED_THROTTLE_MS);
    this.frame = new VirtualFrame<Item>({ defaultItemSize, onSizesUpdated });

    scrollContainer.addEventListener('scroll', this.handleScroll);
    this.cleanupCallbacks.push(() => scrollContainer.removeEventListener('scroll', this.handleScroll));
  }

  public cleanup = () => {
    for (const cb of this.cleanupCallbacks) {
      try {
        cb();
      } catch (error: unknown) {
        console.warn(error instanceof Error ? error.message : error);
      }
    }
  };

  public setItems(items: readonly Item[]) {
    const nextFrame = this.frame.setItems(items);
    this.onFrameChange(nextFrame);
  }

  public setDefaultItemSize(defaultItemSize: number) {
    const nextFrame = this.frame.setDefaultItemSize(defaultItemSize);
    this.onFrameChange(nextFrame);
  }

  public setItemSize(index: number, size: number) {
    this.frame.setItemSize(index, size);
  }

  public scrollToIndex = (index: number) => {
    index = Math.min(this.frame.totalSize, Math.max(0, index));

    const nextFrame = this.frame.setFrameStart(index);
    this.onFrameChange(nextFrame);

    // TODO: replace timeout with signal (next onSizesUpdated)
    setTimeout(() => {
      this.scrollContainer.scrollTop = this.frame.getScrollOffset(index);
    }, 25);
  };

  private handleScroll = throttle((event: Event) => {
    if (!this.frame.isReady()) {
      return;
    }

    const scrollValue = (event.target as HTMLElement).scrollTop;

    if (this.scrollTop === scrollValue) {
      return;
    }
    this.scrollTop = scrollValue;

    const averageItemSize = this.frame.getAverageItemSize();
    let frameStart = Math.round(scrollValue / averageItemSize);
    frameStart = Math.max(0, Math.min(this.frame.totalSize - this.frame.frameSize, frameStart));

    const nextFrame = this.frame.setFrameStart(frameStart);
    this.onFrameChange(nextFrame);
  }, SCROLL_THROTTLE_MS);
}
