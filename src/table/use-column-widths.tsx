// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { TableProps } from './interfaces';
import { getColumnKey } from './utils';
import headerCellStyles from './header-cell/styles.css.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export const DEFAULT_WIDTH = 120;
const SELECTION_CELL_WIDTH = 54;

function checkProperty(column: TableProps.ColumnDefinition<any>, name: 'width' | 'minWidth') {
  const value = column[name];
  if (typeof value !== 'number' && typeof value !== 'undefined') {
    warnOnce(
      'Table',
      `resizableColumns feature requires ${name} property to be a number, got ${value}. The component may work incorrectly.`
    );
  }
}

export function checkColumnWidths(columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>) {
  for (const column of columnDefinitions) {
    checkProperty(column, 'minWidth');
    checkProperty(column, 'width');
  }
}

function readWidths(
  headerEl: HTMLElement,
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>,
  hasSelection: boolean
) {
  const result: Record<string, number> = {};
  for (let index = 0; index < columnDefinitions.length; index++) {
    const column = columnDefinitions[index];
    const id = getColumnKey(columnDefinitions[index], index);
    let width = (column.width as number) || 0;
    const minWidth = (column.minWidth as number) || width || DEFAULT_WIDTH;
    if (
      !width && // read width from the DOM if it is missing in the config
      index !== columnDefinitions.length - 1 // skip reading for the last column, because it expands to fully fit the container
    ) {
      const colIndex = hasSelection ? index + 2 : index + 1;
      const colEl = headerEl.querySelector<HTMLElement>(`.${headerCellStyles['header-cell']}:nth-child(${colIndex})`)!;
      width = colEl.getBoundingClientRect().width;
    }
    result[id] = Math.max(width, minWidth);
  }
  return result;
}

function updateWidths(
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>,
  oldWidths: Record<string, number>,
  newWidth: number,
  colIndex: number
) {
  const definition = columnDefinitions[colIndex];
  const id = getColumnKey(definition, colIndex);
  const minWidth = typeof definition.minWidth === 'number' ? definition.minWidth : DEFAULT_WIDTH;
  newWidth = Math.max(newWidth, minWidth);
  if (oldWidths[id] === newWidth) {
    return oldWidths;
  }
  return { ...oldWidths, [id]: newWidth };
}

interface WidthsContext {
  totalWidth: number;
  columnWidths: Record<string, number>;
  updateColumn: (colIndex: number, newWidth: number) => void;
}

const WidthsContext = createContext<WidthsContext>({
  totalWidth: 0,
  columnWidths: {},
  updateColumn: () => {},
});

interface WidthProviderProps {
  tableRef: React.MutableRefObject<HTMLElement | null>;
  visibleColumnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>;
  resizableColumns: boolean | undefined;
  hasSelection: boolean;
  children: React.ReactNode;
}

export function ColumnWidthsProvider({
  tableRef,
  visibleColumnDefinitions,
  resizableColumns,
  hasSelection,
  children,
}: WidthProviderProps) {
  const visibleColumns = useRef<(string | undefined)[] | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    const lastVisible = visibleColumns.current;
    if (lastVisible) {
      for (let index = 0; index < visibleColumnDefinitions.length; index++) {
        const column = visibleColumnDefinitions[index];
        const id = getColumnKey(column, index);
        if (!columnWidths[id] && lastVisible.indexOf(column.id) === -1) {
          setColumnWidths(columnWidths => ({ ...columnWidths, [id]: (column.width as number) || DEFAULT_WIDTH }));
        }
      }
    }
    visibleColumns.current = visibleColumnDefinitions.map(column => column.id);
  }, [columnWidths, resizableColumns, visibleColumnDefinitions]);

  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    setColumnWidths(() => readWidths(tableRef.current!, visibleColumnDefinitions, hasSelection));
    // This code is intended to run only at the first render and should not re-run when table props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateColumn(colIndex: number, newWidth: number) {
    setColumnWidths(columnWidths => updateWidths(visibleColumnDefinitions, columnWidths, newWidth, colIndex));
  }

  let totalWidth = visibleColumnDefinitions.reduce(
    (total, column, index) => total + (columnWidths[getColumnKey(column, index)] || DEFAULT_WIDTH),
    0
  );
  if (hasSelection) {
    totalWidth += SELECTION_CELL_WIDTH;
  }

  return <WidthsContext.Provider value={{ columnWidths, totalWidth, updateColumn }}>{children}</WidthsContext.Provider>;
}

export function useColumnWidths() {
  return useContext(WidthsContext);
}
