// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

// VirtualTable (cell F1-A1): generic, config-driven, virtualization-first table,
// additive to and coexisting with `Table`. This file is the public API surface;
// the windowing engine, measurement, and R-EXPAND a11y wiring land in
// impl-F1-A1-core. See deliverables/design/design-F1-A1.md.
export interface VirtualTableProps<T> extends BaseComponentProps {
  /**
   * The full dataset to render. VirtualTable windows this to the visible range;
   * the array itself is never fully rendered to the DOM. Appending to this array
   * is the streaming/live path (see `imperativeRef` and `onVisibleRangeChange`).
   */
  items: ReadonlyArray<T>;

  /**
   * Column configuration. Mirrors Table's `ColumnDefinition` so the model transfers.
   * `cell` receives row-relative context (dataset row index, total count, expansion)
   * in addition to the item; cross-row scale is computed consumer-side over `items`.
   */
  columnDefinitions: ReadonlyArray<VirtualTableProps.ColumnDefinition<T>>;

  /**
   * Stable identity per row. Required (unlike Table, where it is optional): row
   * virtualization recycles DOM nodes, so a stable key is mandatory for correct
   * focus retention, expansion state, and measurement caching across recycling.
   */
  trackBy: (item: T) => string;

  // --- Virtualization ------------------------------------------------------

  /**
   * Estimated collapsed row height in px, used to size the scroll runway before a
   * row is measured. Set to the design's row density (CloudWatch: 23).
   * @defaultValue 40
   */
  estimatedRowHeight?: number;

  /**
   * Per-row height strategy. Return a fixed px height, or `"auto"` to opt that row
   * into measurement. Omitting the prop means every row is fixed at
   * `estimatedRowHeight` — the cheap large-dataset default.
   */
  getRowHeight?: (item: T) => number | 'auto';

  /**
   * Number of rows rendered beyond the visible range on each side, to avoid blank
   * flashes on fast scroll.
   * @defaultValue 10
   */
  overscan?: number;

  /**
   * Fires when the windowed visible range changes. `firstIndex`/`lastIndex` index
   * into `items`.
   */
  onVisibleRangeChange?: NonCancelableEventHandler<VirtualTableProps.VisibleRangeDetail>;

  // --- Row expansion (R-EXPAND) --------------------------------------------

  /**
   * Renders arbitrary, non-tabular content for an expanded row (key/value detail,
   * raw/JSON record, nested panels). Presence of this prop enables the leading
   * disclosure column. The returned node is not constrained to the column set.
   */
  getExpandedContent?: (item: T) => React.ReactNode;

  /** Controlled set of expanded row ids (as returned by `trackBy`). */
  expandedItems?: ReadonlyArray<string>;

  /** Uncontrolled initial expansion. @defaultValue [] */
  defaultExpandedItems?: ReadonlyArray<string>;

  /** Fires on a disclosure toggle with the row and the resulting expanded set. */
  onExpandChange?: NonCancelableEventHandler<VirtualTableProps.ExpandChangeDetail<T>>;

  /**
   * Height strategy for the expanded region, mirroring `getRowHeight`.
   * @defaultValue () => 'auto'
   */
  getExpandedRowHeight?: (item: T) => number | 'auto';

  // --- Columns / sorting / sizing ------------------------------------------

  /** Enables column resize handles. Emits via `onColumnWidthsChange`. @defaultValue false */
  resizableColumns?: boolean;

  /** Controlled per-column widths (px), keyed by column id. Uncontrolled if omitted. */
  columnWidths?: Record<string, number>;
  onColumnWidthsChange?: NonCancelableEventHandler<VirtualTableProps.ColumnWidthsDetail>;

  /**
   * Column layout. `"fixed"` (default) applies fixed table layout with per-cell
   * truncation and stretch-last-column. `"auto"` sizes to content.
   * @defaultValue "fixed"
   */
  columnLayout?: VirtualTableProps.ColumnLayout;

