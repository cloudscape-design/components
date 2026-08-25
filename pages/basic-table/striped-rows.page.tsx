// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { DataHeader, DATA_COLUMNS, makeItems } from './common';

// Striped-rows scenario: striping is a ROW-LEVEL prop (`RowProps.striped`) — the consumer decides
// which rows are shaded, typically the odd rows via `striped={index % 2 === 1}`. Selection overrides
// the stripe surface, so the pre-selected odd row (index 3) shows the selected surface, not the shade.
export default function BasicTableStripedRowsPage() {
  const items = makeItems(10);
  const selectedId = items[3].id;

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — striped rows</Box>

        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Resources</Header>
          <BasicTable columns={DATA_COLUMNS} totalRowCount={items.length} i18nStrings={{ tableLabel: 'Resources' }}>
            <DataHeader />
            <BasicTableBody>
              {items.map((item, index) => (
                <BasicTableRow
                  key={item.id}
                  index={index}
                  id={item.id}
                  striped={index % 2 === 1}
                  selected={item.id === selectedId}
                >
                  <BasicTableCell>{item.name}</BasicTableCell>
                  <BasicTableCell>{item.type}</BasicTableCell>
                  <BasicTableCell>{item.size}</BasicTableCell>
                  <BasicTableCell>{item.status}</BasicTableCell>
                </BasicTableRow>
              ))}
            </BasicTableBody>
          </BasicTable>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
