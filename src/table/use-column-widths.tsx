// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useResizeObserver, useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import { TableGroupedTypes } from './column-grouping-utils';
import { ColumnWidthStyle, setElementWidths } from './column-widths-utils';

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
  hierarchicalStructure: TableGroupedTypes.HierarchicalStructure<any>;
}

export function ColumnWidthsProvider({
  visibleColumns,
  resizableColumns,
  containerRef,
  hierarchicalStructure,
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

  // Precompute group → rightmost leaf mapping to avoid hierarchy traversal on every resize.
  const groupRightmostLeafRef = useRef(new Map<string, string>());
  const groupLeafIdsRef = useRef(new Map<string, string[]>());

  useEffect(() => {
    if (!hierarchicalStructure || hierarchicalStructure.rows.length <= 1) {
      groupRightmostLeafRef.current.clear();
      groupLeafIdsRef.current.clear();
      return;
    }
    const leafMap = new Map<string, string>();
    const leafIdsMap = new Map<string, string[]>();
    const leafRow = hierarchicalStructure.rows[hierarchicalStructure.rows.length - 1];

    for (const row of hierarchicalStructure.rows) {
      for (const col of row.columns) {
        if (col.isGroup) {
          const leafIds: string[] = [];
          for (const leafCol of leafRow.columns) {
            if (!leafCol.isGroup && leafCol.parentGroupIds.includes(col.id)) {
              leafIds.push(leafCol.id);
            }
          }
          leafIdsMap.set(col.id, leafIds);
          if (leafIds.length > 0) {
            leafMap.set(col.id, leafIds[leafIds.length - 1]);
          }
        }
      }
    }
    groupRightmostLeafRef.current = leafMap;
    groupLeafIdsRef.current = leafIdsMap;
  }, [hierarchicalStructure]);

  const getColumnStyles = (sticky: boolean, columnId: PropertyKey): ColumnWidthStyle => {
    const column = visibleColumns.find(column => column.id === columnId);
    if (!column) {
      return {};
    }

    if (sticky) {
      return {
        width:
          cellsRef.current.get(column.id)?.getBoundingClientRect().width ||
          (columnWidths?.get(column.id) ?? column.width),
      };
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
    if (!columnWidths) {
      return;
    }

    // When col elements exist (grouped columns), apply widths to <col> elements.
    // With table-layout:fixed, <col> widths control the actual column widths.
    if (hasColElements.current) {
      for (const { id } of visibleColumns) {
        const colElement = colsRef.current.get(id);
        if (colElement) {
          const styles = getColumnStyles(false, id);
          setElementWidths(colElement, styles);
        }
        // Still update th cells for non-width styles (but width comes from col)
        const element = cellsRef.current.get(id);
        if (element) {
          setElementWidths(element, getColumnStyles(false, id));
        }
      }
    } else {
      // No col elements - apply widths directly to th cells (single-row headers)
      for (const { id } of visibleColumns) {
        const element = cellsRef.current.get(id);
        if (element) {
          setElementWidths(element, getColumnStyles(false, id));
        }
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

  function updateGroup(groupId: PropertyKey, newGroupWidth: number) {
    if (!columnWidths) {
      return;
    }

    // Use precomputed rightmost leaf (avoids hierarchy traversal on every drag)
    const rightmostLeaf = groupRightmostLeafRef.current.get(String(groupId));
    if (!rightmostLeaf) {
      return;
    }

    // Calculate current group width from precomputed leaf IDs
    const leafIds = groupLeafIdsRef.current.get(String(groupId)) ?? [];
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

export function useColumnWidths() {
  return useContext(WidthsContext);
}
