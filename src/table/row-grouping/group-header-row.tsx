// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getTableCellRoleProps, getTableRowRoleProps, TableRole } from '../table-role';

import styles from '../styles.css.js';

export interface GroupHeaderRowProps {
  groupId: string;
  content: React.ReactNode;
  totalColumnsCount: number;
  tableRole: TableRole;
  rowIndex: number;
  firstIndex?: number;
  headerRowCount: number;
}

/**
 * A non-selectable, non-editable table row that visually separates a group of data rows.
 * It spans all visible columns (including the selection column when present) and is rendered
 * above the first item of every group defined via `rowGrouping`.
 */
export function GroupHeaderRow({
  groupId,
  content,
  totalColumnsCount,
  tableRole,
  rowIndex,
  firstIndex,
  headerRowCount,
}: GroupHeaderRowProps) {
  return (
    <tr
      className={clsx(styles.row, styles['group-header-row'])}
      data-group-id={groupId}
      {...getTableRowRoleProps({ tableRole, rowIndex, firstIndex, headerRowCount })}
    >
      <td
        className={styles['group-header-cell']}
        colSpan={totalColumnsCount}
        {...getTableCellRoleProps({ tableRole, colIndex: 0 })}
      >
        <div className={styles['group-header-content']}>{content}</div>
      </td>
    </tr>
  );
}
