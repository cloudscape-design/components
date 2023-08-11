// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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

export type TableRole = 'table' | 'grid';

export function getTableRoleProps(options: {
  tableRole: TableRole;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  totalItemsCount?: number;
}): React.TableHTMLAttributes<HTMLTableElement> {
  const nativeProps: React.TableHTMLAttributes<HTMLTableElement> = {};

  // Browsers have weird mechanism to guess whether it's a data table or a layout table.
  // If we state explicitly, they get it always correctly even with low number of rows.
  nativeProps.role = options.tableRole;

  nativeProps['aria-label'] = options.ariaLabel;
  nativeProps['aria-labelledby'] = options.ariaLabelledBy;

  // Incrementing the total count by one to account for the header row.
  nativeProps['aria-rowcount'] = options.totalItemsCount ? options.totalItemsCount + 1 : -1;

  return nativeProps;
}

export function getTableRowRoleProps(options: {
  tableRole: TableRole;
  rowIndex: number;
  firstIndex?: number;
}): React.HTMLAttributes<HTMLTableRowElement> {
  const nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {};

  if (options.tableRole === 'grid') {
    nativeProps.role = 'row';
  }

  if (options.firstIndex !== undefined) {
    nativeProps['aria-rowindex'] = options.firstIndex + options.rowIndex + 1;
  }

  return nativeProps;
}

export function getTableColHeaderRoleProps(options: {
  sortingStatus?: SortingStatus;
}): React.ThHTMLAttributes<HTMLTableCellElement> {
  const nativeProps: React.ThHTMLAttributes<HTMLTableCellElement> = {};

  nativeProps.scope = 'col';

  if (options.sortingStatus) {
    nativeProps['aria-sort'] = getAriaSort(options.sortingStatus);
  }

  return nativeProps;
}

export function getTableCellRoleProps(options: {
  tableRole: TableRole;
  isRowHeader?: boolean;
}): React.TdHTMLAttributes<HTMLTableCellElement> {
  const nativeProps: React.TdHTMLAttributes<HTMLTableCellElement> = {};

  if (options.tableRole === 'grid') {
    nativeProps.role = 'gridcell';
  }

  if (options.isRowHeader) {
    nativeProps.scope = 'row';
  }

  return nativeProps;
}
