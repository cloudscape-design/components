// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

// VirtualTable (cell F1-A2): generic, virtualization-first table expressed as a
// compound-component set (Root / Header / HeaderCell / Body / Row / Cell /
// ExpandedContent), additive to and coexisting with `Table`. This file is the public
// API surface; the windowing engine, measurement, header<->body reconciliation, and
// R-EXPAND a11y wiring land in impl-F1-A2-core. See deliverables/design/design-F1-A2.md.
//
// Composition model: `VirtualTable.Root` owns all grid state (windowing, measurement
// cache, expansion, sort reflection, focus, the append live-region) and the single
// scroll container. The consumer never instantiates rows imperatively — `VirtualTable.Body`
// receives a ROW-TEMPLATE FUNCTION `(item, api) => <VirtualTable.Row>` that Root invokes
// only for windowed rows. `VirtualTable.ExpandedContent` is the first-class compound home
// for arbitrary non-tabular expanded content (R-EXPAND, MASTER goal 6).

export interface VirtualTableProps<T> extends BaseComponentProps {
  /**
   * The full dataset. Root windows this to the visible range; the array itself is
   * never fully rendered to the DOM. Appending to it is the streaming/live path
   * (see `imperativeRef` and `onVisibleRangeChange`).
   */
  items: ReadonlyArray<T>;

  /**
   * Stable identity per row. Required (unlike Table, where it is optional): row
   * virtualization recycles DOM nodes, so a stable key is mandatory for correct focus
   * retention, expansion state, and measurement caching across recycling.
   */
  trackBy: (item: T) => string;

  // --- Virtualization ------------------------------------------------------

  /**
   * Estimated collapsed row height in px, used to size the scroll runway before a row
   * is measured. Set to the design's row density (CloudWatch: 23). @defaultValue 40
   */
  estimatedRowHeight?: number;

  /**
   * Optional per-row height strategy for DATA rows. Return a fixed px height, or
   * `'auto'` to measure the row so variable / wrapping rows window at their real
   * height — this is what lets the CloudWatch file/raw view wrap long log lines at
   * RAW_LINE_HEIGHT=20 (CW-15) and satisfies the variable/wrapping-row-heights goal.
   * Omit for uniform fixed rows at `estimatedRowHeight`: the fast path where no data
   * row is observed, so a 100k fixed-row dataset pays no measurement cost. (Expanded
   * regions are always measured independently; this governs the data row only.)
   */
  getRowHeight?: (item: T) => number | 'auto';

  /**
   * Number of rows rendered beyond the visible range on each side, to avoid blank
   * flashes on fast scroll. CloudWatch overrides higher (20 table / 40 file-raw).
   * @defaultValue 10
   */
  overscan?: number;

  /**
   * Fixed height (px) of the scrollable viewport. Windowing REQUIRES a bounded viewport:
   * the visible range is computed from the scroll container's own height, so without a
   * bound the container grows to the full content height and every row mounts. Set this
   * (or `maxHeight`, or bound Root's parent — Root is a height-owning flex column) to
   * enable windowing.
   */
  height?: number;

  /**
   * Maximum height (px) of the scrollable viewport. The viewport grows with content up to
   * this bound, then scrolls. Use instead of `height` when the table should be shorter than
   * the bound for small datasets. Windowing needs `height`, `maxHeight`, or a height-bounded
   * parent (see `height`).
   */
  maxHeight?: number;

  /**
   * Fires when the windowed visible range changes. `firstIndex`/`lastIndex` index
   * into `items`.
   */
  onVisibleRangeChange?: NonCancelableEventHandler<VirtualTableProps.VisibleRangeDetail>;

  // --- Row expansion (R-EXPAND) --------------------------------------------
  // Expanded content is authored as a `VirtualTable.ExpandedContent` child of the row
  // template, not a prop. Expansion STATE lives on Root (controlled/uncontrolled).

  /** Controlled set of expanded row ids (as returned by `trackBy`). */
  expandedItems?: ReadonlyArray<string>;

  /** Uncontrolled initial expansion. @defaultValue [] */
  defaultExpandedItems?: ReadonlyArray<string>;

  /** Fires on a disclosure toggle with the row and the resulting expanded set. */
  onExpandChange?: NonCancelableEventHandler<VirtualTableProps.ExpandChangeDetail<T>>;

  // --- Sorting / sizing ----------------------------------------------------
  // Column identity/order/width are declared by the `HeaderCell` set (the single column
  // authority). These props carry cross-cutting sort/resize state Root reflects.

  sortingColumn?: { columnId: string };
  sortingDescending?: boolean;
  /** VirtualTable does not sort data; it reflects sort state and emits intent. */
  onSortingChange?: NonCancelableEventHandler<VirtualTableProps.SortingDetail>;

  /** Enables column resize handles. Emits via `onColumnWidthsChange`. @defaultValue false */
  resizableColumns?: boolean;
  /** Controlled per-column widths (px), keyed by `columnId`. Uncontrolled if omitted. */
  columnWidths?: Record<string, number>;
  onColumnWidthsChange?: NonCancelableEventHandler<VirtualTableProps.ColumnWidthsDetail>;

