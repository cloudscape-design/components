// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { fireNonCancelableEvent } from '../../../internal/events';
import { StickyColumnsModel, useStickyColumns } from '../../../table/sticky-columns';
import { BasicTableGetters, BasicTableProps, UseBasicTableConfig } from './interfaces';

// Default minimum column width (px), so a resized column cannot collapse below a usable width. A
// column may raise its floor with `minWidth`; it never drops below this default.
export const DEFAULT_COLUMN_WIDTH = 120;

/** Result of `useBasicTable`: pure prop-getters plus the shared state the element-level
 *  components (Cell / HeaderCell) layer their own per-element hooks on top of. Column access is by
 *  index. */
export interface UseBasicTableResult {
  /** The positional column config (widths / minWidths, in order). */
  columns: ReadonlyArray<BasicTableProps.ColumnDefinition>;
  /** Total column count for `aria-colcount` and state-row colSpan. */
  columnCount: number;
  /** Semantic grid role. */
  role: BasicTableProps.Role;
  /** The SINGLE shared `grid-template-columns`, applied to the header row and every body row. */
  gridTemplateColumns: string;
  /** Whether column resize handles are rendered. */
  resizableColumns: boolean;
  /** Resolved content density. */
  contentDensity: 'comfortable' | 'compact';
  /** Effective total row count (config `totalRowCount` ?? 0). */
  totalRowCount: number;
  /** The real Table sticky-columns model — consumed by per-cell `useStickyCellStyles`. */
  stickyColumns: StickyColumnsModel;
  /** aria-roledescription for the resize handle toggle. */
  resizerRoleDescription: string;

  /** Resolve a column INDEX from an optional `columnId` (positional fallback). Returns -1 for an
   *  unknown id. */
  resolveColumnIndex: (columnId: string | undefined, positional: number | null) => number;
  /** The stable sticky key for a column index (config `id` if present, else the index). */
  stickyColumnId: (columnIndex: number) => string;
  /** Ref callback so a header cell registers its node (by index) for freeze-on-first-resize. */
  registerHeaderCell: (columnIndex: number, node: HTMLElement | null) => void;
  /** Begin a pointer-driven column resize (by index). */
  startColumnResize: (columnIndex: number, event: React.PointerEvent<HTMLElement>) => void;
  /** Adjust a column's width by a keyboard step (px delta); clamps at the column's resize floor. */
  adjustColumnWidth: (columnIndex: number, delta: number) => void;
  /** Current width (px) of a column for the resize slider's `aria-valuenow`. */
  currentColumnWidth: (columnIndex: number) => number;
  /** A column's effective resize floor (its `minWidth` or `DEFAULT_COLUMN_WIDTH`). */
  resizeMinWidthOf: (columnIndex: number) => number;

  /** Props for the grid element (`<table role=grid>`). */
  getTableProps: () => BasicTableGetters.TableProps;
  /** Props for the header row (`<tr>`). */
  getHeaderGroupProps: () => BasicTableGetters.HeaderGroupProps;
  /** Static props for a column header cell (`<th>`); merge with per-cell sticky/roving output. */
  getColumnHeaderProps: (columnIndex: number) => BasicTableGetters.ColumnHeaderProps;
  /** Props for a column's resize handle toggle. */
  getResizeHandleProps: (columnIndex: number) => BasicTableGetters.ResizeHandleProps;
  /** Props for the body element (`<tbody role=rowgroup>`). */
  getBodyProps: () => BasicTableGetters.BodyProps;
  /** Static props for a row (`<tr>`) at a data index; merge with any virtualization rowProps. */
  getRowProps: (index: number) => BasicTableGetters.RowProps;
  /** Static props for a cell (`<td>`) at a column index; merge with per-cell sticky/roving output. */
  getCellProps: (columnIndex: number, rowIndex?: number) => BasicTableGetters.CellProps;
}

// The headless `useBasicTable` hook: given a positional `columns` config plus table state, it owns
// the shared `grid-template-columns` alignment, controlled/uncontrolled column resize (floored at
// `DEFAULT_COLUMN_WIDTH`), the sticky-columns model, and the grid a11y numbers
// (aria-colindex / aria-rowindex / aria-rowcount), returning prop-getters the consumer (or the
// `BasicTable.*` components) spreads onto elements.
//
// The returned getters are plain functions the consumer may call in loops or conditionally, so they
// must not call React hooks. Per-element concerns that need a hook each — roving tabindex
// (`useSingleTabStopNavigation`) and per-cell sticky offsets (`useStickyCellStyles`) — run inside
// the Cell / HeaderCell components and merge with the static getter output.

