// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useResizeObserver, useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import { setElementWidths, treatAsNumber } from './column-widths-utils';

export const DEFAULT_COLUMN_WIDTH = 120;

export interface ColumnWidthDefinition {
  id: PropertyKey;
  minWidth?: string | number;
  maxWidth?: string | number;
  width?: string | number;
}

function readWidth(
  getCell: (columnId: PropertyKey) => null | HTMLElement,
  column: ColumnWidthDefinition,
  isLastColumn: boolean
) {
  let width = (treatAsNumber(column.width) && (column.width as number)) || 0;
  const minWidth = (treatAsNumber(column.minWidth) && (column.minWidth as number)) || width || DEFAULT_COLUMN_WIDTH;
  // read width from the DOM if it is missing in the config
  if (!width && !isLastColumn) {
    const colEl = getCell(column.id);
    width = colEl ? getLogicalBoundingClientRect(colEl).inlineSize : DEFAULT_COLUMN_WIDTH;
  }
  return Math.max(width, minWidth);
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
  const visibleColumnsRef = useRef(new Set<PropertyKey>());
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

    if (resizableColumns && columnWidths && columnWidths.has(column.id)) {
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

  // Re-calculate widths of any "new" columns - either on first render, or dynamically added
  useEffect(() => {
    updateColumnWidths();

    if (!resizableColumns) {
      return;
    }
    let updated = false;
    const newColumnWidths = new Map(columnWidths);
    for (let index = 0; index < visibleColumns.length; index++) {
      const column = visibleColumns[index];
      if (!columnWidths?.get(column.id) && !visibleColumnsRef.current.has(column.id)) {
        updated = true;
        newColumnWidths.set(
          column.id,
          readWidth(getCell, column, index === visibleColumns.length - 1) || DEFAULT_COLUMN_WIDTH
        );
      }
    }
    if (updated) {
      setColumnWidths(newColumnWidths);
    }
    visibleColumnsRef.current = new Set(visibleColumns.map(column => column.id));
  }, [columnWidths, resizableColumns, visibleColumns, updateColumnWidths]);

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
