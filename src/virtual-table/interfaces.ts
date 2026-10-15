// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

// VirtualTable (cell F2-A1): a logs/streaming-specialized, config-driven table,
// additive to and coexisting with `Table`. A required `viewConfig` object whose `type`
// discriminant selects the built-in surface (standard / patterns / raw) supplies that
// view's columns and renderers. This file is the public API surface;
// the windowing engine, measurement, live-tail mechanics, the two-mode filter, and
// the R-EXPAND a11y wiring land in impl-F2-A1-core. See
// deliverables/design/design-F2-A1.md.
export interface VirtualTableProps<T> extends BaseComponentProps {
  /**
   * The full dataset for the current view. VirtualTable windows this to the visible
   * range; the array is never fully rendered. Appending to it is the streaming/live
   * path (see `follow`, `onVisibleRangeChange`, and the imperative ref).
   */
  items: ReadonlyArray<T>;

  /**
   * Per-view configuration AND the single source of truth for which built-in surface
   * is active: the `type` discriminant selects the view, and the body supplies that
   * view's column set / renderers. This is F2's opinionation made explicit —
   * VirtualTable ships three surfaces rather than being a raw grid:
   *  - "standard"  the results grid: dynamic columns, leading disclosure column,
   *                fixed layout with a stretch-last column and static per-column
   *                widths (no per-column sort — sort is a patterns-view capability,
   *                CW-9).
   *  - "patterns"  the aggregation grid: its own column set, per-column sort,
   *                diff/compare mode, and a shared histogram y-scale computed across
   *                the FULL dataset.
   *  - "raw"       the monospaced raw log-line view (single column, no expansion), at
   *                RAW_LINE_HEIGHT density.
   * The console owns the tab/segmented control that swaps the config; VirtualTable
   * owns each view's grid, virtualization, a11y, and expansion. Kept as one object
   * (rather than a flat columnDefinitions array) so a console can hold all three view
   * configs and swap without re-shaping props.
   */
  viewConfig: VirtualTableProps.ViewConfig<T>;

  /**
   * Stable identity per row. REQUIRED (unlike Table, where it is optional): row
   * virtualization recycles DOM nodes, so a stable key is mandatory for correct focus
   * retention, expansion state, and measurement caching across recycling and live
   * append.
   * @displayname track by
   */
  trackBy: (item: T) => string;

  // --- Virtualization ------------------------------------------------------

  /**
   * Bounds the scroll viewport to a fixed px block-size. Windowing REQUIRES a bounded
   * viewport: without a `height`/`maxHeight` here (or a height-constrained parent, since
   * the root is a flex column and the scroll container flexes to fill it) the scroll
   * container reports the full content height and every row mounts. Use `height` for a
   * fixed viewport that always scrolls.
   */
  height?: number;

  /**
   * Bounds the scroll viewport to a maximum px block-size: the table grows with its
   * content up to this height, then windows + scrolls. Alternative to `height` for a
   * grow-then-scroll viewport. See `height` for why a bound is required to window.
   */
  maxHeight?: number;

  /**
   * Estimated collapsed row height in px, used to size the scroll runway before a row
   * is measured. Defaults to the logs density; CloudWatch standard/patterns use 23
   * (ROW_HEIGHT), raw uses 20 (RAW_LINE_HEIGHT).
   * @defaultValue 23
   */
  estimatedRowHeight?: number;

  /**
   * Per-row height strategy. Return a fixed px height, or `"auto"` to opt that row
   * into measurement (ResizeObserver-backed, measure-on-first-window-entry with a
   * cached height and incremental offset correction). Omitting the prop means every
   * collapsed row is fixed at `estimatedRowHeight`; expanded rows are always measured.
   */
  getRowHeight?: (item: T) => number | 'auto';

  /**
   * Rows rendered beyond the visible range on each side. CloudWatch uses 20 for the
   * grid views and 40 for the raw view (TABLE_VIEW_OVERSCAN / FILE_VIEW_OVERSCAN).
   * @defaultValue 20
   */
  overscan?: number;

