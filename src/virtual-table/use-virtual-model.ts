// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// Windowing + opt-in measurement engine for VirtualTable (impl-F1-A1-core).
// Owns a single inner scroll container (design B4): the grid is the scroll root and
// the body windows within it. Rows default to a fixed `estimatedRowHeight`; only rows
// whose height strategy resolves to "auto" are observed (design B5) so a 100k
// fixed-row dataset never pays ResizeObserver cost. Measured growth of rows above the
// fold is corrected by re-anchoring on the first visible row's identity, so scroll
// position stays put as variable/expanded heights are discovered (no CW-3 drift).

// Pre-measurement placeholder used to size the runway for an expanded region for one
// frame before its real height is observed. NOT a CloudWatch density constant — CW's
// 300/150 come from the consumer (getExpandedRowHeight) or from measurement.
const DEFAULT_EXPANDED_ESTIMATE = 200;
const DEFAULT_VIEWPORT = 600;

// A row slot is either a data row or the expanded region row that follows it. The
// expanded slot is a real grid row in the DOM (design B2) but does not consume a
// data-row aria-rowindex (design B1) — the index sequence tracks data rows only.
export interface RowSlot {
  type: 'data' | 'expanded';
  index: number;
  key: string;
  auto: boolean;
}

export interface PositionedSlot extends RowSlot {
  start: number;
  size: number;
}

interface UseVirtualModelParams<T> {
  items: ReadonlyArray<T>;
  trackBy: (item: T) => string;
  expandedIds: ReadonlySet<string>;
  expandedSignature: string;
  estimatedRowHeight: number;
  getRowHeight?: (item: T) => number | 'auto';
  getExpandedRowHeight?: (item: T) => number | 'auto';
  overscan: number;
  scrollContainerRef: React.RefObject<HTMLElement>;
}

export interface VirtualModel {
  slots: PositionedSlot[];
  totalSize: number;
  firstIndex: number;
  lastIndex: number;
  measureRef: (key: string, auto: boolean) => (node: HTMLElement | null) => void;
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

export function useVirtualModel<T>({
  items,
  trackBy,
  expandedIds,
  expandedSignature,
  estimatedRowHeight,
  getRowHeight,
  getExpandedRowHeight,
  overscan,
  scrollContainerRef,
}: UseVirtualModelParams<T>): VirtualModel {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [measureVersion, setMeasureVersion] = useState(0);

  const measured = useRef(new Map<string, number>());
  const observers = useRef(new Map<string, { node: HTMLElement; ro: ResizeObserver }>());
  // Anchor recorded on scroll: the first visible data row's id and its distance from
  // the top of the viewport. Used to correct scroll offset after measurement.
  const anchor = useRef<{ id: string; top: number } | null>(null);

  // Latest height strategies read without forcing the layout memo to depend on their
  // (often unstable) function identity; layout recomputes on data/expansion/measure
  // changes, which is when heights actually change.
  const latest = useRef({ getRowHeight, getExpandedRowHeight, estimatedRowHeight });
  latest.current = { getRowHeight, getExpandedRowHeight, estimatedRowHeight };

  // Layout is O(items.length) and recomputes when items / expansion / measurements
  // change. For the fixed-row large-data default there are no measurement bumps, so it
  // runs once per data change; a fully-'auto' dataset re-runs on each measurement burst
  // (the documented opt-in-measurement tradeoff, design B5 — keep the fixed-row fast
  // path as the large-data guidance in -docs).
  const layout = useMemo(() => {
    const { getRowHeight: grh, getExpandedRowHeight: gerh, estimatedRowHeight: est } = latest.current;
    const slots: RowSlot[] = [];
    const offsets: number[] = [];
    const startById = new Map<string, number>();
    let cursor = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = trackBy(item);

      const rawData = grh ? grh(item) : est;
      const dataAuto = rawData === 'auto';
      const dataSize = dataAuto ? (measured.current.get('d:' + id) ?? est) : (rawData as number);
      slots.push({ type: 'data', index: i, key: 'd:' + id, auto: dataAuto });
      offsets.push(cursor);
      startById.set(id, cursor);
      cursor += dataSize;

      if (expandedIds.has(id)) {
        const rawExp = gerh ? gerh(item) : 'auto';
        const expAuto = rawExp === 'auto';
        const expSize = expAuto ? (measured.current.get('e:' + id) ?? DEFAULT_EXPANDED_ESTIMATE) : (rawExp as number);
        slots.push({ type: 'expanded', index: i, key: 'e:' + id, auto: expAuto });
        offsets.push(cursor);
        cursor += expSize;
      }
    }

    return { slots, offsets, startById, totalSize: cursor };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, expandedSignature, estimatedRowHeight, measureVersion, trackBy]);

