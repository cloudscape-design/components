// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// Public contract for the standalone virtualization primitives (`useVirtualization` for vertical
// row windowing, `useColumnVirtualization` for horizontal). These are consumer-wired hooks that
// window a large dataset over a table surface; they know nothing about BasicTable, its data, or its
// columns, and return plain positioning props the consumer spreads onto their own elements.

export interface VirtualizationVisibleRange {
  firstIndex: number;
  lastIndex: number;
}

export interface VirtualizationConfig {
  /** Total row count of the full dataset. The hook windows it; the consumer only renders the
   *  windowed slice. */
  count: number;
  /** Estimated row height (px) for the runway before any measurement. */
  estimatedRowHeight: number;
  /** Per-row height strategy: a fixed px height, or `'auto'` to measure the row (wrapping lines,
   *  or a row the consumer has expanded into nested content). Omit for uniform fixed rows (the fast
   *  path where no row is observed). Keep this reference stable. */
  getRowHeight?: (index: number) => number | 'auto';
  /** Rows rendered beyond the visible range on each side. @defaultValue 10 */
  overscan?: number;
  /** Pre-measurement runway seed (px) for an `'auto'` row, before its real height is measured, so
   *  the runway does not jump on first entry (e.g. a row's estimated expanded height). Return
   *  undefined to use `estimatedRowHeight`. */
  getExpandedRowHeight?: (index: number) => number | undefined;
  /** Fires when the windowed index range changes. */
  onVisibleRangeChange?: (detail: VirtualizationVisibleRange) => void;
}

export interface VirtualizationWindowItem {
  index: number;
  offset: number;
}

/** Spread onto each windowed row element: absolute-offset positioning, `aria-rowindex`
 *  (index + 2, since the header row is row 1), and a measure `ref` for `'auto'` rows. */
export interface VirtualizationRowProps extends React.HTMLAttributes<HTMLElement> {
  'aria-rowindex': number;
  ref?: React.RefCallback<HTMLElement>;
}

export interface VirtualizationResult {
  /** The windowed slice to iterate (visible range + overscan) — NOT the whole dataset. */
  window: ReadonlyArray<VirtualizationWindowItem>;
  /** Spread onto the scrolling body element: a relative runway sized to the full virtual height,
   *  plus a ref used to locate the scroll viewport and drive measurement. */
  runwayProps: React.HTMLAttributes<HTMLElement> & { ref: React.RefCallback<HTMLElement> };
  /** Per-windowed-row props: absolute offset positioning + `aria-rowindex` override + measure ref. */
  rowProps: (index: number, offset: number) => VirtualizationRowProps;
  /** Scroll a row into view by index. Releases the live-tail pin. */
  scrollToIndex: (index: number) => void;
  /** Pin the viewport to the last row (compose stick-to-bottom live tail on top). */
  scrollToEnd: () => void;
  /** True when the viewport is pinned to the last row (at the bottom edge). */
  isPinnedToEnd: () => boolean;
  /** The current windowed index range. */
  visibleRange: VirtualizationVisibleRange;
}

export interface ColumnVirtualizationConfig {
  /** Fixed px widths of the columns, in column order. */
  widths: number[];
  /** Width (px) of any leading track before the first column (0 when none). @defaultValue 0 */
  leadingOffset?: number;
  /** Columns rendered beyond the visible span on each side. @defaultValue 3 */
  overscan?: number;
  /** Number of leading columns always rendered (pinned). @defaultValue 0 */
  pinnedFirst?: number;
  /** Number of trailing columns always rendered (pinned). @defaultValue 0 */
  pinnedLast?: number;
}

export interface ColumnVirtualizationResult {
  /** The column indices to render this frame (visible span ∪ overscan ∪ pinned). */
  visibleColumns: Set<number>;
  /** Callback ref for the horizontal scroll container whose geometry is windowed. */
  ref: (el: HTMLElement | null) => void;
  /** Absolute CSS grid line a column starts at, so a windowed cell lands on its real track even
   *  though earlier cells are not rendered (spread as `grid-column-start`). */
  trackStart: (columnIndex: number) => number;
}
