// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

// VirtualTable (cell F3-A2): a headless data-grid CORE (`useVirtualGrid`) plus a thin
// Cloudscape SKIN shaped as compound components (`VirtualTable.Root / Header / HeaderCell /
// Body / Row / Cell / ExpandedContent`) built on top of it. Additive to and coexisting
// with `Table`. This file is the public API surface for BOTH layers; the windowing engine,
// measurement, header<->body reconciliation, focus stability, and R-EXPAND a11y wiring land
// in impl-F3-A2-core. See deliverables/design/design-F3-A2.md (Chorus yEEFEcfcSAZ4).
//
// The F3 thesis: the hard, defect-prone mechanics (DOM windowing, opt-in measured variable
// row heights, the R-EXPAND arbitrary-content substrate, the coherent-grid a11y contract,
// focus under recycling, the scroll-anchoring + append surface) live in the CORE and are
// handed out as plain props objects for a consumer to spread onto its own DOM. The compound
// SKIN calls the core once (in `Root`) and applies Cloudscape tokens/markup/density on top,
// spreading the core's role/ARIA props — it never authors ARIA of its own ("skin cannot
// silently regress core a11y"). The core is exported so the same engine can back this skin,
// a future styled-default skin (F3-A3), or a bare-core consumer.

// =============================================================================
// Layer 1 — the headless core (`useVirtualGrid`), public in this cell
// =============================================================================

/** A column's identity/order/behaviour, as told to the core. The skin derives this array
 *  from its `HeaderCell` children before calling the core (the single column authority). */
export interface VirtualGridColumn {
  columnId: string;
  sortable?: boolean;
  stretch?: boolean;
}

export interface VirtualGridConfig<T> {
  /** Full dataset. The core windows it and never renders it whole. Appending is the
   *  streaming path (see `onVisibleRangeChange` + the append surface). */
  items: ReadonlyArray<T>;

  /** Stable identity per row. REQUIRED: windowing recycles DOM nodes, so a stable key is
   *  mandatory for focus retention, expansion state, and measurement caching. */
  trackBy: (item: T) => string;

  /** Column identity/order/count — the SINGLE authority for the grid's columns and their
   *  `aria-colindex`. The skin derives this from `HeaderCell` children before the call. */
  columns: ReadonlyArray<VirtualGridColumn>;

  /** Whether any row can expand. When true the core materialises a leading, counted,
   *  empty (accessible spacer) disclosure `columnheader` at `aria-colindex` 1 so header<->body indexing
   *  never diverges. The skin computes this by probing its `Body` template for an
   *  `ExpandedContent` child and passes the result here (the core does not read JSX). */
  hasExpandableRows?: boolean;

  /** Estimated collapsed row height (px) for the runway before measurement.
   *  @defaultValue 40 (skins set their density, e.g. CloudWatch 23). */
  estimatedRowHeight?: number;

  /** Rows rendered beyond the visible range on each side. @defaultValue 10
   *  (CloudWatch overrides 20 table / 40 file-raw). */
  overscan?: number;

  /** Per-row opt-in DATA-row measurement: `'auto'` measures the row (wrapping/expanded), a
   *  number fixes it. Rows without an entry use `estimatedRowHeight` and are never observed. */
  getRowHeight?: (item: T) => number | 'auto';

  /** Measured/estimated height (px) of an expanded row's arbitrary content. CloudWatch:
   *  ~300 standard, ~150 patterns. Measured by default. */
  getExpandedRowHeight?: (item: T) => number | 'auto';

  /** Pre-measurement runway estimate (px) for an `'auto'` expanded region, before its real
   *  height is measured. The skin derives this from `ExpandedContent.estimatedHeight`
   *  (CloudWatch ~300 standard / ~150 patterns) so the runway does not jump on first entry. */
  defaultExpandedEstimate?: number;

  // Expansion (controlled/uncontrolled) — R-EXPAND state is core-owned.
  expandedItems?: ReadonlyArray<string>;
  defaultExpandedItems?: ReadonlyArray<string>;
  onExpandChange?: (detail: { item: T; expanded: boolean; expandedItems: string[] }) => void;

  // Sort STATE/behaviour (core reflects, does not sort); visuals are the skin's.
  sortingColumn?: { columnId: string };
  sortingDescending?: boolean;
  onSortingChange?: (detail: { columnId: string; sortingDescending: boolean }) => void;

  /** Semantic role of the grid. `'grid'` (default) for interactive keyboard nav; `'table'`
   *  for static data. @defaultValue 'grid' */
  role?: 'grid' | 'table';

  /** Accessible name for the grid, applied to `gridProps`. */
  ariaLabel?: string;

