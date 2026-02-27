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
  ariaLabelledby?: string;
  totalItemsCount?: number;
  totalColumnsCount?: number;
  headerRowCount?: number;
}): React.TableHTMLAttributes<HTMLTableElement> {
  const nativeProps: React.TableHTMLAttributes<HTMLTableElement> = {};

  // Browsers have weird mechanism to guess whether it's a data table or a layout table.
  // If we state explicitly, they get it always correctly even with low number of rows.
  nativeProps.role = options.tableRole === 'grid-default' ? 'grid' : options.tableRole;

  nativeProps['aria-label'] = options.ariaLabel;
  nativeProps['aria-labelledby'] = options.ariaLabelledby;

  // Incrementing the total count to account for the header row(s).
  const headerRows = options.headerRowCount ?? 1;
  if (typeof options.totalItemsCount === 'number' && options.totalItemsCount > 0) {
    nativeProps['aria-rowcount'] = options.totalItemsCount + headerRows;
  }

  if (options.tableRole === 'grid' || options.tableRole === 'treegrid') {
    nativeProps['aria-colcount'] = options.totalColumnsCount;
  }

  // Make table component programmatically focusable to attach focusin/focusout for keyboard navigation.
  if (options.tableRole === 'grid' || options.tableRole === 'treegrid') {
    nativeProps.tabIndex = -1;
  }

  return nativeProps;
}

export function getTableWrapperRoleProps(options: {
  tableRole: TableRole;
  isScrollable: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
}) {
  const nativeProps: React.HTMLAttributes<HTMLDivElement> = {};

  // When the table is scrollable, the wrapper is made focusable so that keyboard users can scroll it horizontally with arrow keys.
  if (options.isScrollable) {
    nativeProps.role = 'region';
    nativeProps.tabIndex = 0;
    nativeProps['aria-label'] = options.ariaLabel;
    nativeProps['aria-labelledby'] = options.ariaLabelledby;
  }

  return nativeProps;
}

export function getTableHeaderRowRoleProps(options: { tableRole: TableRole; rowIndex?: number }) {
  const nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {};

  // For grids headers are treated similar to data rows and are indexed accordingly.
  // With grouped columns there can be multiple header rows (rowIndex 0, 1, 2, ...).
  if (options.tableRole === 'grid' || options.tableRole === 'grid-default' || options.tableRole === 'treegrid') {
    nativeProps['aria-rowindex'] = (options.rowIndex ?? 0) + 1;
  }

  return nativeProps;
}

export function getTableRowRoleProps(options: {
  tableRole: TableRole;
  rowIndex: number;
  firstIndex?: number;
  headerRowCount?: number;
  level?: number;
  setSize?: number;
  posInSet?: number;
}) {
  const nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {};

  // The data cell indices are incremented by headerRowCount to account for the header row(s).
  const headerRows = options.headerRowCount ?? 1;
  if (options.tableRole === 'grid' || options.tableRole === 'treegrid') {
    nativeProps['aria-rowindex'] = (options.firstIndex || 1) + options.rowIndex + headerRows;
  }
  // For tables indices are only added when the first index is not 0 (not the first page/frame).
  else if (options.firstIndex !== undefined) {
    nativeProps['aria-rowindex'] = options.firstIndex + options.rowIndex + headerRows;
  }
  if (options.tableRole === 'treegrid' && options.level && options.level !== 0) {
    nativeProps['aria-level'] = options.level;
  }
  if (options.tableRole === 'treegrid' && options.setSize) {
    nativeProps['aria-setsize'] = options.setSize;
  }
  if (options.tableRole === 'treegrid' && options.posInSet) {
    nativeProps['aria-posinset'] = options.posInSet;
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

  if (options.tableRole === 'grid' || options.tableRole === 'treegrid') {
    nativeProps['aria-colindex'] = options.colIndex + 1;
  }

  if (options.sortingStatus) {
    nativeProps['aria-sort'] = getAriaSort(options.sortingStatus);
  }

  return nativeProps;
}

export function getTableCellRoleProps(options: { tableRole: TableRole; colIndex: number; isRowHeader?: boolean }) {
  const nativeProps: React.TdHTMLAttributes<HTMLTableCellElement> = {};

  if (options.tableRole === 'grid' || options.tableRole === 'treegrid') {
    nativeProps['aria-colindex'] = options.colIndex + 1;
  }

  if (options.isRowHeader) {
    nativeProps.scope = 'row';
  }

  return nativeProps;
}
