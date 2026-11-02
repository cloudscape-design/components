// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { SimplePage } from '../app/templates';

import styles from './styles.scss';

// Each column is narrower than its header label, so every header truncates.
const NARROW_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 120 }, { size: 100 }, { size: 100 }];

export default function TableHeaderTruncationPage() {
  return (
    <SimplePage title="Table atomics — header truncation">
      <TableRoot
        columnLayout={{ type: 'grid', columns: NARROW_COLUMNS }}
        ariaLabel="Narrow columns"
        data-testid="narrow-table"
      >
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <button type="button" className={styles['sort-button']} data-testid="first-header-button">
                @timestampMilliseconds
              </button>
            </TableHeaderCell>
            <TableHeaderCell>@billedDuration</TableHeaderCell>
            <TableHeaderCell>@memoryAllocated</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableBodyCell>1,700,000</TableBodyCell>
            <TableBodyCell>120</TableBodyCell>
            <TableBodyCell>512</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    </SimplePage>
  );
}
