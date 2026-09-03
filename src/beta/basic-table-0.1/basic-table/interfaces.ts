// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../../../internal/base-component';
import { NonCancelableEventHandler } from '../../../internal/events';

// Public types for BasicTable: the headless `useBasicTable` hook config and the compound-component
// props. BasicTable renders the header and rows it is given (declarative `Header` / `HeaderCell` /
// `Body` / `Row` / `Cell` / `ExpandedContent` children; there is no `items` prop) and owns no data.
// It is windowing-free and owns no virtualization — to window a large dataset, a consumer brings
// their own virtualization and spreads the resulting offset/measure props onto `Body` / `Row`.
//
// Columns are a positional width list: `columns: [{ width?, minWidth?, id? }, ...]`, matched to
// cells by position (Nth HeaderCell/Cell = Nth column). A flexible column omits `width`
// (`minmax(minWidth, 1fr)`); a fixed column sets `width`. A stable `id` is only needed to bind a
// cell by id rather than by position.

/** Config for the headless `useBasicTable` hook and, by extension, `BasicTable.Root`. */
export interface UseBasicTableConfig {
  /** Positional column layout list (the single source of column WIDTH authority). One entry per
   *  column, in order; the Nth HeaderCell/Cell binds to the Nth entry. */
  columns: ReadonlyArray<BasicTableProps.ColumnDefinition>;

  /** Semantic role of the grid. `"grid"` (default) for interactive keyboard nav; `"table"` for
   *  static data. @defaultValue "grid" */
  role?: BasicTableProps.Role;

  /** Enables column resize handles. Emits via `onColumnWidthsChange`. @defaultValue false */
  resizableColumns?: boolean;
  /** Controlled per-column widths (px), keyed by column INDEX. Uncontrolled if omitted. */
  columnWidths?: Record<number, number>;
  onColumnWidthsChange?: NonCancelableEventHandler<BasicTableProps.ColumnWidthsDetail>;

  /** Column layout. `"fixed"` (default) uses the positional width config (flexible columns share
   *  remaining space as `1fr`); `"auto"` sizes each flexible column to its measured content width.
   *  @defaultValue "fixed" */
  columnLayout?: BasicTableProps.ColumnLayout;
  /** Measured content widths (px) keyed by column INDEX, applied only when `columnLayout="auto"`.
   *  `BasicTable.Root` measures these from the DOM; a headless consumer of the hook may supply its
   *  own measurements. */
  autoColumnWidths?: Record<number, number>;

  /** Pins a number of leading (`first`) / trailing (`last`) columns during horizontal scroll. */
  stickyColumns?: BasicTableProps.StickyColumns;

  /** `"compact"` reduces cell padding via the shared Cloudscape compact-table context.
   *  @defaultValue "comfortable" */
  contentDensity?: 'comfortable' | 'compact';

  /** True total dataset row count — authoritative source for the grid's `aria-rowcount` / SR count
   *  and empty detection (needed because the windowed consumer only renders a slice). */
  totalRowCount?: number;

  /** Localized accessibility strings and label functions. @i18n */
  i18nStrings?: BasicTableProps.I18nStrings;
}

// NOTE: `UseBasicTableResult` (the hook's return type) lives in `./use-basic-table` because it
// references internal Cloudscape types (the sticky-columns model).

/** Return shapes of the `useBasicTable` prop-getters (spreadable DOM props, no hooks). */
export namespace BasicTableGetters {
  export interface TableProps {
    role: BasicTableProps.Role;
    'aria-rowcount'?: number;
    'aria-colcount'?: number;
    'aria-label'?: string;
    tabIndex?: number;
  }
  export interface HeaderGroupProps {
    role: 'row';
    'aria-rowindex': number;
    style: React.CSSProperties;
  }
  export interface ColumnHeaderProps {
    role: 'columnheader';
    'aria-colindex': number;
    scope: 'col';
  }
  export interface ResizeHandleProps {
    'aria-roledescription': string;
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  }
  export interface BodyProps {
    role: 'rowgroup';
  }
  export interface RowProps {
    role: 'row';
    'aria-rowindex': number;
    style: React.CSSProperties;
  }
  export interface CellProps {
    role: 'gridcell' | 'cell';
    'aria-colindex': number;
    'data-awsui-row-index'?: number;
  }
}

/** Props for `BasicTable.Root`. Extends the headless config with the presentational shell
 *  (viewport height, empty/loading) and the compound children (Header + Body). */
export interface BasicTableProps extends BaseComponentProps, UseBasicTableConfig {
  /** Compound children — a declarative `Header` plus a `Body` (the mapped `Row`s). */
  children: React.ReactNode;

