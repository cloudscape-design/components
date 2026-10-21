// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { SimplePage } from '../app/templates';

interface Row {
  name: string;
  type: string;
  status: string;
}

const ROWS: Row[] = [
  { name: 'Resource 0', type: 'Compute', status: 'Available' },
  { name: 'Resource 1', type: 'Storage', status: 'Pending' },
  { name: 'Resource 2', type: 'Network', status: 'Available' },
];

const LONG = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

function Grid({
  label,
  columnLayout,
  selected,
  shaded,
  longFirstCell,
  width,
}: {
  label: string;
  columnLayout?: TableRootProps.ColumnLayout;
  selected?: number[];
  shaded?: number[];
  longFirstCell?: boolean;
  width?: number;
}) {
  return (
    <Box padding="s">
      <Box variant="h2">{label}</Box>
      <div style={{ inlineSize: width, overflowX: width ? 'auto' : undefined }}>
        <TableRoot columnLayout={columnLayout} ariaLabel={label}>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ROWS.map((row, i) => (
              <TableRow key={row.name} selected={selected?.includes(i)} shaded={shaded?.includes(i)}>
                <TableBodyCell>{longFirstCell && i === 1 ? LONG : row.name}</TableBodyCell>
                <TableBodyCell>{row.type}</TableBodyCell>
                <TableBodyCell>{row.status}</TableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </div>
    </Box>
  );
}

const flex3: TableRootProps.ColumnLayout = {
  type: 'grid',
  columns: [{ size: { flex: 1 } }, { size: { flex: 1 } }, { size: { flex: 1 } }],
};
const capped3: TableRootProps.ColumnLayout = {
  type: 'grid',
  columns: [{ maxWidth: 120 }, { maxWidth: 120 }, { maxWidth: 120 }],
};
const fixedWide: TableRootProps.ColumnLayout = {
  type: 'grid',
  columns: [{ size: 260 }, { size: 260 }, { size: 260 }],
};

export default function TableSelectionEdgeCasesPage() {
  return (
    <SimplePage title="Table atomics — grid selection edge cases" screenshotArea={{}}>
      <Grid label="Fill (flex columns fill the viewport, selected row)" columnLayout={flex3} selected={[1]} />
      <Grid
        label="Underfill (columns narrower than the table container, selected row)"
        columnLayout={capped3}
        selected={[1]}
      />
      <Grid
        label="Long content row (flex columns, selected row)"
        columnLayout={flex3}
        selected={[1]}
        longFirstCell={true}
      />
      <Grid
        label="Overflow (fixed 260×3 in a 400px viewport, selected row)"
        columnLayout={fixedWide}
        selected={[1]}
        width={400}
      />
      <Grid label="Merge (two consecutive selected rows)" columnLayout={flex3} selected={[0, 1]} />
      <Grid
        label="Selected row among shaded (striped) rows — selection wins over shading"
        columnLayout={flex3}
        shaded={[0, 1, 2]}
        selected={[1]}
      />
      <Grid label="Auto layout (selected row, outline falls back to row box)" selected={[1]} />
    </SimplePage>
  );
}
