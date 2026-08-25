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

// Bounded (in-container) horizontal scrolling. In bounded mode the `.scroll-container` is itself the
// scroll viewport and exposes a persistent native bottom scrollbar, so the synthetic sticky
// scrollbar (unbounded-only) is intentionally NOT rendered here — the native one is always reachable
// at the bottom of the fixed-height box. Wide fixed columns force the horizontal overflow.
const columns = [{ width: 240 }, { width: 220 }, { width: 220 }, { width: 220 }, { width: 200 }];

export default function BasicTableStickyScrollbarInContainerPage() {
  const items = makeItems(20);
  return (
    <Box padding="l">
      <Box variant="h1">BasicTable — horizontal scroll in a container</Box>
      <BasicTable
        columns={columns}
        height={300}
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