  /** Column layout. `"fixed"` (default) applies fixed table layout; `"auto"` sizes to content.
   *  @defaultValue "fixed" */
  columnLayout?: BasicTableProps.ColumnLayout;

  /** Fixed height (px). Setting `height` (or `maxHeight`) opts the table into its OWN bounded internal
   *  scroll viewport. When neither is set, the table flows at full height and the page / app-layout is
   *  the scroll runway — the sticky header then pins to the viewport (body-scroll, like Table). */
  height?: number;
  /** Maximum height (px) — see `height`; bounds the table into its own internal scroll viewport. */
  maxHeight?: number;
  /** Additional offset (px) from the top of the page at which the sticky header pins, to clear fixed
   *  app chrome (e.g. an AppLayout header / notifications). Applies in the body-scroll (unbounded)
   *  layout only. Mirrors Table's `stickyHeaderVerticalOffset`. */
  stickyHeaderVerticalOffset?: number;

  /** Sticky region pinned to the top of the scroll viewport. A truthy value pins the column-header
   *  row as a sticky overlay while the body scrolls beneath it. A real element additionally renders a
   *  sticky title band (general header content — a `Header`, pagination, counters) chained directly
   *  above the column headers, so the tools and column headers pin together. `true` (with no element)
   *  pins the column headers alone, with no title band. Falsy/undefined is not sticky. For a
   *  non-sticky header, compose that content before `<BasicTable>` — there is no non-sticky header slot. */
  stickyHeader?: React.ReactNode;
  /** Rendered when there are no rows. */
  empty?: React.ReactNode;
  /** Loading state for the whole grid. */
  loading?: boolean;
  loadingText?: string;
}

/** Arbitrary `data-*` attributes forwarded to a part's root element — e.g. the `data-index`
 *  measurement hook a 3rd-party virtualization library (react-window, TanStack Virtual, …) sets on
 *  each row. */
interface DataAttributes {
  [key: `data-${string}`]: string | number | boolean | undefined;
}

/** Minimal DOM pass-through shared by BasicTable's structural parts. Deliberately NOT the full
 *  `HTMLAttributes` surface: it omits the event-handler grab-bag (which the documenter can't
 *  serialize and which over-exposes the DOM), keeping only what a consumer — or a 3rd-party
 *  virtualization library — actually forwards: styling hooks and `data-*` measurement attributes. */
interface StructuralPartProps extends DataAttributes {
  /** Extra CSS class applied to the part's root element. */
  className?: string;
  /** Inline styles applied to the part's root element — e.g. the absolute-offset / `transform`
   *  a consumer's own virtualization spreads onto each row or onto the body runway. */
  style?: React.CSSProperties;
}

export namespace BasicTableProps {
  export type Role = 'grid' | 'table';
  export type ColumnLayout = 'fixed' | 'auto';

  /** A column's layout authority — a positional entry (order is the identity). A flexible column
   *  omits `width` (`minmax(minWidth, 1fr)`); a fixed column sets `width`. A stable `id` is only
   *  needed to bind a cell by id rather than by position. */
  export interface ColumnDefinition {
    /** Fixed track width (px). Omit for a flexible track that shares remaining space. */
    width?: number;
    /** Minimum track width (px) — the `minmax` floor for a flexible track, and the resize floor. */
    minWidth?: number;
    /** Stable column identifier — only needed to bind a `HeaderCell`/`Cell` by id
     * rather than by position. */
    id?: string;
  }

  /** Props for `BasicTable.Header` — a declarative header rowgroup. Renders the `HeaderCell`
   *  children it is GIVEN (positional); BasicTable never auto-generates the header from config.
   *  Stickiness is controlled by the root `stickyHeader` prop, not here. */
  export interface HeaderProps {
    children?: React.ReactNode;
  }

  /** Props for `BasicTable.HeaderCell` — self-renders one column header (`<th>`). Positional by
   *  default (Nth HeaderCell = Nth column); pass `columnId` to bind by id. To make a column
   *  sortable, set `aria-sort` here (spread through) and render your own sort control in the
   *  children — the table holds no sort state. */
  export interface HeaderCellProps extends StructuralPartProps {
    /** Bind to a column by id instead of by position. */
    columnId?: string;
    /** Sort indicator for a sortable column, forwarded to the header cell's `aria-sort`. BasicTable
     *  holds no sort state — render your own sort control in `children` and manage sorting yourself. */
    'aria-sort'?: React.AriaAttributes['aria-sort'];
    /** Wraps the header content onto multiple lines instead of truncating it with an ellipsis.
     *  @defaultValue false */
    wrapText?: boolean;
    /** Renders a fixed-width, centered leading control-column header (tokenized width + focus
     *  chrome) instead of a default data-column header. `"selection"` for a select-all checkbox
     *  column; `"disclosure"` for an expand/collapse column. */
    variant?: 'selection' | 'disclosure';
    children?: React.ReactNode;
  }

