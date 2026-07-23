// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo, useState } from 'react';

import { TableProps } from './interfaces';
import { getTrackableValue } from './utils';

/**
 * WIP (AWSUI-56121): Bulk inline editing for Table.
 *
 * This hook is a v0 building block that layers a "bulk edit mode" on top of the
 * existing single-cell inline-edit (`editConfig`) machinery. Instead of editing
 * one cell at a time and committing immediately, the consumer can enter a mode
 * where several cells become editable at once, accumulate pending ("dirty")
 * changes, and commit them all together via a single callback.
 *
 * The hook is intentionally UI-agnostic: it only owns the mode + dirty-cell
 * state. Rendering of the editable cells is expected to reuse the existing
 * inline-editor pieces (`editConfig.editingCell`, `CellContext`).
 */

/** A composite key identifying a single cell by its (tracked) row id and column id. */
function toCellKey(rowId: string, columnId: string): string {
  // Row/column ids can contain arbitrary characters; the separator is escaped to
  // keep the composite key collision-free.
  return `${rowId.replace(/\|/g, '||')}|:|${columnId.replace(/\|/g, '||')}`;
}

interface UseBulkEditingProps<T> {
  items: ReadonlyArray<T>;
  trackBy?: TableProps.TrackBy<T>;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  bulkEdit?: TableProps.BulkEditConfig<T>;
}

export function useBulkEditing<T>({ items, trackBy, columnDefinitions, bulkEdit }: UseBulkEditingProps<T>) {
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Map of cellKey -> pending value. Only cells the user actually touched are stored.
  const [dirtyCells, setDirtyCells] = useState<Map<string, unknown>>(() => new Map());

  const enabled = !!bulkEdit;

  const getRowId = useCallback(
    (item: T, index: number): string => {
      // Without `trackBy` there is no stable identity, so fall back to the row index.
      if (!trackBy) {
        return String(index);
      }
      const tracked = getTrackableValue(trackBy, item);
      return tracked !== undefined && tracked !== null ? String(tracked) : String(index);
    },
    [trackBy]
  );

  const startBulkEdit = useCallback(() => {
    if (!enabled) {
      return;
    }
    setDirtyCells(new Map());
    setIsActive(true);
  }, [enabled]);

  const discardBulkEdit = useCallback(() => {
    setDirtyCells(new Map());
    setIsActive(false);
  }, []);

  const setCellValue = useCallback((rowId: string, columnId: string, value: unknown) => {
    setDirtyCells(prev => {
      const next = new Map(prev);
      next.set(toCellKey(rowId, columnId), value);
      return next;
    });
  }, []);

  const clearCellValue = useCallback((rowId: string, columnId: string) => {
    setDirtyCells(prev => {
      if (!prev.has(toCellKey(rowId, columnId))) {
        return prev;
      }
      const next = new Map(prev);
      next.delete(toCellKey(rowId, columnId));
      return next;
    });
  }, []);

  const getCellValue = useCallback(
    (rowId: string, columnId: string): { isDirty: boolean; value: unknown } => {
      const key = toCellKey(rowId, columnId);
      return { isDirty: dirtyCells.has(key), value: dirtyCells.get(key) };
    },
    [dirtyCells]
  );

  const dirtyCellCount = dirtyCells.size;
  const hasChanges = dirtyCellCount > 0;

  /**
   * Reconstructs the list of pending edits into a consumer-friendly shape,
   * resolving row ids and column ids back to the original item / column objects.
   */
  const collectChanges = useCallback((): Array<TableProps.BulkEditChange<T>> => {
    if (dirtyCells.size === 0) {
      return [];
    }
    const itemById = new Map<string, T>();
    items.forEach((item, index) => itemById.set(getRowId(item, index), item));
    const columnById = new Map<string, TableProps.ColumnDefinition<T>>();
    columnDefinitions.forEach((column, index) => columnById.set(column.id ?? String(index), column));

    const changes: Array<TableProps.BulkEditChange<T>> = [];
    dirtyCells.forEach((value, key) => {
      const [rawRow, rawColumn] = key.split('|:|');
      const rowId = rawRow.replace(/\|\|/g, '|');
      const columnId = rawColumn.replace(/\|\|/g, '|');
      const item = itemById.get(rowId);
      const column = columnById.get(columnId);
      if (item !== undefined && column !== undefined) {
        changes.push({ item, column, newValue: value });
      }
    });
    return changes;
  }, [dirtyCells, items, columnDefinitions, getRowId]);

  const submitBulkEdit = useCallback(async () => {
    if (!bulkEdit?.onSubmit) {
      discardBulkEdit();
      return;
    }
    const changes = collectChanges();
    setIsSubmitting(true);
    try {
      await bulkEdit.onSubmit({ changes });
      setDirtyCells(new Map());
      setIsActive(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [bulkEdit, collectChanges, discardBulkEdit]);

  return useMemo(
    () => ({
      enabled,
      isActive: enabled && isActive,
      isSubmitting,
      hasChanges,
      dirtyCellCount,
      getRowId,
      startBulkEdit,
      discardBulkEdit,
      submitBulkEdit,
      setCellValue,
      clearCellValue,
      getCellValue,
      collectChanges,
    }),
    [
      enabled,
      isActive,
      isSubmitting,
      hasChanges,
      dirtyCellCount,
      getRowId,
      startBulkEdit,
      discardBulkEdit,
      submitBulkEdit,
      setCellValue,
      clearCellValue,
      getCellValue,
      collectChanges,
    ]
  );
}
