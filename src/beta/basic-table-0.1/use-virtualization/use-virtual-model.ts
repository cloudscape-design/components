// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// Count-based windowing + opt-in measurement engine for `useVirtualization`. A single owned inner
// scroll container; the body windows within it. Rows are fixed at `estimatedRowHeight` by default
// (so a 100k fixed-row dataset never pays ResizeObserver cost), and only `'auto'` rows (wrapping
// raw lines, or rows whose consumer has expanded them into nested content) are measured. Measured
// growth above the fold is corrected by re-anchoring on the first visible row's INDEX, so scroll
// position stays put as variable heights are discovered. Keyed purely by INDEX — the model does
// not know item identity, so there is no trackBy / rowById here.

const DEFAULT_VIEWPORT = 600;

export interface WindowSlot {
  index: number;
  start: number;
  size: number;
  auto: boolean;
}

interface UseVirtualModelParams {
  count: number;
  estimatedRowHeight: number;
  getRowHeight?: (index: number) => number | 'auto';
  getExpandedRowHeight?: (index: number) => number | undefined;
  overscan: number;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}

export interface VirtualModel {
  window: WindowSlot[];
  totalSize: number;
  firstIndex: number;
  lastIndex: number;
  measureRef: (index: number, auto: boolean) => (node: HTMLElement | null) => void;
  scrollToEnd: () => void;
  scrollToIndex: (index: number) => void;
  isPinnedToEnd: () => boolean;
}

// Largest i such that offsets[i] <= target (offsets is strictly non-decreasing).
function findFloorIndex(offsets: number[], target: number): number {
  let lo = 0;
  let hi = offsets.length - 1;
  let result = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (offsets[mid] <= target) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}