  /** Localized label for a row's disclosure trigger, given expansion state. */
  expandButtonLabel?: (item: T, expanded: boolean) => string;
  /** Localized accessible name for an expanded region, tying it to its row. */
  expandedRegionLabel?: (item: T) => string;
  /** Localized accessible name for a sortable column's sort trigger. */
  activateSortLabel?: (columnId: string) => string;

  onVisibleRangeChange?: (detail: { firstIndex: number; lastIndex: number }) => void;

  /** Formats the coalesced live-append announcement. The core owns the debounce (~500ms) and
   *  the polite live region; the consumer supplies the message text. Returning undefined
   *  suppresses the batch. The skin passes `ariaLabels.appendAnnouncement` here. */
  renderAppendAnnouncement?: (detail: { addedCount: number; totalCount: number }) => string | undefined;
}

/** Header render props — the header analogue of the body's per-row/per-cell props, so the
 *  skin's `HeaderCell` APPLIES core ARIA rather than authoring it. */
export interface HeaderRenderProps {
  /** Spread onto the header row element: `role="row"` + the header row's `aria-rowindex`. */
  rowProps: React.HTMLAttributes<HTMLElement>;
  /** Per-headercell accessor keyed by `columnId`: `role="columnheader"`, `aria-colindex`
   *  (data columns start at 2 when the disclosure column is materialised), and `aria-sort`
   *  for sortable columns. */
  cellProps: (columnId: string) => React.HTMLAttributes<HTMLElement> & {
    'aria-colindex': number;
    'aria-sort'?: 'ascending' | 'descending' | 'none';
  };
  /** Props for a sortable column's keyboard-operable sort trigger (a native `<button>`),
   *  keyed by `columnId`: `onClick` fires the core's sort intent and `aria-label` is the
   *  localized `activateSortLabel`. Returns `null` for non-sortable columns (no trigger).
   *  So the skin's `HeaderCell` APPLIES the core's sort wiring rather than authoring it. */
  sortButtonProps: (columnId: string) => React.ButtonHTMLAttributes<HTMLButtonElement> | null;
  /** The materialised, empty disclosure `columnheader` at `aria-colindex` 1
   *  (present only when `hasExpandableRows`); the skin renders it as an accessible empty
   *  spacer so header<->body `aria-colindex` never diverges (the repo axe config disables
   *  `empty-table-header`). */
  disclosureHeaderProps?: React.HTMLAttributes<HTMLElement> & { 'aria-colindex': 1 };
}

/** One windowed row's props objects. The skin (or a bare-core consumer) spreads these onto
 *  its own DOM; the core owns their role/ARIA/offset. */
export interface VirtualRow<T> {
  item: T;
  key: string;
  /** `role="row"`, `aria-rowindex` = true dataset index, absolute offset `style`, and a
   *  measure `ref` for `'auto'` DATA rows (wrapping raw lines, CW-15); the ref early-returns
   *  for fixed rows so they pay no observer cost. Spread onto the row element. */
  rowProps: React.HTMLAttributes<HTMLElement> & { ref?: React.RefCallback<HTMLElement> };
  /** Per-data-cell accessor: `role="gridcell"`, `aria-colindex` (data columns start at 2
   *  when the disclosure column is materialised). */
  cellProps: (columnId: string) => React.HTMLAttributes<HTMLElement> & { 'aria-colindex': number };
  /** Disclosure trigger + gridcell props + expansion state; `null` when the grid has no
   *  expandable rows. `buttonProps` carry `role=button`/`aria-expanded`/`aria-controls`;
   *  `cellProps` are the leading disclosure `gridcell` at `aria-colindex` 1. */
  disclosure: {
    buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
    cellProps: React.HTMLAttributes<HTMLElement> & { 'aria-colindex': 1 };
    isExpanded: boolean;
  } | null;
  /** The VALID grid child model for arbitrary expanded content (`role="row"` ->
   *  full-width `role="gridcell"` `aria-colspan` -> labeled `role="region"`). Present only
   *  when the row is expanded. */
  expandedRowProps?: React.HTMLAttributes<HTMLElement>;
  expandedGridcellProps?: React.HTMLAttributes<HTMLElement>;
  expandedRegionProps?: React.HTMLAttributes<HTMLElement>;
  /** Attach to the expanded `role="region"` to measure an `'auto'` row on first entry. */
  measureRef: (node: HTMLElement | null) => void;
}

