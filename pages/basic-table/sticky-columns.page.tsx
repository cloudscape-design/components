// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

interface Row {
  id: string;
  name: string;
  type: string;
  region: string;
  size: string;
  created: string;
  owner: string;
  status: string;
}

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-2'];

const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `resource-${i}`,
    name: `Resource ${i}`,
    type: i % 3 === 0 ? 'Compute' : i % 3 === 1 ? 'Storage' : 'Network',
    region: REGIONS[i % REGIONS.length],
    size: `${(i % 8) + 1} GiB`,
    created: `2026-0${(i % 9) + 1}-15`,
    owner: `team-${(i % 5) + 1}`,
    status: i % 2 === 0 ? 'Available' : 'Pending',
  }));

const rows = makeRows(30);

// Seven fixed-width columns totalling 1180px so the grid overflows the viewport horizontally.
// stickyColumns={{ first: 1, last: 1 }} pins Name (leading) + Status (trailing); the middle five
// scroll beneath them. The header is inlined as a DIRECT BasicTableHeader child so the sticky-header
// overlay mounts (P4) — vertical scroll pins the title band + column-header row (z 800) above the
// sticky columns (z 798), horizontal scroll pins the first/last columns.
const COLUMNS = [
  { width: 220 }, // Name — sticky first
  { width: 160 }, // Type
  { width: 180 }, // Region
  { width: 140 }, // Size
  { width: 160 }, // Created
  { width: 160 }, // Owner
  { width: 160 }, // Status — sticky last
];

export default function BasicTableStickyColumnsPage() {
  return (
    <ScreenshotArea gutters={false}>
      <Box padding="l">
        <SpaceBetween size="l">
          <Box variant="h1">BasicTable — sticky columns (+ sticky header)</Box>
          <BasicTable
            columns={COLUMNS}
            totalRowCount={rows.length}
            stickyColumns={{ first: 1, last: 1 }}
            i18nStrings={{ tableLabel: 'Resources' }}
            stickyHeader={<Header counter={`(${rows.length})`}>Pinned columns</Header>}
          >
            <BasicTableHeader>
              <BasicTableHeaderCell>Name</BasicTableHeaderCell>
              <BasicTableHeaderCell>Type</BasicTableHeaderCell>
              <BasicTableHeaderCell>Region</BasicTableHeaderCell>
              <BasicTableHeaderCell>Size</BasicTableHeaderCell>
              <BasicTableHeaderCell>Created</BasicTableHeaderCell>
              <BasicTableHeaderCell>Owner</BasicTableHeaderCell>
              <BasicTableHeaderCell>Status</BasicTableHeaderCell>
            </BasicTableHeader>
            <BasicTableBody>
              {rows.map((row, index) => (
                <BasicTableRow key={row.id} index={index} id={row.id}>
                  <BasicTableCell>{row.name}</BasicTableCell>
                  <BasicTableCell>{row.type}</BasicTableCell>
                  <BasicTableCell>{row.region}</BasicTableCell>
                  <BasicTableCell>{row.size}</BasicTableCell>
                  <BasicTableCell>{row.created}</BasicTableCell>
                  <BasicTableCell>{row.owner}</BasicTableCell>
                  <BasicTableCell>{row.status}</BasicTableCell>
                </BasicTableRow>
              ))}
            </BasicTableBody>
          </BasicTable>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
