// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useResizeObserver, useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { setElementWidth } from './column-widths-utils';

export const DEFAULT_COLUMN_WIDTH = 120;

export interface ColumnWidthDefinition {
  id: PropertyKey;
  minWidth?: string | number;
  maxWidth?: string | number;
  width?: string | number;
}

function readWidths(
  getCell: (columnId: PropertyKey) => null | HTMLElement,
  visibleColumns: readonly ColumnWidthDefinition[]
) {
  const result: Record<PropertyKey, number> = {};
  for (let index = 0; index < visibleColumns.length; index++) {
    const column = visibleColumns[index];
    let width = (column.width as number) || 0;
    const minWidth = (column.minWidth as number) || width || DEFAULT_COLUMN_WIDTH;
    if (
      !width && // read width from the DOM if it is missing in the config
      index !== visibleColumns.length - 1 // skip reading for the last column, because it expands to fully fit the container
    ) {
      const colEl = getCell(column.id);
      width = colEl?.getBoundingClientRect().width ?? DEFAULT_COLUMN_WIDTH;
    }
    result[column.id] = Math.max(width, minWidth);
  }
  return result;
}

function updateWidths(
  visibleColumns: readonly ColumnWidthDefinition[],
  oldWidths: Record<PropertyKey, number>,
  newWidth: number,
  columnId: PropertyKey
) {
  const column = visibleColumns.find(column => column.id === columnId);
  const minWidth = typeof column?.minWidth === 'number' ? column.minWidth : DEFAULT_COLUMN_WIDTH;
  newWidth = Math.max(newWidth, minWidth);
  if (oldWidths[columnId] === newWidth) {
    return oldWidths;
  }
  return { ...oldWidths, [columnId]: newWidth };
}

interface WidthsContext {
  getColumnStyles(sticky: boolean, columnId: PropertyKey): React.CSSProperties;
  columnWidths: Record<PropertyKey, number>;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  setCell: (sticky: boolean, columnId: PropertyKey, node: null | HTMLElement) => void;
}

const WidthsContext = createContext<WidthsContext>({
  getColumnStyles: () => ({}),
  columnWidths: {},
  updateColumn: () => {},
  setCell: () => {},
});

interface WidthProviderProps {
  visibleColumns: readonly ColumnWidthDefinition[];
  resizableColumns: boolean | undefined;
  containerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

export function ColumnWidthsProvider({ visibleColumns, resizableColumns, containerRef, children }: WidthProviderProps) {
  const visibleColumnsRef = useRef<PropertyKey[] | null>(null);
  const containerWidthRef = useRef(0);
  const [columnWidths, setColumnWidths] = useState<null | Record<PropertyKey, number>>(null);

  const cellsRef = useRef<Record<PropertyKey, HTMLElement>>({});
  const stickyCellsRef = useRef<Record<PropertyKey, HTMLElement>>({});
  const getCell = (columnId: PropertyKey): null | HTMLElement => cellsRef.current[columnId] ?? null;
  const setCell = (sticky: boolean, columnId: PropertyKey, node: null | HTMLElement) => {
    const ref = sticky ? stickyCellsRef : cellsRef;
    if (node) {
      ref.current[columnId] = node;
    } else {
      delete ref.current[columnId];
    }
  };
  // Imperatively sets width style for a cell avoiding React state.
  // This allows setting the style as soon container's size change is observed.
  const setColumnWidthStyle = useStableCallback((column: ColumnWidthDefinition) => {
    const cellElement = cellsRef.current[column.id];

    if (resizableColumns && columnWidths) {
      const isLastColumn = column.id === visibleColumns[visibleColumns.length - 1]?.id;
      const totalWidth = visibleColumns.reduce((sum, { id }) => sum + (columnWidths[id] || DEFAULT_COLUMN_WIDTH), 0);
      if (isLastColumn && containerWidthRef.current > totalWidth) {
        setElementWidth(cellElement, 'width', 'auto');
      } else {
        setElementWidth(cellElement, 'width', columnWidths[column.id]);
      }
      setElementWidth(cellElement, 'minWidth', column?.minWidth);
    } else {
      setElementWidth(cellElement, 'width', column?.width);
      setElementWidth(cellElement, 'minWidth', column?.minWidth);
    }
    if (!resizableColumns) {
      setElementWidth(cellElement, 'maxWidth', column?.maxWidth);
    }
  });
  const updateColumnWidths = useStableCallback(() => {
    for (const column of visibleColumns) {
      setColumnWidthStyle(column);
    }
    // Sticky column widths must be synchronized once all real columns widths are assigned.
    for (const id of Object.keys(stickyCellsRef.current)) {
      const cellElement = cellsRef.current[id];
      const stickyCellElement = stickyCellsRef.current[id];
      setElementWidth(stickyCellElement, 'width', cellElement?.offsetWidth);
    }
  });

  // Observes container size and requests an update to the last cell width as it depends on the container's width.
  useResizeObserver(containerRef, ({ contentBoxWidth: containerWidth }) => {
    containerWidthRef.current = containerWidth;
    updateColumnWidths();
  });

  // The widths of the dynamically added columns (after the first render) if not set explicitly
  // will default to the DEFAULT_COLUMN_WIDTH.
  useEffect(() => {
    updateColumnWidths();

    if (!resizableColumns) {
      return;
    }
    const updates: Record<PropertyKey, number> = {};
    const lastVisible = visibleColumnsRef.current;
    if (lastVisible) {
      for (let index = 0; index < visibleColumns.length; index++) {
        const column = visibleColumns[index];
        if (!columnWidths?.[column.id] && lastVisible.indexOf(column.id) === -1) {
          updates[column.id] = (column.width as number) || DEFAULT_COLUMN_WIDTH;
        }
      }
      if (Object.keys(updates).length > 0) {
        setColumnWidths(columnWidths => ({ ...columnWidths, ...updates }));
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
    setColumnWidths(columnWidths => updateWidths(visibleColumns, columnWidths ?? {}, newWidth, columnId));
  }

  // Returns column styles to be assigned to header cells.
  // That improves performance of the initial render by avoiding reflows caused by explicit widths assignment.
  const getColumnStyles = (sticky: boolean, columnId: PropertyKey) => {
    const column = visibleColumns.find(column => column.id === columnId);
    if (column && sticky) {
      return { width: columnWidths?.[column.id] ?? column.width };
    }
    if (column) {
      return {
        width: columnWidths?.[column.id] ?? column.width,
        minWidth: column.minWidth,
        maxWidth: !resizableColumns ? column.maxWidth : undefined,
      };
    }
    return {};
  };

  return (
    <WidthsContext.Provider value={{ getColumnStyles, columnWidths: columnWidths ?? {}, updateColumn, setCell }}>
      {children}
    </WidthsContext.Provider>
  );
}

export function useColumnWidths() {
  return useContext(WidthsContext);
}
