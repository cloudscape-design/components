// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useResizeObserver, useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { setElementWidths } from './column-widths-utils';

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
      width = colEl?.getBoundingClientRect().width ?? DEFAULT_COLUMN_WIDTH;
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
) {
  const column = visibleColumns.find(column => column.id === columnId);
  const minWidth = typeof column?.minWidth === 'number' ? column.minWidth : DEFAULT_COLUMN_WIDTH;
  newWidth = Math.max(newWidth, minWidth);
  if (oldWidths.get(columnId) === newWidth) {
    return oldWidths;
  }
  const newWidths = new Map(oldWidths);
  newWidths.set(columnId, newWidth);
  return newWidths;
}

interface WidthsContext {
  getColumnStyles(sticky: boolean, columnId: PropertyKey): React.CSSProperties;
  columnWidths: Map<PropertyKey, number>;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  setCell: (sticky: boolean, columnId: PropertyKey, node: null | HTMLElement) => void;
}

const WidthsContext = createContext<WidthsContext>({
  getColumnStyles: () => ({}),
  columnWidths: new Map(),
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
  const [columnWidths, setColumnWidths] = useState<null | Map<PropertyKey, number>>(null);

  const cellsRef = useRef(new Map<PropertyKey, HTMLElement>());
  const stickyCellsRef = useRef(new Map<PropertyKey, HTMLElement>());
  const getCell = (columnId: PropertyKey): null | HTMLElement => cellsRef.current.get(columnId) ?? null;
  const setCell = (sticky: boolean, columnId: PropertyKey, node: null | HTMLElement) => {
    const ref = sticky ? stickyCellsRef : cellsRef;
    if (node) {
      ref.current.set(columnId, node);
    } else {
      ref.current.delete(columnId);
    }
  };

  const getColumnStyles = (sticky: boolean, columnId: PropertyKey): React.CSSProperties => {
    const column = visibleColumns.find(column => column.id === columnId);
    if (!column) {
      return {};
    }

    if (sticky) {
      return { width: cellsRef.current.get(column.id)?.offsetWidth || (columnWidths?.get(column.id) ?? column.width) };
    }

    if (resizableColumns && columnWidths) {
      const isLastColumn = column.id === visibleColumns[visibleColumns.length - 1]?.id;
      const totalWidth = visibleColumns.reduce(
        (sum, { id }) => sum + (columnWidths.get(id) || DEFAULT_COLUMN_WIDTH),
        0
      );
      if (isLastColumn && containerWidthRef.current > totalWidth) {
        return { width: 'auto', minWidth: column?.minWidth };
      } else {
        return { width: columnWidths.get(column.id), minWidth: column?.minWidth };
      }
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
    for (const { id } of visibleColumns) {
      const element = cellsRef.current.get(id);
      if (element) {
        setElementWidths(element, getColumnStyles(false, id));
      }
    }
    // Sticky column widths must be synchronized once all real column widths are assigned.
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
    updateColumnWidths();
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
          newColumnWidths.set(column.id, (column.width as number) || DEFAULT_COLUMN_WIDTH);
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

  return (
    <WidthsContext.Provider value={{ getColumnStyles, columnWidths: columnWidths ?? new Map(), updateColumn, setCell }}>
      {children}
    </WidthsContext.Provider>
  );
}

export function useColumnWidths() {
  return useContext(WidthsContext);
}
