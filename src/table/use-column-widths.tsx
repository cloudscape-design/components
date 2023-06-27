// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import headerCellStyles from './header-cell/styles.css.js';

export const DEFAULT_COLUMN_WIDTH = 120;

export interface ColumnWidthDefinition {
  id: PropertyKey;
  minWidth?: string | number;
  width?: string | number;
}

function readWidths(headerEl: HTMLElement, visibleColumns: readonly ColumnWidthDefinition[]) {
  const result: Record<PropertyKey, number> = {};
  for (let index = 0; index < visibleColumns.length; index++) {
    const column = visibleColumns[index];
    let width = (column.width as number) || 0;
    const minWidth = (column.minWidth as number) || width || DEFAULT_COLUMN_WIDTH;
    if (
      !width && // read width from the DOM if it is missing in the config
      index !== visibleColumns.length - 1 // skip reading for the last column, because it expands to fully fit the container
    ) {
      const colIndex = index + 1;
      const colEl = headerEl.querySelector<HTMLElement>(`.${headerCellStyles['header-cell']}:nth-child(${colIndex})`)!;
      width = colEl.getBoundingClientRect().width;
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
  totalWidth: number;
  columnWidths: Record<PropertyKey, number>;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
}

const WidthsContext = createContext<WidthsContext>({
  totalWidth: 0,
  columnWidths: {},
  updateColumn: () => {},
});

interface WidthProviderProps {
  tableRef: React.MutableRefObject<HTMLElement | null>;
  visibleColumns: readonly ColumnWidthDefinition[];
  resizableColumns: boolean | undefined;
  children: React.ReactNode;
}

export function ColumnWidthsProvider({ tableRef, visibleColumns, resizableColumns, children }: WidthProviderProps) {
  const visibleColumnsRef = useRef<(PropertyKey | undefined)[] | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<PropertyKey, number>>({});

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
    setColumnWidths(() => readWidths(tableRef.current!, visibleColumns));
    // This code is intended to run only at the first render and should not re-run when table props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateColumn(columnId: PropertyKey, newWidth: number) {
    setColumnWidths(columnWidths => updateWidths(visibleColumns, columnWidths, newWidth, columnId));
  }

  const totalWidth = visibleColumns.reduce(
    (total, column) => total + (columnWidths[column.id] || DEFAULT_COLUMN_WIDTH),
    0
  );

  return <WidthsContext.Provider value={{ columnWidths, totalWidth, updateColumn }}>{children}</WidthsContext.Provider>;
}

export function useColumnWidths() {
  return useContext(WidthsContext);
}
