// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalContainerProps } from '../container/internal';
import { TableProps } from './interfaces';
import { warnOnce } from '../internal/logging';

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
  return isDefaultVariant ? 'default' : variant;
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
