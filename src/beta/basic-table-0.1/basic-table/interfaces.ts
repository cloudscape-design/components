// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

// Public types for BasicTable: the headless `useBasicTable` hook config and the compound-component
// props. BasicTable renders the header and rows it is given (declarative `Header` / `HeaderCell` /
// `Body` / `Row` / `Cell` / `ExpandedContent` children; there is no `items` prop) and owns no data.
// It is windowing-free — to window a large dataset, a consumer composes the separate
// `useVirtualization` primitive on top (its types live in `../use-virtualization/interfaces`).
//
// Columns are a positional width list: `columns: [{ width?, minWidth?, id? }, ...]`, matched to
// cells by position (Nth HeaderCell/Cell = Nth column). A flexible column omits `width`
// (`minmax(minWidth, 1fr)`); a fixed column sets `width`. A stable `id` is only needed to bind a
// cell by id or to use `useColumnVirtualization`.

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
    'aria-rowcount': number;
    'aria-colcount': number;
    'aria-label'?: string;
    tabIndex: number;
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

  /** Fixed height (px) of the scroll viewport. */
  height?: number;
  /** Maximum height (px) of the scroll viewport. */
  maxHeight?: number;

  /** Header slot above the grid (title, counter, actions). */
  header?: React.ReactNode;
  /** Rendered when there are no rows. */
  empty?: React.ReactNode;
  /** Loading state for the whole grid. */
  loading?: boolean;
  loadingText?: string;
}

export namespace BasicTableProps {
  export type Role = 'grid' | 'table';
  export type ColumnLayout = 'fixed' | 'auto';

  /** A column's layout authority — a positional entry (order is the identity). A flexible column
   *  omits `width` (`minmax(minWidth, 1fr)`); a fixed column sets `width`. A stable `id` is only
   *  needed when the column-virtualization primitive is used. */
  export interface ColumnDefinition {
    /** Fixed track width (px). Omit for a flexible track that shares remaining space. */
    width?: number;
    /** Minimum track width (px) — the `minmax` floor for a flexible track, and the resize floor. */
    minWidth?: number;
    /** Stable column identifier — only required when `useColumnVirtualization` binds to this
     *  column (and to bind a `HeaderCell`/`Cell` by id instead of position). */
    id?: string;
  }

  /** Props for `BasicTable.Header` — a declarative header rowgroup. Renders the `HeaderCell`
   *  children it is GIVEN (positional); BasicTable never auto-generates the header from config. */
  export interface HeaderProps {
    /** Renders a sticky header. @defaultValue false */
    sticky?: boolean;
    children?: React.ReactNode;
  }

  /** Props for `BasicTable.HeaderCell` — self-renders one column header (`<th>`). Positional by
   *  default (Nth HeaderCell = Nth column); pass `columnId` to bind by id. To make a column
   *  sortable, set `aria-sort` here (spread through) and render your own sort control in the
   *  children — the table holds no sort state. */
  export interface HeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    /** Bind to a column by id instead of by position (only needed with column virtualization). */
    columnId?: string;
    children?: React.ReactNode;
  }

  /** Props for `BasicTable.Body`. Renders ELEMENT children (Row elements) — not a function-child.
   *  Accepts the runway props spread from `useVirtualization` (style + ref) in the virtual case. */
  export interface BodyProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }

  /** Props for `BasicTable.Row`. Structural — carries NO `item`/data. `index` is the row's
   *  data index (drives `aria-rowindex` and cell wiring). Accepts standard row HTML attributes
   *  (including the `style`/`aria-rowindex` spread from `useVirtualization`); a `ref` (e.g. the
   *  virtualization measure ref) forwards to the underlying `<tr>`. */
  export interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    /** Zero-based data index of this row. */
    index: number;
    /** Stable identity for the row's expansion/region wiring. Required for accessible expansion:
     *  it links the disclosure toggle's `aria-controls` to the `ExpandedContent` region and lets
     *  Escape return focus to the toggle. Without it, expansion still renders but loses that wiring. */
    id?: string;
    /** Whether the row's `ExpandedContent` region is shown (consumer-controlled). */
    expanded?: boolean;
    /** Invoked when the row's expansion is toggled from within (e.g. Escape in the region). */
    onToggleExpand?: () => void;
    children?: React.ReactNode; // Cells + optional ExpandedContent
  }

  /** Props for `BasicTable.Cell`. Positional by default (Nth Cell = Nth column); pass `columnId`
   *  to bind by id. May carry a `style` (e.g. a `gridColumnStart` from `useColumnVirtualization`)
   *  and standard cell HTML attributes. */
  export interface CellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    /** Bind to a column by id instead of by position (only needed with column virtualization). */
    columnId?: string;
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