  /**
   * Fires when the windowed visible range changes. Variable heights break a linear
   * scrollTop estimate, so the accurate dataset-relative range is surfaced here for
   * scroll-triggered prefetch. `firstIndex`/`lastIndex` index into `items`.
   */
  onVisibleRangeChange?: NonCancelableEventHandler<VirtualTableProps.VisibleRangeDetail>;

  // --- Live tail (built-in, F2 headline feature) ---------------------------

  /**
   * Controlled follow (stick-to-bottom) state. When true, appended rows pin the
   * viewport to newest; when the user scrolls away VirtualTable calls
   * `onFollowChange(false)` and stops auto-scrolling. Controlled by design
   * (override-seam): the console owns follow policy, the component owns the
   * pin-to-newest mechanics, scroll-anchoring, and the accessible append announcement.
   * @defaultValue false
   */
  follow?: boolean;

  /**
   * Fires when the follow state should change — on user scroll-away (false) or on
   * reaching bottom / pressing the follow control (true).
   */
  onFollowChange?: NonCancelableEventHandler<VirtualTableProps.FollowChangeDetail>;

  /**
   * Optional accessible summary for a batch of appended rows, announced politely and
   * rate-limited (~500 ms debounce, summarized) on the component-owned aria-live
   * region during tail. When omitted, a default count-based message is used from
   * `i18nStrings`.
   */
  renderAppendAnnouncement?: (detail: VirtualTableProps.AppendDetail) => string;

  // --- Row expansion (R-EXPAND) --------------------------------------------

  /**
   * Renders arbitrary, non-tabular content for an expanded row. This is the R-EXPAND
   * SUBSTRATE (goal 6): whatever it returns is hosted in the measured expanded region
   * and inherits the full disclosure a11y + measurement contract. The two built-in
   * presets (shape A log-record detail, shape B pattern detail) are DEFAULTS layered
   * on this slot via `expandedContentPreset` — they are not a closed set. Presence of
   * this prop (or a preset) enables the leading disclosure column.
   */
  getExpandedContent?: (item: T, context: VirtualTableProps.RowContext) => React.ReactNode;

  /**
   * Selects a built-in expanded-content layout, used as the default under
   * `getExpandedContent`. "log-record" = shape A (~300 px key/value detail);
   * "pattern-detail" = shape B (~150 px histogram + tokens + actions). Returning
   * custom content from `getExpandedContent` overrides it for that row (override-seam).
   */
  expandedContentPreset?: VirtualTableProps.ExpandedContentPreset;

  /**
   * Estimated expanded height in px per row, seeding the runway before the expanded
   * region is measured. Defaults follow the active preset (300 log-record, 150
   * pattern-detail); the real height is always measured.
   */
  getExpandedRowHeight?: (item: T) => number;

  /** Controlled set of expanded row keys (trackBy values). */
  expandedItems?: ReadonlyArray<string>;

  /** Uncontrolled initial set of expanded row keys. @defaultValue [] */
  defaultExpandedItems?: ReadonlyArray<string>;

  /** Fires when a row's expansion is toggled (keyboard or pointer). */
  onExpandChange?: NonCancelableEventHandler<VirtualTableProps.ExpandChangeDetail<T>>;

  // --- Two-mode filter (built-in) ------------------------------------------

  /**
   * The two-mode logs filter (CW-10), packaged as a component feature with the console
   * supplying only the predicate (override-seam). VirtualTable owns the mechanism:
   * match-indicator column, per-cell highlight styling, total-vs-filtered counts,
   * keyboard next/previous-match, and a NON-VISUAL match conveyance (text/ARIA on the
   * indicator, not colour alone; WCAG 1.4.1).
   *  - mode "subset"          renders only matching rows (filtered count).
   *  - mode "mark-in-place"   renders all rows, marks matches in place + a match
   *                           indicator column, so context is preserved.
   * Omitting `filter` disables filtering entirely.
   */
  filter?: VirtualTableProps.Filter<T>;

