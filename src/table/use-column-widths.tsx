// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useResizeObserver, useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import { ColumnWidthStyle, setElementWidths } from './column-widths-utils';
import { TableProps } from './interfaces';
import { getColumnKey } from './utils';

export const DEFAULT_COLUMN_WIDTH = 120;

export interface ColumnWidthDefinition extends ColumnWidthStyle {
  id: PropertyKey;
}

function readWidths(
  getCell: (columnId: PropertyKey) => null | HTMLElement,
  visibleColumns: readonly ColumnWidthDefinition[]
) {
  const result = new Map<PropertyKey, number>();
  for (let index = 0; index < visibleColumns.length; index++) {
    const column = visibleColumns[index];
    let width = (column.width as number) || 0;
    const minWidth = (column.minWidth as number) || width || DEFAULT_COLUMN_WIDTH;
    if (
      !width && // read width from the DOM if it is missing in the config
      index !== visibleColumns.length - 1 // skip reading for the last column, because it expands to fully fit the container
    ) {
      const colEl = getCell(column.id);
      width = colEl ? getLogicalBoundingClientRect(colEl).inlineSize : DEFAULT_COLUMN_WIDTH;
    }
    result.set(column.id, Math.max(width, minWidth));
  }
  return result;
}

function updateWidths(
  visibleColumns: readonly ColumnWidthDefinition[],
  oldWidths: Map<PropertyKey, number>,
  newWidth: number,
  columnId: PropertyKey
): Map<PropertyKey, number> {
  const column = visibleColumns.find(column => column.id === columnId);
  let minWidth = DEFAULT_COLUMN_WIDTH;
  if (typeof column?.width === 'number' && column.width < DEFAULT_COLUMN_WIDTH) {
    minWidth = column?.width;
  }
  if (typeof column?.minWidth === 'number') {
    minWidth = column?.minWidth;
  }
  newWidth = Math.max(newWidth, minWidth);
  if (oldWidths.get(columnId) === newWidth) {
    return oldWidths;
  }
  const newWidths = new Map(oldWidths);
  newWidths.set(columnId, newWidth);
  return newWidths;
}

interface WidthsContext {
  getColumnStyles(sticky: boolean, columnId: PropertyKey): ColumnWidthStyle;
  columnWidths: Map<PropertyKey, number>;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  updateGroup: (groupId: PropertyKey, newWidth: number) => void;
  setCell: (sticky: boolean, columnId: PropertyKey, node: null | HTMLElement) => void;
  setCol: (columnId: PropertyKey, node: null | HTMLElement) => void;
}

/* istanbul ignore next */
const WidthsContext = createContext<WidthsContext>({
  getColumnStyles: () => ({}),
  columnWidths: new Map(),
  updateColumn: () => {},
  updateGroup: () => {},
  setCell: () => {},
  setCol: () => {},
});

interface WidthProviderProps {
  visibleColumns: readonly ColumnWidthDefinition[];
  resizableColumns: boolean | undefined;
  containerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  groupLeafMap?: Map<string, string[]>;
}