export function useBasicTable(config: UseBasicTableConfig): UseBasicTableResult {
  const {
    columns,
    resizableColumns = false,
    columnWidths,
    onColumnWidthsChange,
    stickyColumns,
    role = 'grid',
    i18nStrings,
    contentDensity = 'comfortable',
    totalRowCount = 0,
  } = config;

  const columnCount = columns.length;

  // --- Column identity (positional; `id` only for column-virt binding) ---------------------
  const stickyColumnId = useCallback(
    (columnIndex: number) => columns[columnIndex]?.id ?? String(columnIndex),
    [columns]
  );

  const resolveColumnIndex = useCallback(
    (columnId: string | undefined, positional: number | null) => {
      if (columnId !== undefined) {
        return columns.findIndex(c => c.id === columnId);
      }
      return positional ?? 0;
    },
    [columns]
  );

  // --- Shared column-track layout + resize -------------------------------------------------
  const isWidthControlled = columnWidths !== undefined;
  const [uncontrolledWidths, setUncontrolledWidths] = useState<Record<number, number>>({});
  const widths = isWidthControlled ? columnWidths! : uncontrolledWidths;

  // A flexible column (no `width`) is `minmax(minWidth, 1fr)` and shares remaining space; a fixed
  // column has a `width`. A resized column becomes fixed at its (floored) resized width.
  const gridTemplateColumns = useMemo(() => {
    const tracks: string[] = [];
    columns.forEach((col, index) => {
      const resized = widths[index];
      if (resized !== undefined) {
        tracks.push(`${Math.max(resized, col.minWidth ?? 0)}px`);
      } else if (col.width !== undefined) {
        tracks.push(`${col.width}px`);
      } else {
        tracks.push(`minmax(${col.minWidth ?? 0}px, 1fr)`);
      }
    });
    return tracks.join(' ');
  }, [columns, widths]);

  // --- Sticky (pinned) columns -------------------------------------------------------------
  const stickyIds = useMemo(() => columns.map((col, index) => col.id ?? String(index)), [columns]);
  const stickyIdsKey = stickyIds.join('\u0000');
  const stickyVisibleColumns = useMemo(
    () => stickyIds,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stickyIdsKey]
  );
  const stickyState = useStickyColumns({
    visibleColumns: stickyVisibleColumns,
    stickyColumnsFirst: stickyColumns?.first ?? 0,
    stickyColumnsLast: stickyColumns?.last ?? 0,
  });

  // --- Resize wiring -----------------------------------------------------------------------
  const headerCellRefs = useRef(new Map<number, HTMLElement>());
  const widthsRef = useRef(widths);
  widthsRef.current = widths;
  const resizeFloors = useRef<number[]>([]);
  resizeFloors.current = columns.map(col => col.minWidth ?? DEFAULT_COLUMN_WIDTH);

  const registerHeaderCell = useCallback((columnIndex: number, node: HTMLElement | null) => {
    if (node) {
      headerCellRefs.current.set(columnIndex, node);
    } else {
      headerCellRefs.current.delete(columnIndex);
    }
  }, []);

  const applyWidths = useCallback(
    (next: Record<number, number>) => {
      if (!isWidthControlled) {
        setUncontrolledWidths(next);
      }
      if (onColumnWidthsChange) {
        fireNonCancelableEvent(onColumnWidthsChange, { widths: next });
      }
    },
    [isWidthControlled, onColumnWidthsChange]
  );

  const freezeWidths = useCallback((): Record<number, number> => {
    const frozen: Record<number, number> = { ...widthsRef.current };
    let needSnapshot = false;
    headerCellRefs.current.forEach((node, index) => {
      if (frozen[index] === undefined) {
        frozen[index] = Math.round(node.getBoundingClientRect().width);
        needSnapshot = true;
      }
    });
    if (needSnapshot) {
      applyWidths(frozen);
    }
    return frozen;
  }, [applyWidths]);

  const currentColumnWidth = useCallback((columnIndex: number): number => {
    const resized = widthsRef.current[columnIndex];
    if (resized !== undefined) {
      return resized;
    }
    return Math.round(headerCellRefs.current.get(columnIndex)?.getBoundingClientRect().width ?? 0);
  }, []);

  const resizeMinWidthOf = useCallback(
    (columnIndex: number) => resizeFloors.current[columnIndex] ?? DEFAULT_COLUMN_WIDTH,
    []
  );

  const adjustColumnWidth = useCallback(
    (columnIndex: number, delta: number) => {
      const frozen = freezeWidths();
      const current = frozen[columnIndex] ?? 0;
      const min = resizeFloors.current[columnIndex] ?? DEFAULT_COLUMN_WIDTH;
      applyWidths({ ...frozen, [columnIndex]: Math.max(min, current + delta) });
    },
    [applyWidths, freezeWidths]
  );

  const resizeState = useRef<{ columnIndex: number; startX: number; startWidth: number } | null>(null);
  const startColumnResize = useCallback(
    (columnIndex: number, event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const frozen = freezeWidths();
      const startWidth =
        frozen[columnIndex] ?? Math.round(headerCellRefs.current.get(columnIndex)?.getBoundingClientRect().width ?? 0);
      resizeState.current = { columnIndex, startX: event.clientX, startWidth };
      const onMove = (moveEvent: PointerEvent) => {
        const state = resizeState.current;
        if (!state) {
          return;
        }
        const min = resizeFloors.current[state.columnIndex] ?? DEFAULT_COLUMN_WIDTH;
        const next = Math.max(min, Math.round(state.startWidth + (moveEvent.clientX - state.startX)));
        applyWidths({ ...widthsRef.current, [state.columnIndex]: next });
      };
      const onUp = () => {
        resizeState.current = null;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [applyWidths, freezeWidths]
  );

  const resizerRoleDescription =
    i18nStrings?.resizerRoleDescription ?? 'resize handle';

  // --- Prop getters (pure — NO hooks inside) -----------------------------------------------
  const getTableProps = useCallback(
    (): BasicTableGetters.TableProps => ({
      role,
      'aria-rowcount': totalRowCount + 1,
      'aria-colcount': columnCount,
      'aria-label': i18nStrings?.tableLabel,
      tabIndex: -1,
    }),
    [role, totalRowCount, columnCount, i18nStrings]
  );

  const getHeaderGroupProps = useCallback(
    (): BasicTableGetters.HeaderGroupProps => ({
      role: 'row',
      'aria-rowindex': 1,
      style: { gridTemplateColumns },
    }),
    [gridTemplateColumns]
  );

  const getColumnHeaderProps = useCallback(
    (columnIndex: number): BasicTableGetters.ColumnHeaderProps => ({
      role: 'columnheader',
      'aria-colindex': columnIndex + 1,
      scope: 'col',
    }),
    []
  );

  const getResizeHandleProps = useCallback(
    (columnIndex: number): BasicTableGetters.ResizeHandleProps => ({
      'aria-roledescription': resizerRoleDescription,
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => startColumnResize(columnIndex, event),
    }),
    [resizerRoleDescription, startColumnResize]
  );

  const getBodyProps = useCallback((): BasicTableGetters.BodyProps => ({ role: 'rowgroup' }), []);

  const getRowProps = useCallback(
    (index: number): BasicTableGetters.RowProps => ({
      role: 'row',
      'aria-rowindex': index + 2, // header counted as row 1
      style: { gridTemplateColumns },
    }),
    [gridTemplateColumns]
  );

  const getCellProps = useCallback(
    (columnIndex: number, rowIndex?: number): BasicTableGetters.CellProps => ({
      // A `role="table"` container requires `cell` children; a `role="grid"` container requires `gridcell`.
      role: role === 'table' ? 'cell' : 'gridcell',
      'aria-colindex': columnIndex + 1,
      ...(rowIndex !== undefined ? { 'data-awsui-row-index': rowIndex } : {}),
    }),
    [role]
  );

  return {
    columns,
    columnCount,
    role,
    gridTemplateColumns,
    resizableColumns,
    contentDensity,
    totalRowCount,
    stickyColumns: stickyState,
    resizerRoleDescription,
    resolveColumnIndex,
    stickyColumnId,
    registerHeaderCell,
    startColumnResize,
    adjustColumnWidth,
    currentColumnWidth,
    resizeMinWidthOf,
    getTableProps,
    getHeaderGroupProps,
    getColumnHeaderProps,
    getResizeHandleProps,
    getBodyProps,
    getRowProps,
    getCellProps,
  };
}
