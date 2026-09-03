// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { DataBody, DataHeader, DATA_COLUMNS, makeItems } from './common';

// Non-sticky scenario: there is NO sticky-header slot. The Header (title/counter/actions) is composed
// BEFORE the BasicTable, and the table flows at natural height (no maxHeight), so nothing pins.
export default function BasicTableSimplePage() {
  const items = makeItems(8);
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — simple (non-sticky)</Box>

        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Resources</Header>
          <BasicTable columns={DATA_COLUMNS} totalRowCount={items.length} i18nStrings={{ tableLabel: 'Resources' }}>
            <DataHeader />
            <DataBody items={items} />
          </BasicTable>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
