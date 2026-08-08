// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { InternalContainerProps } from '../container/internal';
import { TableProps } from './interfaces';
import { StickyColumnsCellState } from './sticky-columns';

export const applyTrackBy = <T>(trackBy: TableProps.TrackBy<T>, item: T) => {
  if (typeof trackBy === 'function') {
    return trackBy(item);
  }
  return (item as any)[trackBy];
};

export const getItemKey = <T>(trackBy: TableProps.TrackBy<T> | undefined, item: T, index: number) => {
  if (!trackBy) {
    return index;
  }
  return applyTrackBy(trackBy, item);
};

export const getTrackableValue = <T>(trackBy: TableProps.TrackBy<T> | undefined, item: T) => {
  if (!trackBy) {
    return item;
  }
  return applyTrackBy(trackBy, item);
};

export const getColumnKey = <T>(column: TableProps.ColumnDefinition<T>, index: number) => {
  return column.id || index;
};

export const toContainerVariant = (variant: TableProps.Variant | undefined): InternalContainerProps['variant'] => {
  const isDefaultVariant = !variant || variant === 'container';
  return isDefaultVariant ? 'default' : variant === 'borderless' ? 'embedded' : variant;
};

export function checkSortingState<T>(
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>,
  sortingComparator: TableProps.SortingColumn<T>['sortingComparator']
) {
  const matchedColumn = columnDefinitions.filter(column => column.sortingComparator === sortingComparator)[0];
  if (!matchedColumn) {
    warnOnce(
      'Table',
      'Currently active sorting comparator was not found in any columns. Make sure to provide the same comparator function instance on each render.'
    );
  }
}

export function getVisibleColumnDefinitions<T>({
  columnDisplay,
  visibleColumns,
  columnDefinitions,
}: {
  columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>;
  visibleColumns?: ReadonlyArray<string>;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
}) {
  // columnsDisplay has a precedence over visibleColumns.
  if (columnDisplay) {
    return getVisibleColumnDefinitionsFromColumnDisplay({ columnDisplay, columnDefinitions });
  } else if (visibleColumns) {
    return getVisibleColumnDefinitionsFromVisibleColumns({ visibleColumns, columnDefinitions });
  } else {
    return columnDefinitions;
  }
}

function getVisibleColumnDefinitionsFromColumnDisplay<T>({
  columnDisplay,
  columnDefinitions,
}: {
  columnDisplay: ReadonlyArray<TableProps.ColumnDisplayProperties>;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
}) {
  const columnDefinitionsById: Record<string, TableProps.ColumnDefinition<T>> = columnDefinitions.reduce(
    (accumulator, item) => (item.id === undefined ? accumulator : { ...accumulator, [item.id]: item }),
    {}
  );
  // Build a map of persisted widths from columnDisplay entries.
  const persistedWidths = flattenColumnDisplayWidths(columnDisplay);
  const visibleIds = flattenVisibleColumnIds(columnDisplay);
  return visibleIds
    .map(id => {
      const colDef = columnDefinitionsById[id];
      if (!colDef) {
        return colDef;
      }
      const persistedWidth = persistedWidths.get(id);
      if (persistedWidth !== undefined) {
        return { ...colDef, width: persistedWidth };
      }
      return colDef;
    })
    .filter(Boolean);
}

function flattenColumnDisplayWidths(items: ReadonlyArray<TableProps.ColumnDisplayProperties>): Map<string, number> {
  const widths = new Map<string, number>();
  for (const item of items) {
    if (item.type === 'group') {
      for (const [id, width] of flattenColumnDisplayWidths(item.children)) {
        widths.set(id, width);
      }
    } else if (item.width !== undefined) {
      widths.set(item.id, item.width);
    }
  }
  return widths;
}

function getVisibleColumnDefinitionsFromVisibleColumns<T>({
  visibleColumns,
  columnDefinitions,
}: {
  visibleColumns: ReadonlyArray<string>;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
}) {
  const ids = new Set(visibleColumns);
  return columnDefinitions.filter(({ id }) => id !== undefined && ids.has(id));
}

export function getStickyClassNames(styles: Record<string, string>, props: StickyColumnsCellState | null) {
  return {
    [styles['sticky-cell']]: !!props,
    [styles['sticky-cell-pad-inline-start']]: !!props?.padInlineStart,
    [styles['sticky-cell-last-inline-start']]: !!props?.lastInsetInlineStart,
    [styles['sticky-cell-last-inline-end']]: !!props?.lastInsetInlineEnd,
  };
}

function flattenVisibleColumnIds(items: ReadonlyArray<TableProps.ColumnDisplayProperties>): string[] {
  const ids: string[] = [];
  for (const item of items) {
    if (item.type === 'group') {
      ids.push(...flattenVisibleColumnIds(item.children));
    } else if (item.visible) {
      ids.push(item.id);
    }
  }
  return ids;
}

/**
 * Merges a flat array of widths (indexed by columnDefinitions order) back into
 * the columnDisplay tree, so callers can persist the updated widths via preferences.
 */
export function applyWidthsToColumnDisplay<T>(
  columnDisplay: ReadonlyArray<TableProps.ColumnDisplayProperties>,
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>,
  widths: ReadonlyArray<number>
): ReadonlyArray<TableProps.ColumnDisplayProperties> {
  const widthById = new Map<string, number>();
  columnDefinitions.forEach((col, index) => {
    if (col.id !== undefined) {
      widthById.set(col.id, widths[index]);
    }
  });
  return applyWidthsToItems(columnDisplay, widthById);
}

function applyWidthsToItems(
  items: ReadonlyArray<TableProps.ColumnDisplayProperties>,
  widthById: Map<string, number>
): ReadonlyArray<TableProps.ColumnDisplayProperties> {
  return items.map(item => {
    if (item.type === 'group') {
      return { ...item, children: applyWidthsToItems(item.children, widthById) };
    }
    const width = widthById.get(item.id);
    return width !== undefined ? { ...item, width } : item;
  });
}