  /** Props for `BasicTable.Body`. Renders ELEMENT children (Row elements) — not a function-child.
   *  Accepts a consumer's own virtualization runway props (style + ref) when windowing. */
  export interface BodyProps extends StructuralPartProps {
    children?: React.ReactNode;
  }

  /** Props for `BasicTable.Row`. Structural — carries NO `item`/data. `index` is the row's
   *  data index (drives `aria-rowindex` and cell wiring). Accepts standard row HTML attributes
   *  (including a `style`/`aria-rowindex` a consumer's own virtualization spreads); a `ref` (e.g. a
   *  virtualization measure ref) forwards to the underlying `<tr>`. */
  export interface RowProps extends StructuralPartProps {
    /** Zero-based data index of this row. */
    index: number;
    /** Stable identity for the row's expansion/region wiring. Required for accessible expansion:
     *  it links the disclosure toggle's `aria-controls` to the `ExpandedContent` region and lets
     *  Escape return focus to the toggle. Without it, expansion still renders but loses that wiring. */
    id?: string;
    /** Whether the row's `ExpandedContent` region is shown (consumer-controlled). */
    expanded?: boolean;
    /** Fired when the row's expansion is toggled from within — e.g. Escape pressed inside the
     *  region when there is no disclosure toggle to return focus to. Detail is empty. */
    onToggleExpand?: NonCancelableEventHandler;
    /** Marks the row as selected: applies the tokenized selected-row surface (background + selected
     *  border) and sets `aria-selected`. Pair with a composed selection control (a checkbox/radio in
     *  a leading `Cell`). Avoids styling the selected state through the deprecated `className`. */
    selected?: boolean;
    /** Shades this row (the alternating "striped" surface). The consumer chooses which rows are
     *  shaded — typically `striped={index % 2 === 1}` — since BasicTable renders the rows it is given
     *  and owns no row parity. A selected row overrides shading. */
    striped?: boolean;
    /** Absolute row position for `aria-rowindex`, forwarded so a consumer's own virtualization can
     *  report a windowed row's true position in the full dataset (overrides the computed value). */
    'aria-rowindex'?: number;
    children?: React.ReactNode; // Cells + optional ExpandedContent
  }

  /** Props for `BasicTable.Cell`. Positional by default (Nth Cell = Nth column); pass `columnId`
   *  to bind by id. May carry a `style` (e.g. a `gridColumnStart` from a consumer's own column
   *  windowing) and standard cell HTML attributes. */
  export interface CellProps extends StructuralPartProps {
    /** Bind to a column by id instead of by position. */
    columnId?: string;
    /** Wraps the cell content onto multiple lines instead of truncating it with an ellipsis.
     *  @defaultValue false */
    wrapText?: boolean;
    /** Renders a fixed-width, centered leading control cell (tokenized width + focus chrome) — host
     *  the control here — instead of a default data cell. `"selection"` for a row selection
     *  checkbox/radio; `"disclosure"` for the row's expand/collapse toggle. */
    variant?: 'selection' | 'disclosure';
    children?: React.ReactNode;
  }

  /** Props for `BasicTable.ExpandedContent` — arbitrary non-tabular expanded detail nested inside
   *  its `Row`. Reads `expanded`/`id` from its row; renders the labeled region only when the row
   *  is expanded. */
  export interface ExpandedContentProps {
    /** Accessible name for the expanded region, tying it to its row. */
    label?: string;
    children: React.ReactNode;
  }

  export interface ColumnWidthsDetail {
    /** Per-column widths (px), keyed by column INDEX. */
    widths: Record<number, number>;
  }

  export interface StickyColumns {
    /** Number of leading columns pinned to the inline-start edge. @defaultValue 0 */
    first?: number;
    /** Number of trailing columns pinned to the inline-end edge. @defaultValue 0 */
    last?: number;
  }

  export interface I18nStrings {
    /** Accessible name for the grid, set as its `aria-label`. Recommended — a data grid should
     *  always have an accessible name. */
    tableLabel?: string;
    /** Custom role description for a column's resize handle. @i18n @defaultValue 'resize handle' */
    resizerRoleDescription?: string;
  }
}
