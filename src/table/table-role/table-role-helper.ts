// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

type SortingStatus = 'sortable' | 'ascending' | 'descending';

const stateToAriaSort = {
  sortable: 'none',
  ascending: 'ascending',
  descending: 'descending',
} as const;
const getAriaSort = (sortingState: SortingStatus) => stateToAriaSort[sortingState];

/**
 * Depending on its content the table can have different semantic representation which includes the
 * ARIA role of the table component ("table", "grid", "treegrid") but also roles and other semantic attributes
 * of the child elements. The TableRole helper encapsulates table's semantic structure.
 */
export class TableRole {
  private tableRole: 'table' | 'grid';

  constructor(tableRole: 'table' | 'grid') {
    this.tableRole = tableRole;
  }

  assignTableProps(
    {
      ariaLabel,
      totalItemsCount,
    }: {
      ariaLabel?: string;
      totalItemsCount?: number;
    },
    nativeProps: React.TableHTMLAttributes<HTMLTableElement> = {}
  ) {
    // Browsers have weird mechanism to guess whether it's a data table or a layout table.
    // If we state explicitly, they get it always correctly even with low number of rows.
    nativeProps.role = this.tableRole;

    nativeProps['aria-label'] = ariaLabel;

    // Incrementing the total count by one to account for the header row.
    nativeProps['aria-rowcount'] = totalItemsCount ? totalItemsCount + 1 : -1;

    return nativeProps;
  }

  assignTableRowProps(
    {
      rowIndex,
      firstIndex,
    }: {
      rowIndex: number;
      firstIndex?: number;
    },
    nativeProps: React.HTMLAttributes<HTMLTableRowElement> = {}
  ) {
    if (this.tableRole === 'grid') {
      nativeProps.role = 'row';
    }

    if (firstIndex !== undefined) {
      nativeProps['aria-rowindex'] = firstIndex + rowIndex + 1;
    }

    return nativeProps;
  }

  assignTableColHeaderProps(
    {
      sortingStatus,
    }: {
      sortingStatus?: SortingStatus;
    },
    nativeProps: React.ThHTMLAttributes<HTMLTableCellElement> = {}
  ) {
    nativeProps.scope = 'col';

    if (sortingStatus) {
      nativeProps['aria-sort'] = getAriaSort(sortingStatus);
    }

    return nativeProps;
  }

  assignTableRowHeaderProps(nativeProps: React.ThHTMLAttributes<HTMLTableCellElement> = {}) {
    nativeProps.scope = 'row';

    return nativeProps;
  }

  assignTableCellProps(nativeProps: React.TdHTMLAttributes<HTMLTableCellElement> = {}) {
    if (this.tableRole === 'grid') {
      nativeProps.role = 'gridcell';
    }

    return nativeProps;
  }
}
