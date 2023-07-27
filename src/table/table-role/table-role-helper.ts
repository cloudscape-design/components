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

export function assignTableProps(
  options: { tableRole: TableRole; ariaLabel?: string; totalItemsCount?: number },
  nativeProps: React.TableHTMLAttributes<HTMLTableElement> = {}
): React.TableHTMLAttributes<HTMLTableElement> {
  // Browsers have weird mechanism to guess whether it's a data table or a layout table.
  // If we state explicitly, they get it always correctly even with low number of rows.
  nativeProps.role = options.tableRole;

  nativeProps['aria-label'] = options.ariaLabel;

  // Incrementing the total count by one to account for the header row.
  nativeProps['aria-rowcount'] = options.totalItemsCount ? options.totalItemsCount + 1 : -1;

  return nativeProps;
}

export function assignTableRowProps(
  options: { tableRole: TableRole; rowIndex: number; firstIndex?: number },
  nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {}
): React.HTMLAttributes<HTMLTableRowElement> {
  if (options.tableRole === 'grid') {
    nativeProps.role = 'row';
  }

  if (options.firstIndex !== undefined) {
    nativeProps['aria-rowindex'] = options.firstIndex + options.rowIndex + 1;
  }

  return nativeProps;
}

export function assignTableColHeaderProps(
  options: { sortingStatus?: SortingStatus },
  nativeProps: React.ThHTMLAttributes<HTMLTableCellElement> = {}
): React.ThHTMLAttributes<HTMLTableCellElement> {
  nativeProps.scope = 'col';

  if (options.sortingStatus) {
    nativeProps['aria-sort'] = getAriaSort(options.sortingStatus);
  }

  return nativeProps;
}

export function assignTableRowHeaderProps(
  nativeProps: React.ThHTMLAttributes<HTMLTableCellElement> = {}
): React.ThHTMLAttributes<HTMLTableCellElement> {
  nativeProps.scope = 'row';

  return nativeProps;
}

export function assignTableCellProps(
  options: { tableRole: TableRole },
  nativeProps: React.TdHTMLAttributes<HTMLTableCellElement> = {}
): React.TdHTMLAttributes<HTMLTableCellElement> {
  if (options.tableRole === 'grid') {
    nativeProps.role = 'gridcell';
  }

  return nativeProps;
}