  // --- Columns / sort / layout (per-view surface, mirrors Table) -----------

  /** Column currently sorted by (from the active view's column set). */
  sortingColumn?: VirtualTableProps.ColumnDefinition<T>;
  /** Sort direction. @defaultValue false */
  sortingDescending?: boolean;
  /** Fires on sort control activation (keyboard-operable — not pointer-only). */
  onSortingChange?: NonCancelableEventHandler<VirtualTableProps.SortingState<T>>;

  /**
   * Controlled per-column widths in px (by column id); the stretch column omits it. Also
   * the controlled source for `resizableColumns` — omit for uncontrolled resize.
   */
  columnWidths?: Record<string, number>;

  /**
   * Enables draggable column resize handles on data-column headers (standard / patterns
   * views). Freeze-on-first-resize: the first drag snapshots every column's rendered width to
   * px so flexible columns become fixed and alignment stays stable; a `minWidth` clamps each
   * column. Controlled via `columnWidths` + `onColumnWidthsChange`, or uncontrolled if both
   * are omitted. @defaultValue false
   */
  resizableColumns?: boolean;
  /** Fires with the full width map (px, by column id) after a resize drag. */
  onColumnWidthsChange?: NonCancelableEventHandler<VirtualTableProps.ColumnWidthsDetail>;

  /** Sticky header with horizontal scroll synced to the body. @defaultValue true */
  stickyHeader?: boolean;

  // --- State / labels ------------------------------------------------------

  /** Rendered when `items` is empty for the active view. */
  empty?: React.ReactNode;
  /** Loading state (initial fetch). SR-announced via i18nStrings. */
  loading?: boolean;
  /** Loading text rendered/announced while `loading` is true. */
  loadingText?: string;

  /**
   * Accessibility labels and the ARIA/announcement string set: the grid label,
   * per-view labels, the expand/collapse trigger label, the follow toggle label,
   * filter-count and append announcement templates, and loading/error text.
   * @i18n
   */
  ariaLabels?: VirtualTableProps.AriaLabels<T>;
  i18nStrings?: VirtualTableProps.I18nStrings;

  /**
   * Imperative handle for consumer-composed streaming controls the component does not
   * render (e.g. a "jump to newest" button in console chrome): scroll to newest,
   * scroll a specific row into view, reveal (expand + highlight) a row, and query
   * whether the view is pinned to the end.
   */
  imperativeRef?: React.Ref<VirtualTableProps.Ref>;
}

export namespace VirtualTableProps {
  export type View = 'standard' | 'patterns' | 'raw';
  export type ExpandedContentPreset = 'log-record' | 'pattern-detail';

  export interface ColumnDefinition<T> {
    id: string;
    header: React.ReactNode;
    /**
     * Cell renderer. Receives the item and CellContext. CellContext exposes row
     * position and expansion, NOT the windowed slice. Cross-row scale (the patterns
     * histogram peak) is delivered as the single resolved scalar
     * `CellContext.histogramPeak` — populated only for `view="patterns"` — because it
     * must be stable across scroll and computed over the full dataset.
     */
    cell: (item: T, context: CellContext) => React.ReactNode;
    sortingField?: string;
    sortingComparator?: (a: T, b: T) => number;
    /** Fixed layout width in px; the single stretch-last column omits it (last wins). */
    width?: number;
    isStretch?: boolean;
    minWidth?: number;
  }

  export interface CellContext {
    /** Dataset-relative index of this row (not window-relative). */
    rowIndex: number;
    totalItemCount: number;
    isExpanded: boolean;
    /** True when this cell is a filter match in mark-in-place mode. */
    isFilterMatch: boolean;
    /**
     * The shared histogram y-scale peak across the FULL dataset. Populated ONLY for
     * `view="patterns"` from the consumer-supplied `PatternsViewConfig.histogramPeak`;
     * `undefined` when that config value is omitted, and for standard/raw views. The
     * cell reads it here rather than recomputing over the windowed slice, so the
     * y-scale is stable across scroll (B3 preserved). Only this single resolved scalar
     * crosses the boundary — the windowed item slice does not.
     */
    histogramPeak?: number;
  }

