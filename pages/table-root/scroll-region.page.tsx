// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { SimplePage } from '../app/templates';

// Four fixed 400px tracks (1600px total): overflows a normal-width viewport and fits a very wide one, so a
// viewport resize flips the horizontal-overflow scroll region on and off.
const WIDE_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [
  { size: 400 },
  { size: 400 },
  { size: 400 },
  { size: 400 },
];

export default function TableScrollRegionPage() {
  const [grown, setGrown] = useState(false);
  return (
    <SimplePage title="Table atomics — scroll region">
      <h2>Overflowing grid</h2>
      <TableRoot
        columnLayout={{ type: 'grid', columns: WIDE_COLUMNS }}
        ariaLabel="Overflowing resources"
        data-testid="scroll-table"
      >
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Size</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableBodyCell>Resource 0</TableBodyCell>
            <TableBodyCell>Compute</TableBodyCell>
            <TableBodyCell>1 GiB</TableBodyCell>
            <TableBodyCell>Available</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>

      <h2>Auto content growth</h2>
      <Button data-testid="grow" onClick={() => setGrown(true)}>
        Grow content
      </Button>
      <TableRoot ariaLabel="Growing resources" data-testid="grow-table">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableBodyCell>{grown ? 'x'.repeat(4000) : 'short'}</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    </SimplePage>
  );
}
