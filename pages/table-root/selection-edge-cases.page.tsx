// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableHeaderRow from '~components/table-header-row';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow, { TableRowProps } from '~components/table-row';

import ScreenshotArea from '../utils/screenshot-area';

// Visual coverage for the grid-layout selection-outline edge cases: the selected-row outline is an
// abspos `::after` placed into the row's grid area (`grid-column: 1 / -1`), so it hugs the column extent
// regardless of how the tracks relate to the row box. These permutations pin the states that regressed
// during development:
//  - FILL: flex tracks fill the viewport — outline ends at the last column (== viewport).
//  - UNDERFILL: capped tracks are narrower than the row — outline stops at the last column, not the row edge.
//  - OVERFLOW: fixed tracks exceed the scroll viewport — outline follows the tracks past the fold.
//  - MERGE: two consecutive selected rows render as one continuous rounded outline.
//  - SHADED: striped-row divider darkening via adjacency.
//  - AUTO: in auto layout the row is not a grid, so the outline falls back to the row box.

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
  const variantOf = (i: number): TableRowProps.Variant =>
    selected?.includes(i) ? 'selected' : shaded?.includes(i) ? 'shaded' : 'default';
  return (
    <Box padding="s">
      <Box variant="h3">{label}</Box>
      <div style={{ inlineSize: width, overflowX: width ? 'auto' : undefined }}>
        <TableRoot columnLayout={columnLayout} ariaLabel={label}>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {ROWS.map((row, i) => (
              <TableRow key={row.name} variant={variantOf(i)}>
                <TableCell>{longFirstCell && i === 1 ? LONG : row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.status}</TableCell>
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
    <ScreenshotArea>
      <Box variant="h1" padding="s">
        Table atomics — grid selection edge cases
      </Box>
      <Grid label="Fill (flex, selected row)" columnLayout={flex3} selected={[1]} />
      <Grid label="Underfill (capped columns, selected row)" columnLayout={capped3} selected={[1]} />
      <Grid label="Underfill + long content row (flex)" columnLayout={flex3} selected={[1]} longFirstCell={true} />
      <Grid
        label="Overflow (fixed 260×3 in a 400px viewport, selected row)"
        columnLayout={fixedWide}
        selected={[1]}
        width={400}
      />
      <Grid label="Merge (two consecutive selected rows)" columnLayout={flex3} selected={[0, 1]} />
      <Grid label="Shaded (striped rows)" columnLayout={flex3} shaded={[0, 2]} />
      <Grid label="Auto layout (selected row, outline falls back to row box)" selected={[1]} />
    </ScreenshotArea>
  );
}
