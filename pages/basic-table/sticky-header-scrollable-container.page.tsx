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

import { makeItems } from './common';

// Bounded internal-scroll sticky header: `height` opts the table into its OWN scroll viewport, and
// `stickyHeader` pins the column-header row (and title band) at the top of that box while the body
// scrolls beneath — no page/overlay involved (bounded pins the in-flow rowgroup directly). Wide
// fixed columns also overflow horizontally so the pinned header must scroll-sync with the body.
const columns = [{ width: 220 }, { width: 200 }, { width: 200 }, { width: 200 }, { width: 180 }];

export default function BasicTableStickyHeaderScrollableContainerPage() {
  const items = makeItems(40);
  return (
    <Box padding="l">
      <Box variant="h1">BasicTable — sticky header in a scrollable container</Box>
      <BasicTable
        columns={columns}
        height={320}
        stickyHeader={<Header headingTagOverride="h2" counter={`(${items.length})`}>Resources</Header>}
        totalRowCount={items.length}
        i18nStrings={{ tableLabel: 'Resources' }}
      >
        <BasicTableHeader>
          <BasicTableHeaderCell>Name</BasicTableHeaderCell>
          <BasicTableHeaderCell>Type</BasicTableHeaderCell>
          <BasicTableHeaderCell>Size</BasicTableHeaderCell>
          <BasicTableHeaderCell>Region</BasicTableHeaderCell>
          <BasicTableHeaderCell>Status</BasicTableHeaderCell>
        </BasicTableHeader>
        <BasicTableBody>
          {items.map((item, index) => (
            <BasicTableRow key={item.id} index={index} id={item.id}>
              <BasicTableCell>{item.name}</BasicTableCell>
              <BasicTableCell>{item.type}</BasicTableCell>
              <BasicTableCell>{item.size}</BasicTableCell>
              <BasicTableCell>us-east-1</BasicTableCell>
              <BasicTableCell>{item.status}</BasicTableCell>
            </BasicTableRow>
          ))}
        </BasicTableBody>
      </BasicTable>
    </Box>
  );
}
