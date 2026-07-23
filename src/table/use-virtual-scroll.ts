// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useMemo, useState } from 'react';

/**
 * Default estimated height (in px) used to size the virtual window when no
 * explicit `rowHeight` is provided through the `virtualScroll` configuration.
 */
export const DEFAULT_VIRTUAL_ROW_HEIGHT = 40;

/**
 * Number of extra rows rendered above and below the visible viewport. Overscan
 * reduces the chance of visible blank areas while fast-scrolling.
 */
export const DEFAULT_VIRTUAL_OVERSCAN = 5;

export interface UseVirtualScrollProps {
  /** Whether windowed rendering is active. When `false` the hook is a no-op and renders every row. */
  enabled: boolean;
  /** Total number of rows (data + loader rows) that would be rendered without virtualization. */
  itemCount: number;
  /** Scrollable container element that clips the table body (usually the table wrapper). */
  containerRef: React.RefObject<HTMLElement>;
  /** Estimated per-row height in px. v0 assumes a uniform row height. */
  rowHeight?: number;
  /** Extra rows rendered outside the viewport on each side. */
  overscan?: number;
}

export interface VirtualScrollResult {
  /** Mirrors the `enabled` input; convenient for guarding render logic. */
  enabled: boolean;
  /** Index of the first rendered row (inclusive). */
  startIndex: number;
  /** Index one past the last rendered row (exclusive). */
  endIndex: number;
  /** Height (px) of the spacer rendered before the first rendered row. */
  topPadding: number;
  /** Height (px) of the spacer rendered after the last rendered row. */
  bottomPadding: number;
  /** Total virtual height (px) of all rows. */
  totalSize: number;
}

interface Viewport {
  scrollTop: number;
  clientHeight: number;
}

/**
 * Computes the slice of rows that need to be rendered for a windowed (virtual)
 * table body, based on the current scroll offset and viewport height of the
 * scroll container.
 *
 * This is a first-cut (v0) implementation that assumes a uniform `rowHeight`.
 * Variable-height rows, expandable-row measurement, and window-level scrolling
 * are intentionally out of scope and tracked as follow-ups.
 */
export function useVirtualScroll({
  enabled,
  itemCount,
  containerRef,
  rowHeight = DEFAULT_VIRTUAL_ROW_HEIGHT,
  overscan = DEFAULT_VIRTUAL_OVERSCAN,
}: UseVirtualScrollProps): VirtualScrollResult {
  const [viewport, setViewport] = useState<Viewport>({ scrollTop: 0, clientHeight: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) {
      return;
    }

    const measure = () => {
      setViewport({ scrollTop: container.scrollTop, clientHeight: container.clientHeight });
    };

    // Measure once on mount and whenever inputs that affect geometry change.
    measure();
    container.addEventListener('scroll', measure, { passive: true });
    return () => {
      container.removeEventListener('scroll', measure);
    };
  }, [enabled, containerRef, itemCount, rowHeight]);

  return useMemo<VirtualScrollResult>(() => {
    const safeRowHeight = rowHeight > 0 ? rowHeight : DEFAULT_VIRTUAL_ROW_HEIGHT;
    const totalSize = itemCount * safeRowHeight;

    if (!enabled || itemCount === 0) {
      return {
        enabled,
        startIndex: 0,
        endIndex: itemCount,
        topPadding: 0,
        bottomPadding: 0,
        totalSize,
      };
    }

    const visibleCount = Math.max(1, Math.ceil(viewport.clientHeight / safeRowHeight));
    const rawStart = Math.floor(viewport.scrollTop / safeRowHeight) - overscan;
    const startIndex = Math.max(0, Math.min(rawStart, Math.max(0, itemCount - 1)));
    const endIndex = Math.min(itemCount, startIndex + visibleCount + overscan * 2);

    return {
      enabled,
      startIndex,
      endIndex,
      topPadding: startIndex * safeRowHeight,
      bottomPadding: Math.max(0, (itemCount - endIndex) * safeRowHeight),
      totalSize,
    };
  }, [enabled, itemCount, rowHeight, overscan, viewport.scrollTop, viewport.clientHeight]);
}
