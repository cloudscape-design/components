// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TableProps } from './interfaces';
import { StickyColumnsModel, useStickyCellStyles } from './sticky-columns';
import { getTableCellRoleProps, TableRole } from './table-role';
import { getColumnKey, getStickyClassNames } from './utils';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

interface TfootCellProps {
  columnId: PropertyKey;
  colIndex: number;
  stickyState: StickyColumnsModel;
  tableRole: TableRole;
  children?: React.ReactNode;
}

function TfootCell({ columnId, colIndex, stickyState, tableRole, children }: TfootCellProps) {
  const stickyStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId,
    getClassName: props => getStickyClassNames(styles, props),
  });

  return (
    <td
      ref={stickyStyles.ref}
      style={stickyStyles.style}
      className={clsx(styles['tfoot-cell'], stickyStyles.className, testUtilStyles['tfoot-cell'])}
      {...getTableCellRoleProps({ tableRole, isRowHeader: false, colIndex })}
    >
      {children}
    </td>
  );
}

export interface TfootProps<T> {
  totalRow: TableProps.TotalRow;
  visibleColumnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  /** Accepts the internal selection type which may include 'group' in addition to 'single' | 'multi' */
  selectionType?: string;
  stickyState: StickyColumnsModel;
  tableRole: TableRole;
  colIndexOffset: number;
}

export function Tfoot<T>({
  totalRow,
  visibleColumnDefinitions,
  selectionType,
  stickyState,
  tableRole,
  colIndexOffset,
}: TfootProps<T>) {
  const { cells } = totalRow;

  return (
    <tfoot className={clsx(styles.tfoot, testUtilStyles.tfoot)}>
      <tr className={clsx(styles['tfoot-row'], testUtilStyles['tfoot-row'])}>
        {selectionType && <td className={clsx(styles['tfoot-cell'], styles['selection-control'])} aria-hidden="true" />}
        {visibleColumnDefinitions.map((column, colIndex) => {
          const colKey = getColumnKey(column, colIndex);
          const cell = cells?.find((c: TableProps.TotalRowCell) => c.columnId === column.id);
          return (
            <TfootCell
              key={String(colKey)}
              columnId={colKey}
              colIndex={colIndex + colIndexOffset}
              stickyState={stickyState}
              tableRole={tableRole}
            >
              {cell?.content ?? null}
            </TfootCell>
          );
        })}
      </tr>
    </tfoot>
  );
}