  sortingColumn?: VirtualTableProps.ColumnDefinition<T>;
  sortingDescending?: boolean;
  /** VirtualTable does not sort data; it reflects sort state and emits intent. */
  onSortingChange?: NonCancelableEventHandler<VirtualTableProps.SortingDetail<T>>;

  // --- Header / chrome -----------------------------------------------------

  /** Renders a sticky header with horizontal scroll synced to the body. @defaultValue false */
  stickyHeader?: boolean;

  /** Header slot above the grid (title, counter, actions), like Table's `header`. */
  header?: React.ReactNode;

  /** Rendered when `items` is empty. */
  empty?: React.ReactNode;

  /** Loading state for the whole grid. */
  loading?: boolean;
  loadingText?: string;

  // --- Accessibility -------------------------------------------------------

  /**
   * Localized accessibility strings and label functions.
   * @i18n
   */
  ariaLabels?: VirtualTableProps.AriaLabels<T>;

  /**
   * Semantic role of the grid. `"grid"` (default) for interactive grids with
   * keyboard cell/row navigation; `"table"` for static, non-interactive data.
   * @defaultValue "grid"
   */
  role?: VirtualTableProps.Role;

  // --- Imperative surface --------------------------------------------------

  /** Imperative handle for scroll anchoring, live tail, and reveal. */
  imperativeRef?: React.Ref<VirtualTableProps.Ref>;
}

export namespace VirtualTableProps {
  export type Role = 'grid' | 'table';
  export type ColumnLayout = 'fixed' | 'auto';

  export interface ColumnDefinition<T> {
    id: string;
    header: React.ReactNode;
    /**
     * Cell renderer. `context` exposes row-relative state (full dataset row index,
     * total count, expansion) beyond the item itself. Cross-row scale is computed by
     * the consumer over the full `items` array, not derived from `context`.
     */
    cell: (item: T, context: CellContext) => React.ReactNode;
    sortingField?: string;
    width?: number;
    minWidth?: number;
    /**
     * Marks the single column whose extra space stretches to fill. If multiple
     * columns set this, the last-declared wins (single stretch target).
     */
    isStretch?: boolean;
    ariaLabel?: (data: { sorted: boolean; descending: boolean }) => string;
  }

  export interface CellContext {
    /** Full row index into the complete dataset; matches the row's `aria-rowindex`. */
    rowIndex: number;
    /** Total dataset length (equals `aria-rowcount`). */
    totalItemCount: number;
    isExpanded: boolean;
    // NB: the windowed item slice is deliberately not exposed here; cross-row scale
    // must be computed over the full `items` array consumer-side so it does not jump
    // as the window changes on scroll.
  }

  export interface VisibleRangeDetail {
    firstIndex: number;
    lastIndex: number;
  }
  export interface ExpandChangeDetail<T> {
    item: T;
    expanded: boolean;
    expandedItems: string[];
  }
  export interface SortingDetail<T> {
    sortingColumn: ColumnDefinition<T>;
    sortingDescending: boolean;
  }
  export interface ColumnWidthsDetail {
    widths: Record<string, number>;
  }

  export interface AriaLabels<T> {
    tableLabel?: string;
    /** Label for a row's disclosure trigger, given expansion state. */
    expandButtonLabel?: (item: T, expanded: boolean) => string;
    /** Accessible name for an expanded region, tying it to its row. */
    expandedRegionLabel?: (item: T) => string;
    /**
     * Message announced (politely) when rows are appended during live streaming.
     * Appends are coalesced by the component (debounced burst, one summarized
     * message per batch). Returning undefined suppresses the announcement.
     */
    appendAnnouncement?: (detail: { addedCount: number; totalCount: number }) => string | undefined;
    activateSortLabel?: (column: ColumnDefinition<T>) => string;
  }

  export interface Ref {
    /** Pin the viewport to the last row (compose stick-to-bottom live tail on top). */
    scrollToEnd(): void;
    /** Scroll a row into view; optionally expand it (`reveal`). Any highlight is consumer-composed. */
    scrollToItem(id: string, options?: { reveal?: boolean }): void;
    /** True when the viewport is pinned to the last row (at the bottom edge). */
    isPinnedToEnd(): boolean;
  }
}
