// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

type SortingStatus = 'sortable' | 'ascending' | 'descending';

const stateToAriaSort = {
  sortable: 'none',
  ascending: 'ascending',
  descending: 'descending',
} as const;
const getAriaSort = (sortingState: SortingStatus) => stateToAriaSort[sortingState];

export interface TableRole {
  assignTableProps(
    options: { ariaLabel?: string; totalItemsCount?: number },
    nativeProps?: React.TableHTMLAttributes<HTMLTableElement>
  ): React.TableHTMLAttributes<HTMLTableElement>;

  assignTableRowProps(
    options: { rowIndex: number; firstIndex?: number },
    nativeProps?: React.HTMLAttributes<HTMLTableRowElement>
  ): React.HTMLAttributes<HTMLTableRowElement>;

  assignTableColHeaderProps(
    options: { sortingStatus?: SortingStatus },
    nativeProps?: React.ThHTMLAttributes<HTMLTableCellElement>
  ): React.ThHTMLAttributes<HTMLTableCellElement>;

  assignTableRowHeaderProps(
    nativeProps?: React.ThHTMLAttributes<HTMLTableCellElement>
  ): React.ThHTMLAttributes<HTMLTableCellElement>;

  assignTableCellProps(
    nativeProps?: React.TdHTMLAttributes<HTMLTableCellElement>
  ): React.TdHTMLAttributes<HTMLTableCellElement>;
}

/**
 * Depending on its content the table can have different semantic representation which includes the
 * ARIA role of the table component ("table", "grid", "treegrid") but also roles and other semantic attributes
 * of the child elements. The TableRole helper encapsulates table's semantic structure.
 */
export function createTableRoleHelper(tableRole: 'table' | 'grid') {
  const assignTableProps: TableRole['assignTableProps'] = ({ ariaLabel, totalItemsCount }, nativeProps = {}) => {
    // Browsers have weird mechanism to guess whether it's a data table or a layout table.
    // If we state explicitly, they get it always correctly even with low number of rows.
    nativeProps.role = tableRole;

    nativeProps['aria-label'] = ariaLabel;

    // Incrementing the total count by one to account for the header row.
    nativeProps['aria-rowcount'] = totalItemsCount ? totalItemsCount + 1 : -1;

    return nativeProps;
  };

  const assignTableRowProps: TableRole['assignTableRowProps'] = ({ rowIndex, firstIndex }, nativeProps = {}) => {
    if (tableRole === 'grid') {
      nativeProps.role = 'row';
    }

    if (firstIndex !== undefined) {
      nativeProps['aria-rowindex'] = firstIndex + rowIndex + 1;
    }

    return nativeProps;
  };

  const assignTableColHeaderProps: TableRole['assignTableColHeaderProps'] = ({ sortingStatus }, nativeProps = {}) => {
    nativeProps.scope = 'col';

    if (sortingStatus) {
      nativeProps['aria-sort'] = getAriaSort(sortingStatus);
    }

    return nativeProps;
  };

  const assignTableRowHeaderProps: TableRole['assignTableRowHeaderProps'] = (nativeProps = {}) => {
    nativeProps.scope = 'row';

    return nativeProps;
  };

  const assignTableCellProps: TableRole['assignTableCellProps'] = (nativeProps = {}) => {
    if (tableRole === 'grid') {
      nativeProps.role = 'gridcell';
    }

    return nativeProps;
  };

  return {
    assignTableProps,
    assignTableRowProps,
    assignTableColHeaderProps,
    assignTableRowHeaderProps,
    assignTableCellProps,
  };
}