export function ColumnWidthsProvider({
  visibleColumns,
  resizableColumns,
  containerRef,
  groupLeafMap,
  children,
}: WidthProviderProps) {
  const visibleColumnsRef = useRef<PropertyKey[] | null>(null);
  const containerWidthRef = useRef(0);
  const [columnWidths, setColumnWidths] = useState<null | Map<PropertyKey, number>>(null);

  const cellsRef = useRef(new Map<PropertyKey, HTMLElement>());
  const stickyCellsRef = useRef(new Map<PropertyKey, HTMLElement>());
  const colsRef = useRef(new Map<PropertyKey, HTMLElement>());
  const hasColElements = useRef(false);
  const getCell = (columnId: PropertyKey): null | HTMLElement => cellsRef.current.get(columnId) ?? null;
  const setCell = (sticky: boolean, columnId: PropertyKey, node: null | HTMLElement) => {
    const ref = sticky ? stickyCellsRef : cellsRef;
    if (node) {
      ref.current.set(columnId, node);
    } else {
      ref.current.delete(columnId);
    }
  };
  const setCol = (columnId: PropertyKey, node: null | HTMLElement) => {
    if (node) {
      colsRef.current.set(columnId, node);
      hasColElements.current = true;
    } else {
      colsRef.current.delete(columnId);
      hasColElements.current = colsRef.current.size > 0;
    }
  };

  const getColumnStyles = (sticky: boolean, columnId: PropertyKey): ColumnWidthStyle => {
    const column = visibleColumns.find(col => col.id === columnId);

    if (sticky) {
      // For sticky headers, mirror the primary cell's width.
      // Try DOM measurement first (handles columns not in visibleColumns like selection).
      const measured = cellsRef.current.get(columnId)?.getBoundingClientRect().width;
      /* istanbul ignore next: getBoundingClientRect returns 0 in JSDOM */
      if (measured) {
        return { width: measured };
      }
      return { width: columnWidths?.get(columnId) ?? column?.width };
    }

    if (!column) {
      return {};
    }

    if (resizableColumns && columnWidths) {
      const isLastColumn = column.id === visibleColumns[visibleColumns.length - 1]?.id;
      const totalWidth = visibleColumns.reduce(
        (sum, { id }) => sum + (columnWidths.get(id) || DEFAULT_COLUMN_WIDTH),
        0
      );
      if (isLastColumn && containerWidthRef.current > totalWidth) {
        return { width: 'auto', minWidth: column.minWidth };
      }
      return { width: columnWidths.get(column.id), minWidth: column.minWidth };
    }

    return {
      width: column.width,
      minWidth: column.minWidth,
      maxWidth: !resizableColumns ? column.maxWidth : undefined,
    };
  };

  // Imperatively sets width style for a cell avoiding React state.
  // This allows setting the style as soon container's size change is observed.
  const updateColumnWidths = useStableCallback(() => {
    // Skip imperative width updates before columnWidths is initialized for resizable tables.
    // Before initialization, cells get their widths from React's render (via resizableStyle prop).
    // Applying getColumnStyles here would overwrite persisted widths with stale column definitions.
    if (!resizableColumns || columnWidths) {
      if (hasColElements.current) {
        for (const { id } of visibleColumns) {
          const colElement = colsRef.current.get(id);
          if (colElement) {
            setElementWidths(colElement, getColumnStyles(false, id));
          }
          const element = cellsRef.current.get(id);
          if (element) {
            setElementWidths(element, getColumnStyles(false, id));
          }
        }
      } else {
        for (const { id } of visibleColumns) {
          const element = cellsRef.current.get(id);
          if (element) {
            setElementWidths(element, getColumnStyles(false, id));
          }
        }
      }
    }

    // Sticky column widths must always be synchronized regardless of columnWidths state.
    for (const { id } of visibleColumns) {
      const element = stickyCellsRef.current.get(id);
      if (element) {
        setElementWidths(element, getColumnStyles(true, id));
      }
    }
  });

  // Observes container size and requests an update to the last cell width as it depends on the container's width.
  useResizeObserver(containerRef, ({ contentBoxWidth: containerWidth }) => {
    containerWidthRef.current = containerWidth;
    requestAnimationFrame(() => updateColumnWidths());
  });

  // The widths of the dynamically added columns (after the first render) if not set explicitly
  // will default to the DEFAULT_COLUMN_WIDTH.
  useEffect(() => {
    updateColumnWidths();

    if (!resizableColumns) {
      return;
    }
    let updated = false;
    const newColumnWidths = new Map(columnWidths);
    const lastVisible = visibleColumnsRef.current;
    if (lastVisible) {
      for (let index = 0; index < visibleColumns.length; index++) {
        const column = visibleColumns[index];
        if (!columnWidths?.get(column.id) && lastVisible.indexOf(column.id) === -1) {
          updated = true;
          const width = (column.width as number) || DEFAULT_COLUMN_WIDTH;
          const minWidth = (column.minWidth as number) || width;
          newColumnWidths.set(column.id, Math.max(width, minWidth));
        }
      }
      if (updated) {
        setColumnWidths(newColumnWidths);
      }
    }
    visibleColumnsRef.current = visibleColumns.map(column => column.id);
  }, [columnWidths, resizableColumns, visibleColumns, updateColumnWidths]);

  // Read the actual column widths after the first render to employ the browser defaults for
  // those columns without explicit width.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    setColumnWidths(() => readWidths(getCell, visibleColumns));
    // This code is intended to run only at the first render and should not re-run when table props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateColumn(columnId: PropertyKey, newWidth: number) {
    setColumnWidths(columnWidths => updateWidths(visibleColumns, columnWidths ?? new Map(), newWidth, columnId));
  }

  /* istanbul ignore next: covered by integration tests, requires real DOM measurements */
  function updateGroup(groupId: PropertyKey, newGroupWidth: number) {
    if (!columnWidths || !groupLeafMap) {
      return;
    }

    const leafIds = groupLeafMap.get(String(groupId)) ?? [];
    const rightmostLeaf = leafIds[leafIds.length - 1];
    if (!rightmostLeaf) {
      return;
    }

    let currentGroupWidth = 0;
    for (const id of leafIds) {
      currentGroupWidth += columnWidths.get(id) || DEFAULT_COLUMN_WIDTH;
    }

    const delta = newGroupWidth - currentGroupWidth;
    const currentLeafWidth = columnWidths.get(rightmostLeaf) || DEFAULT_COLUMN_WIDTH;
    updateColumn(rightmostLeaf, currentLeafWidth + delta);
  }

  return (
    <WidthsContext.Provider
      value={{ getColumnStyles, columnWidths: columnWidths ?? new Map(), updateColumn, updateGroup, setCell, setCol }}
    >
      {children}
    </WidthsContext.Provider>
  );
}

/*
 * Renders a <colgroup> with <col> elements for each leaf column.
 * With table-layout:fixed, <col> widths control actual column widths,
 * which makes colspan headers automatically span the correct width.
 * Must be rendered inside ColumnWidthsProvider.
 */
export function TableColGroup({
  visibleColumnDefinitions,
  hasSelection,
  sticky = false,
  selectionColumnId,
}: {
  visibleColumnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>;
  hasSelection: boolean;
  sticky?: boolean;
  selectionColumnId?: PropertyKey;
}) {
  const { getColumnStyles, setCol } = useColumnWidths();
  return (
    <colgroup>
      {hasSelection && (
        <col
          style={sticky && selectionColumnId ? { width: getColumnStyles(true, selectionColumnId).width } : undefined}
        />
      )}
      {visibleColumnDefinitions.map((column, colIndex) => {
        const columnId = getColumnKey(column, colIndex);
        if (sticky) {
          return <col key={String(columnId)} style={{ width: getColumnStyles(true, columnId).width }} />;
        }
        return <col key={columnId} data-column-id={String(columnId)} ref={node => setCol(columnId, node)} />;
      })}
    </colgroup>
  );
}

export function useColumnWidths() {
  return useContext(WidthsContext);
}
