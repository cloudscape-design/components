// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ColumnVirtualizationConfig, ColumnVirtualizationResult } from './interfaces';

// Column virtualization: a STANDALONE horizontal-windowing primitive, NOT a BasicTable prop —
// BasicTable stays truly windowing-free, and a consumer that wants column windowing wires this
// hook by hand (mirroring how `useVirtualization` handles vertical windowing). Given the fixed
// px widths of the columns and the horizontal viewport, it returns which column indices intersect
// the viewport (plus overscan and any pinned columns). The consumer renders only those cells and
// pins each to its absolute grid track via `trackStart` (a `grid-column-start`), so the shared
// `grid-template-columns` — and thus alignment and `aria-colindex` — is unchanged; only the number
// of mounted cells per row shrinks. Column windowing only makes sense when every column has a fixed
// px width (deterministic offsets); flexible (1fr) columns should not use it.

interface ColumnWindow {
  first: number;
  last: number;
  indices: Set<number>;
}

interface ComputeColumnWindowParams {
  widths: number[];
  leadingOffset: number;
  scrollLeft: number;
  viewportWidth: number;
  overscan: number;
  pinnedFirst: number;
  pinnedLast: number;
}

function allColumns(n: number): ColumnWindow {
  const indices = new Set<number>();
  for (let i = 0; i < n; i++) {
    indices.add(i);
  }
  return { first: 0, last: Math.max(0, n - 1), indices };
}

export function computeColumnWindow({
  widths,
  leadingOffset,
  scrollLeft,
  viewportWidth,
  overscan,
  pinnedFirst,
  pinnedLast,
}: ComputeColumnWindowParams): ColumnWindow {
  const n = widths.length;
  if (n === 0 || viewportWidth <= 0) {
    return allColumns(n);
  }

  const viewStart = scrollLeft;
  const viewEnd = scrollLeft + viewportWidth;

  let offset = leadingOffset;
  let first = -1;
  let last = -1;
  for (let i = 0; i < n; i++) {
    const start = offset;
    const end = offset + widths[i];
    if (end > viewStart && start < viewEnd) {
      if (first === -1) {
        first = i;
      }
      last = i;
    }
    offset = end;
  }

  if (first === -1) {
    return allColumns(n);
  }

  first = Math.max(0, first - overscan);
  last = Math.min(n - 1, last + overscan);

  const indices = new Set<number>();
  for (let i = first; i <= last; i++) {
    indices.add(i);
  }
  for (let i = 0; i < Math.min(pinnedFirst, n); i++) {
    indices.add(i);
  }
  for (let i = Math.max(0, n - pinnedLast); i < n; i++) {
    indices.add(i);
  }
  return { first, last, indices };
}

function setsEqual(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) {
    return false;
  }
  for (const value of a) {
    if (!b.has(value)) {
      return false;
    }
  }
  return true;
}

// Attaches a passive scroll listener + ResizeObserver to the scroll container and keeps the current
// column window in state (scroll recomputes are rAF-throttled to at most once per frame). The
// consumer calls this only when it wants column windowing.
export function useColumnVirtualization(config: ColumnVirtualizationConfig): ColumnVirtualizationResult {
  const { widths, leadingOffset = 0, overscan = 3, pinnedFirst = 0, pinnedLast = 0 } = config;
  const [node, setNode] = useState<HTMLElement | null>(null);

  const allIndices = useMemo(() => allColumns(widths.length).indices, [widths.length]);
  const [visible, setVisible] = useState<Set<number>>(allIndices);

  const widthsKey = widths.join(',');

  const recompute = useCallback(() => {
    if (!node) {
      return;
    }
    const { indices } = computeColumnWindow({
      widths,
      leadingOffset,
      scrollLeft: node.scrollLeft,
      viewportWidth: node.clientWidth,
      overscan,
      pinnedFirst,
      pinnedLast,
    });
    setVisible(prev => (setsEqual(prev, indices) ? prev : indices));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, widthsKey, leadingOffset, overscan, pinnedFirst, pinnedLast]);

  const setNodeRef = useCallback((el: HTMLElement | null) => setNode(el), []);

  useEffect(() => {
    if (!node) {
      return;
    }
    recompute();

    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = null;
        recompute();
      });
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(() => recompute());
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', onScroll);
      observer.disconnect();
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, [node, recompute]);

  return {
    visibleColumns: visible,
    ref: setNodeRef,
    // Absolute CSS grid line a column starts at: 1-based, offset by any leading tracks.
    trackStart: (columnIndex: number) => 1 + columnIndex,
  };
}