export interface VirtualGrid<T> {
  /** Spread onto the single scroll container: `role`, `aria-rowcount` (= `items.length` + 1,
   *  the header row counted once), `aria-colcount` (incl. the materialised disclosure column),
   *  `aria-label`, `aria-activedescendant` (the active row while windowed), `tabIndex`,
   *  `onKeyDown` (row-granular arrow/Home/End nav), and `ref` (a callback ref, spreadable onto
   *  any element a bare-core consumer picks). The runway `style` lives on `bodyProps`, and the
   *  core listens for scroll internally, so gridProps carries no `onScroll`. */
  gridProps: React.HTMLAttributes<HTMLElement> & { ref: React.RefCallback<HTMLElement> };
  /** Spread onto the body row-group element: a relative runway sized to the full virtual
   *  height so the absolutely-positioned windowed rows land at their real offsets. */
  bodyProps: React.HTMLAttributes<HTMLElement>;
  headerProps: HeaderRenderProps;
  /** ONLY the windowed rows (visible range + overscan). */
  rows: ReadonlyArray<VirtualRow<T>>;
  /** Full-dataset row-relative context only (never the window slice). */
  getRowContext: (id: string) => { rowIndex: number; totalItemCount: number; isExpanded: boolean };
  /** SR-safe append surface: the core owns the live-region props + a rate-limited
   *  (debounced ~500ms, summarized) `announceAppend()`; the consumer decides WHAT to say. */
  liveRegionProps: React.HTMLAttributes<HTMLElement>;
  /** The current coalesced announcement string; render it inside the live region element. */
  liveMessage: string;
  announceAppend: (detail: { addedCount: number; totalCount: number }) => void;
  // Imperative: scroll anchoring + reveal + live-tail composition primitives.
  scrollToEnd(): void;
  scrollToItem(id: string, options?: { reveal?: boolean }): void;
  isPinnedToEnd(): boolean;
}

// =============================================================================
// Layer 2 — the compound Cloudscape skin (`VirtualTable.*`) public API
// =============================================================================

export interface VirtualTableProps<T> extends BaseComponentProps {
  /**
   * The full dataset. Root windows this via the core; the array itself is never fully
   * rendered to the DOM. Appending to it is the streaming/live path (see `imperativeRef`
   * and `onVisibleRangeChange`).
   */
  items: ReadonlyArray<T>;

  /**
   * Stable identity per row. Required (unlike Table): row virtualization recycles DOM
   * nodes, so a stable key is mandatory for correct focus retention, expansion state, and
   * measurement caching across recycling.
   */
  trackBy: (item: T) => string;

  // --- Virtualization ------------------------------------------------------

  /** Estimated collapsed row height (px) for the runway before measurement. Set to the
   *  design's density (CloudWatch: 23). @defaultValue 40 */
  estimatedRowHeight?: number;

  /**
   * Optional per-row height strategy for DATA rows. Return a fixed px height, or `'auto'`
   * to measure the row so variable / wrapping rows window at their real height — what lets
   * the CloudWatch file/raw view wrap long lines at RAW_LINE_HEIGHT=20 (CW-15). Omit for
   * uniform fixed rows: the fast path where no data row is observed.
   */
  getRowHeight?: (item: T) => number | 'auto';

  /** Rows rendered beyond the visible range on each side. CloudWatch overrides higher
   *  (20 table / 40 file-raw). @defaultValue 10 */
  overscan?: number;

  /** Fires when the windowed visible range changes; indices index into `items`. */
  onVisibleRangeChange?: NonCancelableEventHandler<VirtualTableProps.VisibleRangeDetail>;

  // --- Row expansion (R-EXPAND) --------------------------------------------
  // Expanded content is authored as a `VirtualTable.ExpandedContent` child of the row
  // template, not a prop. Expansion STATE lives in the core (controlled/uncontrolled).

  /** Controlled set of expanded row ids (as returned by `trackBy`). */
  expandedItems?: ReadonlyArray<string>;
  /** Uncontrolled initial expansion. @defaultValue [] */
  defaultExpandedItems?: ReadonlyArray<string>;
  /** Fires on a disclosure toggle with the row and the resulting expanded set. */
  onExpandChange?: NonCancelableEventHandler<VirtualTableProps.ExpandChangeDetail<T>>;

  // --- Sorting / sizing ----------------------------------------------------
  // Column identity/order/width are declared by the `HeaderCell` set (the single column
  // authority). These props carry cross-cutting sort/resize state the core reflects.

  sortingColumn?: { columnId: string };
  sortingDescending?: boolean;
  /** VirtualTable does not sort data; it reflects sort state and emits intent. */
  onSortingChange?: NonCancelableEventHandler<VirtualTableProps.SortingDetail>;

