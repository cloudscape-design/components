// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

interface TableRoleOptions {
  tableRole: 'table' | 'grid';
  totalItemsCount?: number;
  ariaLabel?: string;
}

export function createTableRoleProps({
  tableRole,
  totalItemsCount,
  ariaLabel,
}: TableRoleOptions): React.TableHTMLAttributes<HTMLTableElement> {
  return {
    // Browsers have weird mechanism to guess whether it's a data table or a layout table.
    // If we state explicitly, they get it always correctly even with low number of rows.
    role: tableRole,
    // Incrementing the total count by one to account for the header row.
    'aria-rowcount': totalItemsCount ? totalItemsCount + 1 : -1,
    'aria-label': ariaLabel,
  };
}

interface TableRowRoleOptions {
  tableRole: 'table' | 'grid';
  rowIndex: number;
  firstIndex?: number;
}

export function createTableRowRoleProps({
  tableRole,
  rowIndex,
  firstIndex,
}: TableRowRoleOptions): React.HTMLAttributes<HTMLTableRowElement> {
  return {
    role: tableRole === 'table' ? undefined : 'row',
    'aria-rowindex': firstIndex ? firstIndex + rowIndex + 1 : undefined,
  };
}

type SortingStatus = 'sortable' | 'ascending' | 'descending';

interface TableColHeaderRoleOptions {
  sortingStatus?: SortingStatus;
}

const stateToAriaSort = {
  sortable: 'none',
  ascending: 'ascending',
  descending: 'descending',
} as const;

const getAriaSort = (sortingState: SortingStatus) => stateToAriaSort[sortingState];

export function createTableColHeaderRoleProps({
  sortingStatus,
}: TableColHeaderRoleOptions): React.ThHTMLAttributes<HTMLTableCellElement> {
  return { scope: 'col', 'aria-sort': sortingStatus ? getAriaSort(sortingStatus) : undefined };
}

export function createTableRowHeaderRoleProps(): React.ThHTMLAttributes<HTMLTableCellElement> {
  return { scope: 'row' };
}

interface TableCellRoleOptions {
  tableRole: 'table' | 'grid';
}

export function createTableCellRoleProps({
  tableRole,
}: TableCellRoleOptions): React.TdHTMLAttributes<HTMLTableCellElement> {
  return tableRole === 'table' ? {} : { role: 'gridcell' };
}
