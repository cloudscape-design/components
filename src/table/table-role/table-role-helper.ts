// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

type SortingStatus = 'sortable' | 'ascending' | 'descending';

const stateToAriaSort = {
  sortable: 'none',
  ascending: 'ascending',
  descending: 'descending',
} as const;
const getAriaSort = (sortingState: SortingStatus) => stateToAriaSort[sortingState];

export class TableRole {
  private tableRole: 'table' | 'grid';

  constructor(tableRole: 'table' | 'grid') {
    this.tableRole = tableRole;
  }

  getTableProps({
    ariaLabel,
    totalItemsCount,
  }: {
    ariaLabel?: string;
    totalItemsCount?: number;
  }): React.TableHTMLAttributes<HTMLTableElement> {
    return {
      // Browsers have weird mechanism to guess whether it's a data table or a layout table.
      // If we state explicitly, they get it always correctly even with low number of rows.
      role: this.tableRole,
      // Incrementing the total count by one to account for the header row.
      'aria-rowcount': totalItemsCount ? totalItemsCount + 1 : -1,
      'aria-label': ariaLabel,
    };
  }

  getTableRowProps({
    rowIndex,
    firstIndex,
  }: {
    rowIndex: number;
    firstIndex?: number;
  }): React.HTMLAttributes<HTMLTableRowElement> {
    return {
      role: this.tableRole === 'table' ? undefined : 'row',
      'aria-rowindex': firstIndex ? firstIndex + rowIndex + 1 : undefined,
    };
  }

  getTableColHeaderProps({
    sortingStatus,
  }: {
    sortingStatus?: SortingStatus;
  }): React.ThHTMLAttributes<HTMLTableCellElement> {
    return { scope: 'col', 'aria-sort': sortingStatus ? getAriaSort(sortingStatus) : undefined };
  }

  getTableRowHeaderProps(): React.ThHTMLAttributes<HTMLTableCellElement> {
    return { scope: 'row' };
  }

  getTableCellProps(): React.TdHTMLAttributes<HTMLTableCellElement> {
    return this.tableRole === 'table' ? {} : { role: 'gridcell' };
  }
}
