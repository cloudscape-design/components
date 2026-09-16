// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableHeaderRow from '~components/table-header-row';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

// Sticky header (grid layout). The header pins to the top of the page as the body scrolls and stays
// column-aligned under horizontal scroll (a shadow copy outside the horizontal scroller, kept aligned by
// reusing the grid template). Wide fixed columns force horizontal scroll; many rows make the page taller
// than the viewport so page scroll exercises the pin. The Name header carries a real, focusable sort
// button — its aria-hidden copy in the pinned band is inert, so there is a single tab stop for it.
// Page-scroll keyboard clearance is consumer guidance: pad your scroll root (here the document) by the
// offset plus the header height so focus doesn't land under the pinned header.

const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [
  { size: 260 },
  { size: 260 },
  { size: 260 },
  { size: 260 },
  { size: 260 },
];
const STICKY_OFFSET = 0;
const ROW_COUNT = 60;

interface Row {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  region: string;
}

const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, index) => ({
    id: `row-${index}`,
    name: `Resource ${String(index).padStart(3, '0')}`,
    type: index % 3 === 0 ? 'Compute' : index % 3 === 1 ? 'Storage' : 'Network',
    size: `${(index % 8) + 1} GiB`,
    status: index % 2 === 0 ? 'Available' : 'Pending',
    region: index % 2 === 0 ? 'us-east-1' : 'eu-west-1',
  }));

export default function TableStickyHeaderPage() {
  const [ascending, setAscending] = useState(true);
  const rows = useMemo(() => {
    const direction = ascending ? 1 : -1;
    return makeRows(ROW_COUNT).sort((a, b) => direction * a.name.localeCompare(b.name));
  }, [ascending]);

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — sticky header (grid layout)</Box>
        <Box color="text-body-secondary">
          Scroll the page down — the header pins to the top. Scroll the table sideways — the pinned header tracks the
          columns.
        </Box>
        <Header counter={`(${rows.length})`}>Resources</Header>
        <TableRoot
          columnLayout={{ type: 'grid', columns: COLUMNS }}
          ariaLabel="Resources"
          stickyHeader={true}
          stickyHeaderOffset={STICKY_OFFSET}
        >
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell ariaSort={ascending ? 'ascending' : 'descending'}>
                <button
                  type="button"
                  onClick={() => setAscending(value => !value)}
                  style={{ font: 'inherit', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
                >
                  Name {ascending ? '▲' : '▼'}
                </button>
              </TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Size</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Region</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.region}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </SpaceBetween>
    </Box>
  );
}
