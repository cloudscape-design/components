// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableRole } from './interfaces';

type SortingStatus = 'sortable' | 'ascending' | 'descending';

const stateToAriaSort = {
  sortable: 'none',
  ascending: 'ascending',
  descending: 'descending',
} as const;
const getAriaSort = (sortingState: SortingStatus) => stateToAriaSort[sortingState];

// Depending on its content the table can have different semantic representation which includes the
// ARIA role of the table component ("table", "grid", "treegrid") but also roles and other semantic attributes
// of the child elements. The TableRole helper encapsulates table's semantic structure.

export function getTableRoleProps(options: {
  tableRole: TableRole;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  totalItemsCount?: number;
  totalColumnsCount?: number;
}): React.TableHTMLAttributes<HTMLTableElement> {
  const nativeProps: React.TableHTMLAttributes<HTMLTableElement> = {};

  // Browsers have weird mechanism to guess whether it's a data table or a layout table.
  // If we state explicitly, they get it always correctly even with low number of rows.
  nativeProps.role = options.tableRole === 'grid-default' ? 'grid' : options.tableRole;

  nativeProps['aria-label'] = options.ariaLabel;
  nativeProps['aria-labelledby'] = options.ariaLabelledBy;

  // Incrementing the total count by one to account for the header row.
  nativeProps['aria-rowcount'] = options.totalItemsCount ? options.totalItemsCount + 1 : -1;

  if (options.tableRole === 'grid' || options.tableRole === 'grid-default') {
    nativeProps['aria-colcount'] = options.totalColumnsCount;
  }

  // Make table component programmatically focusable to attach focusin/focusout for keyboard navigation.
  if (options.tableRole === 'grid' || options.tableRole === 'grid-default') {
    nativeProps.tabIndex = -1;
  }

  return nativeProps;
}

export function getTableWrapperRoleProps(options: { tableRole: TableRole; isScrollable: boolean; ariaLabel?: string }) {
  const nativeProps: React.HTMLAttributes<HTMLDivElement> = {};

  // When the table is scrollable, the wrapper is made focusable so that keyboard users can scroll it horizontally with arrow keys.
  if (options.isScrollable && options.tableRole !== 'grid' && options.tableRole !== 'grid-default') {
    nativeProps.role = 'region';
    nativeProps.tabIndex = 0;
    nativeProps['aria-label'] = options.ariaLabel;
  }

  return nativeProps;
}

export function getTableHeaderRowRoleProps(options: { tableRole: TableRole }) {
  const nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {};

  // For grids headers are treated similar to data rows and are indexed accordingly.
  if (options.tableRole === 'grid' || options.tableRole === 'grid-default') {
    nativeProps['aria-rowindex'] = 1;
  }

  return nativeProps;
}

export function getTableRowRoleProps(options: { tableRole: TableRole; rowIndex: number; firstIndex?: number }) {
  const nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {};

  // For grids data cell indices are incremented by 2 to account for the header cells.
  if (options.tableRole === 'grid' || options.tableRole === 'grid-default') {
    nativeProps['aria-rowindex'] = (options.firstIndex ?? 0) + options.rowIndex + 2;
  }
  // For tables indices are only added when the first index is not 0 (not the first page/frame).
  else if (options.firstIndex !== undefined) {
    nativeProps['aria-rowindex'] = (options.firstIndex ?? 0) + options.rowIndex + 1;
  }

  return nativeProps;
}

export function getTableColHeaderRoleProps(options: {
  tableRole: TableRole;
  colIndex: number;
  sortingStatus?: SortingStatus;
}) {
  const nativeProps: React.ThHTMLAttributes<HTMLTableCellElement> = {};

  nativeProps.scope = 'col';

  if (options.tableRole === 'grid' || options.tableRole === 'grid-default') {
    nativeProps['aria-colindex'] = options.colIndex + 1;
  }

  if (options.sortingStatus) {
    nativeProps['aria-sort'] = getAriaSort(options.sortingStatus);
  }

  return nativeProps;
}

export function getTableCellRoleProps(options: {
  tableRole: TableRole;
  colIndex: number;
  isRowHeader?: boolean;
  isWidget?: boolean;
}) {
  const nativeProps: React.TdHTMLAttributes<HTMLTableCellElement> & { 'data-widget-cell'?: boolean } = {};

  if (options.tableRole === 'grid' || options.tableRole === 'grid-default') {
    nativeProps['aria-colindex'] = options.colIndex + 1;
  }

  if (options.isRowHeader) {
    nativeProps.scope = 'row';
  }

  if (options.isWidget) {
    nativeProps['data-widget-cell'] = true;
  }

  return nativeProps;
}
