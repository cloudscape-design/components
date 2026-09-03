// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { DataBody, DataHeader, DATA_COLUMNS, makeItems } from './common';

// Compact density is a table-global visual concern (shared Cloudscape compact-table context), so it
// is the root `contentDensity` prop — not composable per row. Rendered alongside a comfortable table
// so the reduced cell padding / row height is directly comparable.
export default function BasicTableCompactModePage() {
  const items = makeItems(6);
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — content density</Box>

        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Comfortable (default)</Header>
          <BasicTable columns={DATA_COLUMNS} totalRowCount={items.length} i18nStrings={{ tableLabel: 'Comfortable' }}>
            <DataHeader />
            <DataBody items={items} />
          </BasicTable>
        </SpaceBetween>

        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Compact</Header>
          <BasicTable
            columns={DATA_COLUMNS}
            totalRowCount={items.length}
            contentDensity="compact"
            i18nStrings={{ tableLabel: 'Compact' }}
          >
            <DataHeader />
            <DataBody items={items} />
          </BasicTable>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
