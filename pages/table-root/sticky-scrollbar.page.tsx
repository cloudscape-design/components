// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { SimplePage } from '../app/templates';

import styles from './styles.scss';

// Wide, tall tables whose horizontal scrollbar would otherwise sit below their last row: one scrolled by
// the page, one inside a fixed-height container.

const COLUMN_COUNT = 8;
const ROW_COUNT = 60;
const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = Array.from({ length: COLUMN_COUNT }, () => ({
  size: 240,
}));

function WideTable({ label, testId }: { label: string; testId: string }) {
  return (
    <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} ariaLabel={label} data-testid={testId}>
      <TableHead>
        <TableRow>
          {COLUMNS.map((_, column) => (
            <TableHeaderCell key={column}>Column {column + 1}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: ROW_COUNT }, (_, row) => (
          <TableRow key={row}>
            {COLUMNS.map((_, column) => (
              <TableBodyCell key={column}>
                Row {row + 1}, column {column + 1}
              </TableBodyCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}

export default function TableStickyScrollbarPage() {
  return (
    <SimplePage title="Table atomics — sticky scrollbar" screenshotArea={{}}>
      <SpaceBetween size="l">
        <h2>Inside a fixed-height container</h2>
        <div className={styles['scroll-container']} data-testid="scroll-container">
          <WideTable label="Resources in a container" testId="container-table" />
        </div>
        <h2>Scrolled with the page</h2>
        <WideTable label="Resources on the page" testId="page-table" />
      </SpaceBetween>
    </SimplePage>
  );
}