  // Observe the container's own height so windowing tracks viewport resize.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return;
    }
    setViewport(el.clientHeight || DEFAULT_VIEWPORT);
    setScrollTop(el.scrollTop);
    const ro = new ResizeObserver(() => setViewport(el.clientHeight || DEFAULT_VIEWPORT));
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollContainerRef]);

  // Read `layout` through a ref so the scroll listener attaches exactly once instead
  // of re-subscribing on every layout identity change (NB4).
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  // Track scroll position and record the anchor row (first visible data row) so a
  // later measurement of a row above it can re-anchor without a visible jump.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return;
    }
    const onScroll = () => {
      const top = el.scrollTop;
      setScrollTop(top);
      const { slots, offsets } = layoutRef.current;
      const idx = findFloorIndex(offsets, top);
      for (let i = idx; i < slots.length; i++) {
        if (slots[i].type === 'data') {
          anchor.current = { id: slots[i].key.slice(2), top: offsets[i] - top };
          break;
        }
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollContainerRef]);

  // Offset correction: after measured heights change, keep the anchored row visually
  // fixed by adjusting scrollTop by the delta introduced above it (design B5).
  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !anchor.current) {
      return;
    }
    const newStart = layout.startById.get(anchor.current.id);
    if (newStart === undefined) {
      return;
    }
    const desiredTop = newStart - anchor.current.top;
    if (Math.abs(desiredTop - el.scrollTop) > 0.5) {
      el.scrollTop = desiredTop;
      setScrollTop(desiredTop);
    }
  }, [measureVersion, layout, scrollContainerRef]);

  const measureRef = useCallback(
    (key: string, auto: boolean) => (node: HTMLElement | null) => {
      const existing = observers.current.get(key);
      if (!node) {
        if (existing) {
          existing.ro.disconnect();
          observers.current.delete(key);
        }
        return;
      }
      // Fixed-height rows are never observed — they never pay measurement cost.
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
        const prev = measured.current.get(key);
        if (prev === undefined || Math.abs(prev - h) > 0.5) {
          measured.current.set(key, h);
          setMeasureVersion(v => v + 1);
        }
      });
      ro.observe(node);
      observers.current.set(key, { node, ro });
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
    slots: windowedSlots,
    firstIndex,
    lastIndex,
  } = useMemo(() => {
    const { slots, offsets, totalSize } = layout;
    if (slots.length === 0) {
      return { slots: [] as PositionedSlot[], firstIndex: -1, lastIndex: -1 };
    }
    const effectiveViewport = viewport || DEFAULT_VIEWPORT;
    const firstVisible = findFloorIndex(offsets, scrollTop);
    const lastVisible = findFloorIndex(offsets, scrollTop + effectiveViewport);
    const startIdx = Math.max(0, firstVisible - overscan);
    const endIdx = Math.min(slots.length - 1, lastVisible + overscan);

    const positioned: PositionedSlot[] = [];
    let firstData = -1;
    let lastData = -1;
    for (let i = startIdx; i <= endIdx; i++) {
      const start = offsets[i];
      const size = (i + 1 < offsets.length ? offsets[i + 1] : totalSize) - start;
      positioned.push({ ...slots[i], start, size });
      if (slots[i].type === 'data') {
        if (firstData === -1) {
          firstData = slots[i].index;
        }
        lastData = slots[i].index;
      }
    }
    return { slots: positioned, firstIndex: firstData, lastIndex: lastData };
  }, [layout, scrollTop, viewport, overscan]);

  const scrollToEnd = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [scrollContainerRef]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollContainerRef.current;
      if (!el || index < 0 || index >= items.length) {
        return;
      }
      const id = trackBy(items[index]);
      const start = layout.startById.get(id);
      if (start !== undefined) {
        el.scrollTop = start;
      }
    },
    [scrollContainerRef, items, trackBy, layout]
  );

  const isPinnedToEnd = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      return false;
    }
    return el.scrollHeight - (el.scrollTop + el.clientHeight) <= 1;
  }, [scrollContainerRef]);

  return {
    slots: windowedSlots,
    totalSize: layout.totalSize,
    firstIndex,
    lastIndex,
    measureRef,
    scrollToEnd,
    scrollToIndex,
    isPinnedToEnd,
  };
}
