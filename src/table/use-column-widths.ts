// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import AsyncStore from '../area-chart/async-store';

export const DEFAULT_COLUMN_WIDTH = 120;

export interface ColumnWidthDefinition {
  id: PropertyKey;
  minWidth?: string | number;
  width?: string | number;
}

interface ColumnWidthsState {
  visibleColumns: readonly ColumnWidthDefinition[];
  columnWidths: Record<PropertyKey, number>;
  totalWidth: number;
}

interface ColumnWidthsProps {
  visibleColumns: readonly ColumnWidthDefinition[];
  resizableColumns: boolean | undefined;
}

export interface ColumnWidthsModel extends AsyncStore<ColumnWidthsState> {
  updateColumnWidth(columnId: PropertyKey, newWidth: number): void;
  setCell(columnId: PropertyKey, node: null | HTMLElement): void;
}

export function useColumnWidths({ visibleColumns, resizableColumns }: ColumnWidthsProps): ColumnWidthsModel {
  const store = useMemo(() => new ColumnWidthsStore(), []);

  // The widths of the dynamically added columns (after the first render) if not set explicitly
  // will default to the DEFAULT_COLUMN_WIDTH.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    store.syncWidths(visibleColumns);
  }, [store, resizableColumns, visibleColumns]);

  // Read the actual column widths after the first render to employ the browser defaults for
  // those columns without explicit width.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    store.initWidths(visibleColumns);
    // This code is intended to run only at the first render and should not re-run when table props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
}

class ColumnWidthsStore extends AsyncStore<ColumnWidthsState> {
  private cells: Record<PropertyKey, HTMLElement> = {};
  private lastVisible: null | (PropertyKey | undefined)[] = null;

  constructor() {
    super({ visibleColumns: [], columnWidths: {}, totalWidth: 0 });
  }

  initWidths = (visibleColumns: readonly ColumnWidthDefinition[]) => {
    const getCell = (columnId: PropertyKey): null | HTMLElement => this.cells[columnId] ?? null;
    const columnWidths = readWidths(visibleColumns, getCell);
    const totalWidth = getTotalWidth(visibleColumns, columnWidths);
    this.set(() => ({ visibleColumns, columnWidths, totalWidth }));
  };

  syncWidths = (visibleColumns: readonly ColumnWidthDefinition[]) => {
    const updates: Record<PropertyKey, number> = {};
    if (this.lastVisible) {
      for (let index = 0; index < visibleColumns.length; index++) {
        const column = visibleColumns[index];
        if (!this.get().columnWidths[column.id] && this.lastVisible.indexOf(column.id) === -1) {
          updates[column.id] = (column.width as number) || DEFAULT_COLUMN_WIDTH;
        }
      }
      if (Object.keys(updates).length > 0) {
        this.set(prev => {
          const columnWidths = { ...prev.columnWidths, ...updates };
          const totalWidth = getTotalWidth(visibleColumns, columnWidths);
          return { visibleColumns, columnWidths, totalWidth };
        });
      }
      this.lastVisible = visibleColumns.map(column => column.id);
    }
  };

  updateColumnWidth = (columnId: PropertyKey, newWidth: number) => {
    this.set(state => {
      const column = state.visibleColumns.find(column => column.id === columnId);
      const minWidth = typeof column?.minWidth === 'number' ? column.minWidth : DEFAULT_COLUMN_WIDTH;
      newWidth = Math.max(newWidth, minWidth);
      if (state.columnWidths[columnId] === newWidth) {
        return state;
      }
      const columnWidths = { ...state.columnWidths, [columnId]: newWidth };
      const totalWidth = getTotalWidth(state.visibleColumns, columnWidths);
      return { ...state, columnWidths, totalWidth };
    });
  };

  setCell = (columnId: PropertyKey, node: null | HTMLElement) => {
    if (node) {
      this.cells[columnId] = node;
    } else {
      delete this.cells[columnId];
    }
  };
}

function readWidths(
  visibleColumns: readonly ColumnWidthDefinition[],
  getCell: (columnId: PropertyKey) => null | HTMLElement
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

function getTotalWidth(visibleColumns: readonly ColumnWidthDefinition[], columnWidths: Record<PropertyKey, number>) {
  return visibleColumns.reduce((total, column) => total + (columnWidths[column.id] || DEFAULT_COLUMN_WIDTH), 0);
}
