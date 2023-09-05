// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../interfaces';

export type SortingStatus = 'sortable' | 'ascending' | 'descending';
const stateToIcon = {
  sortable: 'caret-down',
  ascending: 'caret-up-filled',
  descending: 'caret-down-filled',
} as const;

export const getSortingStatus = (
  sortable: boolean,
  sorted: boolean,
  descending: boolean,
  disabled: boolean
): SortingStatus | undefined => {
  if (sorted) {
    if (descending) {
      return 'descending';
    }
    return 'ascending';
  }
  if (sortable && !disabled) {
    return 'sortable';
  }
  return undefined;
};

export const getSortingIconName = (sortingState: SortingStatus) => stateToIcon[sortingState];
export const isSorted = <T>(column: TableProps.ColumnDefinition<T>, sortingColumn: TableProps.SortingColumn<T>) =>
  column === sortingColumn ||
  (column.sortingField !== undefined && column.sortingField === sortingColumn.sortingField) ||
  (column.sortingComparator !== undefined && column.sortingComparator === sortingColumn.sortingComparator);