  /**
   * Column layout. `"fixed"` (default) applies fixed table layout with per-cell
   * truncation and a single stretch column. `"auto"` sizes to content. @defaultValue "fixed"
   */
  columnLayout?: VirtualTableProps.ColumnLayout;

  // --- Header / chrome -----------------------------------------------------

  /** Header slot above the grid (title, counter, actions), like Table's `header`. */
  header?: React.ReactNode;

  /** Rendered when `items` is empty. */
  empty?: React.ReactNode;

  /** Loading state for the whole grid. */
  loading?: boolean;
  loadingText?: string;

  // --- Accessibility -------------------------------------------------------

  /** Localized accessibility strings and label functions. @i18n */
  ariaLabels?: VirtualTableProps.AriaLabels<T>;

  /**
   * Semantic role of the grid. `"grid"` (default) for interactive grids with keyboard
   * cell/row navigation; `"table"` for static, non-interactive data. @defaultValue "grid"
   */
  role?: VirtualTableProps.Role;

  // --- Imperative surface --------------------------------------------------

  /** Imperative handle for scroll anchoring, live tail, and reveal. */
  imperativeRef?: React.Ref<VirtualTableProps.Ref>;

  /** Header + Body compound children. */
  children: React.ReactNode;
}

export namespace VirtualTableProps {
  export type Role = 'grid' | 'table';
  export type ColumnLayout = 'fixed' | 'auto';

  /** Props for `VirtualTable.Header`. */
  export interface HeaderProps {
    /** Renders a sticky header with horizontal scroll synced to the body. @defaultValue false */
    sticky?: boolean;
    children: React.ReactNode; // HeaderCell children
  }

  /**
   * Props for `VirtualTable.HeaderCell`. The `HeaderCell` set is the single authority
   * for column identity, order, count, and `aria-colindex`; body `Cell`s are matched
   * and ordered to it by `columnId`.
   */
  export interface HeaderCellProps {
    columnId: string;
    /**
     * Marks the single column that stretches to fill remaining width. If more than one
     * is set, the last-declared wins (single stretch target).
     */
    stretch?: boolean;
    sortingField?: string;
    width?: number;
    minWidth?: number;
    children: React.ReactNode; // header content
  }

  /**
   * Props for `VirtualTable.Body`. Receives a ROW-TEMPLATE FUNCTION, not row elements —
   * Root invokes it only for windowed items, which is how a compound API windows large
   * data without the consumer materializing every row.
   *
   * The template MUST forward the given `item` and `api` to its `<VirtualTable.Row item
   * api>` (Root reads row identity and expansion through them). It MUST declare
   * `<VirtualTable.ExpandedContent>` UNCONDITIONALLY when a row can expand — do NOT gate
   * it on `api.isExpanded`. Root decides whether the region is mounted; a gated template
   * hides the disclosure column entirely and disables expansion. The template must be a
   * pure, hook-free function of `(item, api)` (it runs inside Root's windowed render loop).
   */
  export interface BodyProps<T> {
    children: (item: T, api: RowApi) => React.ReactElement; // a VirtualTable.Row
  }

  /**
   * Passed to the row template so it is a pure function of `(item, api)` with no closure
   * over window internals. The windowed slice is deliberately not exposed: cross-row
   * scale (e.g. a shared histogram peak) must be computed consumer-side over the full
   * dataset so it does not jump on scroll.
   */
  export interface RowApi {
    /** True 1-based dataset index (NOT the window offset). */
    rowIndex: number;
    /** Total dataset length. */
    totalItemCount: number;
    isExpanded: boolean;
  }

  /** Props for `VirtualTable.Row`. */
  export interface RowProps<T> {
    item: T;
    api: RowApi;
    children: React.ReactNode; // Cells + optional ExpandedContent
  }

  /** Props for `VirtualTable.Cell`. `columnId` aligns it to its `HeaderCell`. */
  export interface CellProps {
    columnId: string;
    children: React.ReactNode;
  }

  /**
   * Props for `VirtualTable.ExpandedContent` — the first-class compound home for
   * ARBITRARY non-tabular expanded content. Presence of this child in the row template
   * enables the leading disclosure column. Its children are unconstrained by the column set.
   *
   * Declare it UNCONDITIONALLY in the row template (not gated on `api.isExpanded`): Root
   * mounts the region only for expanded rows, and uses its presence to decide the
   * disclosure column and pre-measurement runway. A conditionally-rendered ExpandedContent
   * disables expansion silently and triggers a dev warning when a row is opened.
   */
  export interface ExpandedContentProps {
    /**
     * px estimate used before measurement; the region is measured so variable expanded
     * heights window correctly. CloudWatch: ~300 (standard), ~150 (patterns).
     */
    estimatedHeight?: number;
    /** Force a fixed height instead of measuring (rare; measurement is the default). */
    fixedHeight?: number;
    children: React.ReactNode; // arbitrary non-tabular content
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
  export interface SortingDetail {
    columnId: string;
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
     * Root coalesces bursts (debounced) into one summarized message per batch.
     * Returning undefined suppresses the announcement.
     */
    appendAnnouncement?: (detail: { addedCount: number; totalCount: number }) => string | undefined;
    activateSortLabel?: (columnId: string) => string;
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