  /** Enables column resize handles. Emits via `onColumnWidthsChange`. @defaultValue false */
  resizableColumns?: boolean;
  /** Controlled per-column widths (px), keyed by `columnId`. Uncontrolled if omitted. */
  columnWidths?: Record<string, number>;
  onColumnWidthsChange?: NonCancelableEventHandler<VirtualTableProps.ColumnWidthsDetail>;

  /** Column layout. `"fixed"` (default) applies fixed table layout with per-cell truncation
   *  and a single stretch column. `"auto"` sizes to content. @defaultValue "fixed" */
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

  /** Semantic role of the grid. `"grid"` (default) for interactive grids; `"table"` for
   *  static data. @defaultValue "grid" */
  role?: VirtualTableProps.Role;

  // --- Imperative surface --------------------------------------------------

  /** Imperative handle for scroll anchoring, live tail, and reveal (forwards the core's). */
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
    children: React.ReactNode; // HeaderCell children (direct, statically-analysable)
  }

  /**
   * Props for `VirtualTable.HeaderCell`. The `HeaderCell` set is the single authority for
   * column identity, order, count, and `aria-colindex`; body `Cell`s are matched and
   * ordered to it by `columnId`. Root derives the core's column set from these children
   * before calling the core, so they MUST be direct, statically-analysable children of
   * `Header` (a `.map` emitting a stable columnId/order list is fine; an opaque wrapper
   * that hides `columnId` is not).
   */
  export interface HeaderCellProps {
    columnId: string;
    /** The single column that stretches to fill remaining width. If more than one is set,
     *  the last-declared wins (single stretch target). */
    stretch?: boolean;
    sortingField?: string;
    width?: number;
    minWidth?: number;
    children: React.ReactNode; // header content (styled by the skin)
  }

  /**
   * Props for `VirtualTable.Body`. Receives a ROW-TEMPLATE FUNCTION, not row elements —
   * the core (via Root) invokes it only for windowed items, which is how a compound API
   * windows large data without the consumer materializing every row.
   *
   * The template MUST forward the given `item` and `api` to its `<VirtualTable.Row item
   * api>`. It MUST declare `<VirtualTable.ExpandedContent>` UNCONDITIONALLY when a row can
   * expand — do NOT gate it on `api.isExpanded` (the core mounts the region only for
   * expanded rows; a gated template hides the disclosure column and disables expansion).
   * The template must be a pure, hook-free function of `(item, api)`.
   */
  export interface BodyProps<T> {
    children: (item: T, api: RowApi) => React.ReactElement; // a VirtualTable.Row
  }

  /**
   * Passed to the row template so it is a pure function of `(item, api)` with no closure
   * over window internals. The windowed slice is deliberately not exposed: cross-row scale
   * (e.g. a shared histogram peak) must be computed consumer-side over the full dataset so
   * it does not jump on scroll. A pure pass-through of the core's row-relative context.
   */
  export interface RowApi {
    /** True 1-based dataset index (NOT the window offset). */
    rowIndex: number;
    /** Total dataset length. */
    totalItemCount: number;
    isExpanded: boolean;
  }

  /** Props for `VirtualTable.Row`. `item`/`api` are passed explicitly (rather than read
   *  from Body's function-child context) because the core keys measurement, focus, and
   *  expansion by `trackBy(item)` at the Row boundary. */
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
   * Props for `VirtualTable.ExpandedContent` — the first-class compound home for ARBITRARY
   * non-tabular expanded content (R-EXPAND, MASTER goal 6). Presence of this child in the
   * row template enables the leading disclosure column. Its children are unconstrained by
   * the column set; the core supplies the valid grid child wrapper + disclosure a11y, the
   * skin styles the region.
   *
   * Declare it UNCONDITIONALLY in the row template (not gated on `api.isExpanded`).
   */
  export interface ExpandedContentProps {
    /** px estimate used before measurement; the region is measured so variable expanded
     *  heights window correctly. CloudWatch: ~300 (standard), ~150 (patterns). */
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
    /** Announced (politely) on live append; the core coalesces bursts (debounced) into one
     *  summarized message per batch. Returning undefined suppresses the batch. */
    appendAnnouncement?: (detail: { addedCount: number; totalCount: number }) => string | undefined;
    activateSortLabel?: (columnId: string) => string;
  }

  export interface Ref {
    /** Pin the viewport to the last row (compose stick-to-bottom live tail on top). */
    scrollToEnd(): void;
    /** Scroll a row into view; optionally expand it (`reveal`). */
    scrollToItem(id: string, options?: { reveal?: boolean }): void;
    /** True when the viewport is pinned to the last row (at the bottom edge). */
    isPinnedToEnd(): boolean;
  }
}