export function useVirtualModel({
  count,
  estimatedRowHeight,
  getRowHeight,
  getExpandedRowHeight,
  overscan,
  scrollContainerRef,
}: UseVirtualModelParams): VirtualModel {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [measureVersion, setMeasureVersion] = useState(0);

  // Measured 'auto' row heights, keyed by row INDEX.
  const measured = useRef(new Map<number, number>());
  const observers = useRef(new Map<number, { node: HTMLElement; ro: ResizeObserver }>());
  const anchor = useRef<{ index: number; top: number } | null>(null);
  const pinnedToEndRef = useRef(false);
  // Suppresses the next scroll event's end-pin re-engage. `scrollToIndex` sets this before it
  // assigns `scrollTop`, so the scroll it triggers near the bottom does not immediately re-latch
  // the live-tail pin it just released.
  const suppressPinEngage = useRef(false);
  const lastScrollTopRef = useRef(0);

  const latest = useRef({ getRowHeight, getExpandedRowHeight, estimatedRowHeight });
  latest.current = { getRowHeight, getExpandedRowHeight, estimatedRowHeight };

  // Full-dataset offset table. Rebuilt when the row count, base height, or a measurement changes;
  // reads the height callbacks from a ref so an unstable inline `getRowHeight` closure does not
  // retrigger the O(count) scan every render.
  const layout = useMemo(() => {
    const { getRowHeight: grh, getExpandedRowHeight: gerh, estimatedRowHeight: est } = latest.current;
    const offsets: number[] = new Array(count);
    const autoFlags: boolean[] = new Array(count);
    let cursor = 0;
    for (let i = 0; i < count; i++) {
      offsets[i] = cursor;
      const raw = grh ? grh(i) : est;
      const auto = raw === 'auto';
      autoFlags[i] = auto;
      const seed = (gerh ? gerh(i) : undefined) ?? est;
      const size = auto ? (measured.current.get(i) ?? seed) : (raw as number);
      cursor += size;
    }
    return { offsets, autoFlags, totalSize: cursor };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, estimatedRowHeight, measureVersion]);

  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  // Viewport measurement.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return;
    }
    setViewport(el.clientHeight || DEFAULT_VIEWPORT);
    setScrollTop(el.scrollTop);
    lastScrollTopRef.current = el.scrollTop;
    const ro = new ResizeObserver(() => setViewport(el.clientHeight || DEFAULT_VIEWPORT));
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollContainerRef]);

  // Scroll tracking + anchor capture + live-tail engage latch.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return;
    }
    const onScroll = () => {
      const top = el.scrollTop;
      lastScrollTopRef.current = top;
      setScrollTop(top);
      const { offsets } = layoutRef.current;
      const idx = findFloorIndex(offsets, top);
      anchor.current = { index: idx, top: offsets[idx] - top };
      // Sticky end-pin latch (live-tail auto-follow): only ENGAGE when the viewport reaches the
      // bottom (within one row); release is driven exclusively by genuine user-intent gestures.
      // A programmatic `scrollToIndex` near the bottom sets `suppressPinEngage` so the scroll it
      // triggers does not re-latch the pin it just released.
      const gap = el.scrollHeight - (top + el.clientHeight);
      if (gap <= latest.current.estimatedRowHeight && !suppressPinEngage.current) {
        pinnedToEndRef.current = true;
      }
      suppressPinEngage.current = false;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollContainerRef]);

  // Release live-tail follow only on a genuine user-intent gesture.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return;
    }
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        pinnedToEndRef.current = false;
      }
    };
    const onTouchMove = () => {
      pinnedToEndRef.current = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Home') {
        pinnedToEndRef.current = false;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('keydown', onKeyDown);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('keydown', onKeyDown);
    };
  }, [scrollContainerRef]);

  // Anchor preservation + live-tail re-target after a layout change (measurement / append).
  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return;
    }
    if (pinnedToEndRef.current) {
      const end = el.scrollHeight - el.clientHeight;
      if (Math.abs(end - el.scrollTop) > 0.5) {
        el.scrollTop = end;
        lastScrollTopRef.current = end;
        setScrollTop(end);
      }
      return;
    }
    if (!anchor.current) {
      return;
    }
    const newStart = layout.offsets[anchor.current.index];
    if (newStart === undefined) {
      return;
    }
    const desiredTop = newStart - anchor.current.top;
    if (Math.abs(desiredTop - el.scrollTop) > 0.5) {
      el.scrollTop = desiredTop;
      lastScrollTopRef.current = desiredTop;
      setScrollTop(desiredTop);
    }
  }, [measureVersion, layout, scrollContainerRef]);

  const measureRef = useCallback(
    (index: number, auto: boolean) => (node: HTMLElement | null) => {
      const existing = observers.current.get(index);
      if (!node) {
        if (existing) {
          existing.ro.disconnect();
          observers.current.delete(index);
        }
        return;
      }
      // Fixed-height slots are never observed — they never pay measurement cost.
      if (!auto) {
        return;
      }
      if (existing && existing.node === node) {
        return;
      }
      if (existing) {
        existing.ro.disconnect();
      }
      const ro = new ResizeObserver(() => {
        const h = node.getBoundingClientRect().height;
        const prev = measured.current.get(index);
        if (prev === undefined || Math.abs(prev - h) > 0.5) {
          measured.current.set(index, h);
          setMeasureVersion(v => v + 1);
        }
      });
      ro.observe(node);
      observers.current.set(index, { node, ro });
    },
    []
  );

  useEffect(() => {
    const map = observers.current;
    return () => {
      map.forEach(({ ro }) => ro.disconnect());
      map.clear();
    };
  }, []);

  const {
    window: windowedSlots,
    firstIndex,
    lastIndex,
  } = useMemo(() => {
    const { offsets, autoFlags, totalSize } = layout;
    if (count === 0) {
      return { window: [] as WindowSlot[], firstIndex: -1, lastIndex: -1 };
    }
    const effectiveViewport = viewport || DEFAULT_VIEWPORT;
    const firstVisible = findFloorIndex(offsets, scrollTop);
    const lastVisible = findFloorIndex(offsets, scrollTop + effectiveViewport);
    const startIdx = Math.max(0, firstVisible - overscan);
    const endIdx = Math.min(count - 1, lastVisible + overscan);

    const positioned: WindowSlot[] = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const start = offsets[i];
      const size = (i + 1 < count ? offsets[i + 1] : totalSize) - start;
      positioned.push({ index: i, start, size, auto: autoFlags[i] });
    }
    return { window: positioned, firstIndex: startIdx, lastIndex: endIdx };
  }, [layout, scrollTop, viewport, overscan, count]);

  const scrollToEnd = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      pinnedToEndRef.current = true;
      const end = el.scrollHeight - el.clientHeight;
      lastScrollTopRef.current = end;
      el.scrollTop = end;
    }
  }, [scrollContainerRef]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollContainerRef.current;
      if (!el || index < 0 || index >= count) {
        return;
      }
      const start = layout.offsets[index];
      if (start !== undefined) {
        // A programmatic scroll-to-row is an explicit "go here" intent, so release the
        // live-tail pin (otherwise the pinned layout effect snaps back to the bottom and the
        // target is never revealed). Re-anchor the target at the viewport top so a subsequent
        // layout change (e.g. the consumer expanding this row) holds the target, not the bottom.
        pinnedToEndRef.current = false;
        suppressPinEngage.current = true;
        anchor.current = { index, top: 0 };
        lastScrollTopRef.current = start;
        el.scrollTop = start;
      }
    },
    [scrollContainerRef, count, layout]
  );

  const isPinnedToEnd = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return false;
    }
    // Tolerate within one row of the bottom (fractional row/border heights clamp a few sub-pixels
    // short of the true max, which an exact check misreads as "not pinned").
    return el.scrollHeight - (el.scrollTop + el.clientHeight) <= latest.current.estimatedRowHeight;
  }, [scrollContainerRef]);

  return {
    window: windowedSlots,
    totalSize: layout.totalSize,
    firstIndex,
    lastIndex,
    measureRef,
    scrollToEnd,
    scrollToIndex,
    isPinnedToEnd,
  };
}
