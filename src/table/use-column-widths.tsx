// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';

export const DEFAULT_COLUMN_WIDTH = 120;

export interface ColumnWidthDefinition {
  id: PropertyKey;
  minWidth?: string | number;
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
  stretchLastColumn: boolean;
  columnWidths: Record<PropertyKey, number>;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  setCell: (columnId: PropertyKey, node: null | HTMLElement) => void;
}

const WidthsContext = createContext<WidthsContext>({
  stretchLastColumn: false,
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
  const visibleColumnsRef = useRef<(PropertyKey | undefined)[] | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<PropertyKey, number>>({});

  const cellsRef = useRef<Record<PropertyKey, HTMLElement>>({});
  const getCell = (columnId: PropertyKey): null | HTMLElement => cellsRef.current[columnId] ?? null;
  const setCell = (columnId: PropertyKey, node: null | HTMLElement) => {
    if (node) {
      cellsRef.current[columnId] = node;
    } else {
      delete cellsRef.current[columnId];
    }
  };

  // Update getContainer when deps change to trigger new observation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getContainer = useCallback(() => containerRef.current, [resizableColumns, visibleColumns, columnWidths]);

  // Measure wrapper width to determine if the last column can stretch.
  // When condition changes, updates the last column width style imperatively to avoid having a frame with improper style.
  const [containerWidth, setContainerWidth] = useState(0);
  useResizeObserver(getContainer, entry => {
    if (!resizableColumns) {
      return;
    }

    setContainerWidth(entry.contentBoxWidth);

    const lastColumnId = visibleColumns[visibleColumns.length - 1]?.id;
    const lastCellElement = lastColumnId ? cellsRef.current[lastColumnId] : null;
    if (!lastCellElement) {
      return;
    }

    const totalWidth = visibleColumns.reduce((total, { id }) => total + (columnWidths[id] || DEFAULT_COLUMN_WIDTH), 0);
    const stretchLastColumn = Boolean(entry.contentBoxWidth > totalWidth);

    if (stretchLastColumn && lastCellElement.style.width !== 'auto') {
      lastCellElement.style.width = 'auto';
    } else if (!stretchLastColumn && lastCellElement.style.width === 'auto') {
      lastCellElement.style.width = columnWidths[lastColumnId] + 'px';
    }
  });

  // The widths of the dynamically added columns (after the first render) if not set explicitly
  // will default to the DEFAULT_COLUMN_WIDTH.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    const updates: Record<PropertyKey, number> = {};
    const lastVisible = visibleColumnsRef.current;
    if (lastVisible) {
      for (let index = 0; index < visibleColumns.length; index++) {
        const column = visibleColumns[index];
        if (!columnWidths[column.id] && lastVisible.indexOf(column.id) === -1) {
          updates[column.id] = (column.width as number) || DEFAULT_COLUMN_WIDTH;
        }
      }
      if (Object.keys(updates).length > 0) {
        setColumnWidths(columnWidths => ({ ...columnWidths, ...updates }));
      }
    }
    visibleColumnsRef.current = visibleColumns.map(column => column.id);
  }, [columnWidths, resizableColumns, visibleColumns]);

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
    setColumnWidths(columnWidths => updateWidths(visibleColumns, columnWidths, newWidth, columnId));
  }

  const totalWidth = visibleColumns.reduce((total, { id }) => total + (columnWidths[id] || DEFAULT_COLUMN_WIDTH), 0);
  const stretchLastColumn = Boolean(containerWidth && containerWidth > totalWidth);

  return (
    <WidthsContext.Provider value={{ columnWidths, stretchLastColumn, updateColumn, setCell }}>
      {children}
    </WidthsContext.Provider>
  );
}

export function useColumnWidths() {
  return useContext(WidthsContext);
}
