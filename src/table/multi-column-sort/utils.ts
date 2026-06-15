// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../interfaces';

/**
 * Returns the 1-based sort priority index of `column` in the sort array, or null if not present.
 */
export function getSortIndex<T>(
  sortingColumns: ReadonlyArray<TableProps.SortingState<T>>,
  column: TableProps.ColumnDefinition<T>
): number | null {
  const idx = sortingColumns.findIndex(entry => matchesColumn(entry.sortingColumn, column));
  return idx === -1 ? null : idx + 1;
}

/**
 * Replace the entire sort state with a single column.
 */
export function replaceSort<T>(
  column: TableProps.ColumnDefinition<T>,
  isDescending: boolean
): ReadonlyArray<TableProps.SortingState<T>> {
  return [{ sortingColumn: column, isDescending }];
}

/**
 * Append a column at the end of the current sort.
 */
export function appendSort<T>(
  current: ReadonlyArray<TableProps.SortingState<T>>,
  column: TableProps.ColumnDefinition<T>,
  isDescending: boolean
): ReadonlyArray<TableProps.SortingState<T>> {
  return [...current, { sortingColumn: column, isDescending }];
}

/**
 * Toggle the direction of a column already in the sort, keeping its position.
 */
export function toggleDirection<T>(
  current: ReadonlyArray<TableProps.SortingState<T>>,
  column: TableProps.ColumnDefinition<T>
): ReadonlyArray<TableProps.SortingState<T>> {
  return current.map(entry =>
    matchesColumn(entry.sortingColumn, column) ? { ...entry, isDescending: !entry.isDescending } : entry
  );
}

/**
 * Set the direction of a column already in the sort to a specific value, keeping its position.
 */
export function setDirection<T>(
  current: ReadonlyArray<TableProps.SortingState<T>>,
  column: TableProps.ColumnDefinition<T>,
  isDescending: boolean
): ReadonlyArray<TableProps.SortingState<T>> {
  return current.map(entry => (matchesColumn(entry.sortingColumn, column) ? { ...entry, isDescending } : entry));
}

/**
 * Remove a column from the sort and reindex remaining priorities.
 */
export function removeSort<T>(
  current: ReadonlyArray<TableProps.SortingState<T>>,
  column: TableProps.ColumnDefinition<T>
): ReadonlyArray<TableProps.SortingState<T>> {
  return current.filter(entry => !matchesColumn(entry.sortingColumn, column));
}

function matchesColumn<T>(sortingColumn: TableProps.SortingColumn<T>, column: TableProps.ColumnDefinition<T>): boolean {
  return (
    column === sortingColumn ||
    (column.sortingField !== undefined && column.sortingField === sortingColumn.sortingField) ||
    (column.sortingComparator !== undefined && column.sortingComparator === sortingColumn.sortingComparator)
  );
}
