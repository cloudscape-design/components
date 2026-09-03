// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { range } from 'lodash';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import { makeItems } from './common';

// Tall rows: cells hold multi-line list content so each row is much taller than the 40px default.
// This is the regression guard for the row-height fix — the grid-track height floor (`minmax`) must
// let a tall row grow while a normal row stays exactly 40px, and wrapText keeps long text on lines
// instead of truncating. Sticky header (unbounded overlay) is exercised over the tall rows.
const columns = [{ width: 200 }, { minWidth: 200 }, { minWidth: 160 }];

export default function BasicTableTallRowsPage() {
  const items = makeItems(20);
  return (
    <Box padding="s">
      <SpaceBetween size="s">
        <BasicTable
          columns={columns}
          totalRowCount={items.length}
          stickyHeader={<Header headingTagOverride="h1">Table with tall rows</Header>}
          i18nStrings={{ tableLabel: 'Tall rows' }}
        >
          <BasicTableHeader>
            <BasicTableHeaderCell>Name</BasicTableHeaderCell>
            <BasicTableHeaderCell>Details</BasicTableHeaderCell>
            <BasicTableHeaderCell>Notes</BasicTableHeaderCell>
          </BasicTableHeader>
          <BasicTableBody>
            {items.map((item, index) => (
              <BasicTableRow key={item.id} index={index} id={item.id}>
                <BasicTableCell>
                  <Link>{item.name}</Link>
                </BasicTableCell>
                <BasicTableCell>
                  <ul>
                    {range(0, 8).map(line => (
                      <li key={line}>
                        {item.type} line {line}
                      </li>
                    ))}
                  </ul>
                </BasicTableCell>
                <BasicTableCell wrapText={true}>
                  {`Long wrapping note for ${item.name} — ${item.status} — repeated to force wrapping across lines`}
                </BasicTableCell>
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </BasicTable>
        <div style={{ blockSize: '90vh', padding: 10 }}>Placeholder to allow page scroll beyond table</div>
      </SpaceBetween>
    </Box>
  );
}
