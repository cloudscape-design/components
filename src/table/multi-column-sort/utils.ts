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

/**
 * Best-effort text label for a sorted column. `column.header` is a ReactNode, so we can only use it
 * directly when it is a string; otherwise we fall back to the sorting field or column id.
 */
function getColumnLabel<T>(
  column: TableProps.ColumnDefinition<T> | undefined,
  sortingColumn: TableProps.SortingColumn<T>
): string {
  if (column && typeof column.header === 'string') {
    return column.header;
  }
  return sortingColumn.sortingField ?? String(column?.id ?? '');
}

/**
 * Builds a screen-reader announcement for the current multi-column sort state by joining per-column
 * fragments in code (charts-style). The fragment renderers are resolved from i18n by the caller;
 * returns an empty string when the relevant renderers are unavailable so no announcement is made.
 */
export function buildSortLiveAnnouncement<T>({
  sortingColumns = [],
  columnDefinitions,
  renderSortColumn,
  renderSortOrder,
  sortCleared,
  formatList,
  resolveColumnLabel,
}: {
  sortingColumns?: ReadonlyArray<TableProps.SortingState<T>>;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  renderSortColumn?: (data: { columnLabel: string; isDescending: boolean }) => string;
  renderSortOrder?: (data: { columns: string }) => string;
  sortCleared?: string;
  formatList?: (parts: readonly string[]) => string;
  resolveColumnLabel?: (column: TableProps.ColumnDefinition<T> | undefined) => string | undefined;
}): string {
  if (sortingColumns.length === 0) {
    return sortCleared ?? '';
  }
  if (!renderSortColumn || !renderSortOrder) {
    return '';
  }
  const parts = sortingColumns.map(({ sortingColumn, isDescending }) => {
    const column = columnDefinitions.find(candidate => matchesColumn(sortingColumn, candidate));
    // Prefer the rendered (localized) header text supplied by the caller; fall back to a best-effort
    // label derived from the column definition when it is unavailable (e.g. no id, or server-side render).
    const columnLabel = resolveColumnLabel?.(column) || getColumnLabel(column, sortingColumn);
    return renderSortColumn({ columnLabel, isDescending: !!isDescending });
  });
  const columns = formatList ? formatList(parts) : parts.join(', ');
  return renderSortOrder({ columns });
}
