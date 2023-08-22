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
  nativeProps.role = isGrid(options) ? 'grid' : 'table';

  nativeProps['aria-label'] = options.ariaLabel;
  nativeProps['aria-labelledby'] = options.ariaLabelledBy;

  // Incrementing the total count by one to account for the header row.
  nativeProps['aria-rowcount'] = options.totalItemsCount ? options.totalItemsCount + 1 : -1;

  if (isGrid(options)) {
    nativeProps['aria-colcount'] = options.totalColumnsCount;
  }

  // Make table component programmatically focusable to attach focusin/focusout for keyboard navigation.
  if (isGrid(options)) {
    nativeProps.tabIndex = -1;
  }

  return nativeProps;
}

export function getTableWrapperRoleProps(options: { tableRole: TableRole; isScrollable: boolean; ariaLabel?: string }) {
  const nativeProps: React.HTMLAttributes<HTMLDivElement> = {};

  // When the table is scrollable, the wrapper is made focusable so that keyboard users can scroll it horizontally with arrow keys.
  if (options.isScrollable && !isGrid(options)) {
    nativeProps.role = 'region';
    nativeProps.tabIndex = 0;
    nativeProps['aria-label'] = options.ariaLabel;
  }

  return nativeProps;
}

export function getTableHeaderRowRoleProps(options: { tableRole: TableRole }) {
  const nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {};

  // For grids headers are treated similar to data rows and are indexed accordingly.
  if (isGrid(options)) {
    nativeProps['aria-rowindex'] = 1;
  }

  return nativeProps;
}

export function getTableRowRoleProps(options: { tableRole: TableRole; rowIndex: number; firstIndex?: number }) {
  const nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {};

  // The data cell indices are incremented by 1 to account for the header cells.
  if (isGrid(options)) {
    nativeProps['aria-rowindex'] = (options.firstIndex || 1) + options.rowIndex + 1;
  }
  // For tables indices are only added when the first index is not 0 (not the first page/frame).
  else if (options.firstIndex) {
    nativeProps['aria-rowindex'] = options.firstIndex + options.rowIndex + 1;
  }

  return nativeProps;
}

export function getTableColHeaderRoleProps(options: {
  tableRole: TableRole;
  colIndex: number;
  sortingStatus?: SortingStatus;
  isWidget?: boolean;
}) {
  const nativeProps: React.ThHTMLAttributes<HTMLTableCellElement> & { 'data-widget-cell'?: boolean } = {};

  nativeProps.scope = 'col';

  if (isGrid(options)) {
    nativeProps['aria-colindex'] = options.colIndex + 1;
  }

  if (options.sortingStatus) {
    nativeProps['aria-sort'] = getAriaSort(options.sortingStatus);
  }

  if (isGrid(options) && options.isWidget) {
    nativeProps['data-widget-cell'] = true;
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

  if (isGrid(options)) {
    nativeProps['aria-colindex'] = options.colIndex + 1;
  }

  if (options.isRowHeader) {
    nativeProps.scope = 'row';
  }

  if (isGrid(options) && options.isWidget) {
    nativeProps['data-widget-cell'] = true;
  }

  return nativeProps;
}

function isGrid(options: { tableRole: TableRole }) {
  return options.tableRole === 'grid' || options.tableRole === 'grid-default';
}