  export interface RowContext {
    rowIndex: number;
    totalItemCount: number;
  }

  export type ViewConfig<T> = StandardViewConfig<T> | PatternsViewConfig<T> | RawViewConfig<T>;

  export interface StandardViewConfig<T> {
    type: 'standard';
    columnDefinitions: ReadonlyArray<ColumnDefinition<T>>;
  }

  export interface PatternsViewConfig<T> {
    type: 'patterns';
    columnDefinitions: ReadonlyArray<ColumnDefinition<T>>;
    /**
     * The shared histogram peak across the FULL dataset, supplied by the consumer.
     * VirtualTable does not read per-item histogram buckets, so it cannot compute this
     * itself: compute it once over `items` and pass it here. The component surfaces it
     * to the patterns cell via `CellContext.histogramPeak` so the y-scale is shared and
     * stable across scroll. When omitted, `CellContext.histogramPeak` is `undefined`.
     * Always a full-dataset value, never window-scoped.
     */
    histogramPeak?: number;
    /** Enables diff/compare mode (an alternate patterns column set + row pairing). */
    diffMode?: boolean;
  }

  export interface RawViewConfig<T> {
    type: 'raw';
    /** Single monospaced line renderer at RAW_LINE_HEIGHT; no columns, no expansion. */
    renderLine: (item: T) => React.ReactNode;
  }

  export interface Filter<T> {
    mode: 'subset' | 'mark-in-place';
    predicate: (item: T) => boolean;
    /** Optional per-cell highlight, applied only in mark-in-place mode. */
    highlight?: (item: T, columnId: string) => boolean;
  }

  export interface VisibleRangeDetail {
    firstIndex: number;
    lastIndex: number;
  }
  export interface FollowChangeDetail {
    follow: boolean;
    reason: 'scroll-away' | 'reached-bottom' | 'control';
  }
  export interface ExpandChangeDetail<T> {
    item: T;
    expanded: boolean;
    expandedItems: ReadonlyArray<string>;
  }
  export interface AppendDetail {
    appendedCount: number;
  }
  export interface SortingState<T> {
    sortingColumn: ColumnDefinition<T>;
    sortingDescending: boolean;
  }
  export interface ColumnWidthsDetail {
    widths: Record<string, number>;
  }

  export interface Ref {
    /** Scroll to and (optionally) pin to the newest row. */
    scrollToEnd(options?: { pin?: boolean }): void;
    /** Scroll a row (by trackBy key) into view. */
    scrollToItem(key: string): void;
    /**
     * Expand + highlight + scroll a row into view (CW-13 reveal). In `mark-in-place`
     * mode (or with no filter) the row is present, so it is expanded, highlighted, and
     * scrolled into view. If a `subset` filter currently hides the target row, reveal
     * is a no-op for that row — the console should clear or widen the filter first
     * (VirtualTable does not silently drop a consumer-owned filter).
     */
    revealItem(key: string): void;
    /** Whether the view is currently pinned to the last row. */
    isPinnedToEnd(): boolean;
  }

  export interface AriaLabels<T> {
    gridLabel: string;
    viewLabel?: (view: View) => string;
    expandRowLabel?: (item: T) => string;
    collapseRowLabel?: (item: T) => string;
    followToggleLabel?: string;
    filterMatchLabel?: (item: T) => string;
    /** Accessible name for the match-navigation group (mark-in-place filter). */
    matchNavigationLabel?: string;
    /** Accessible name for the previous-match control (mark-in-place filter). */
    previousMatchLabel?: string;
    /** Accessible name for the next-match control (mark-in-place filter). */
    nextMatchLabel?: string;
  }

  export interface I18nStrings {
    loadingText?: string;
    filterCountText?: (matched: number, total: number) => string;
    appendAnnouncementText?: (count: number) => string;
    expandedRegionLabel?: string;
  }
}
