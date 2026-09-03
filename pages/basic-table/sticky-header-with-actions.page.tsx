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
import ButtonDropdown from '~components/button-dropdown';
import Header from '~components/header';

import { makeItems } from './common';

// Sticky header carrying actions (the real-element form of `stickyHeader`): a `Header` with an
// actions ButtonDropdown pins as the title band above the column-header row. Bounded internal scroll
// (`height`) so the header pins inside the table's own scroll box; a pinned last column
// (`stickyColumns.last`) exercises the sticky-header × sticky-columns combination.
const columns = [{ width: 320 }, { width: 300 }, { width: 300 }, { width: 260 }];
const dropdownItems = [
  { id: '1', text: 'Item 1' },
  { id: '2', text: 'Item 2' },
  { id: '3', text: 'Item 3' },
];

export default function BasicTableStickyHeaderWithActionsPage() {
  const items = makeItems(30);
  return (
    <Box padding="l">
      <Box variant="h1">BasicTable — sticky header with actions</Box>
      <BasicTable
        columns={columns}
        height={320}
        stickyColumns={{ last: 1 }}
        stickyHeader={
          <Header actions={<ButtonDropdown items={dropdownItems}>Actions</ButtonDropdown>} headingTagOverride="h2">
            Instances
          </Header>
        }
        totalRowCount={items.length}
        i18nStrings={{ tableLabel: 'Instances' }}
      >
        <BasicTableHeader>
          <BasicTableHeaderCell>Name</BasicTableHeaderCell>
          <BasicTableHeaderCell>Type</BasicTableHeaderCell>
          <BasicTableHeaderCell>Size</BasicTableHeaderCell>
          <BasicTableHeaderCell>Status</BasicTableHeaderCell>
        </BasicTableHeader>
        <BasicTableBody>
          {items.map((item, index) => (
            <BasicTableRow key={item.id} index={index} id={item.id}>
              <BasicTableCell>{item.name}</BasicTableCell>
              <BasicTableCell>{item.type}</BasicTableCell>
              <BasicTableCell>{item.size}</BasicTableCell>
              <BasicTableCell>{item.status}</BasicTableCell>
            </BasicTableRow>
          ))}
        </BasicTableBody>
      </BasicTable>
    </Box>
  );
}
