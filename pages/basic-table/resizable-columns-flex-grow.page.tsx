// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';

import { DataBody, DataHeader, makeItems } from './common';

// Resizable columns inside a flex-grow parent (flex-grow: 1): resize + shrinking the available width
// must not flicker the layout. Mirrors Table's flex-grow reproduction container.
const columns = [{ minWidth: 120 }, { minWidth: 120 }, { minWidth: 120 }, { minWidth: 120 }];

export default function BasicTableResizableFlexGrowPage() {
  const items = makeItems(5);
  return (
    <Box padding="s">
      <Header variant="h1">Resizable columns — flex-grow</Header>
      <Box>Resize any column and reduce screen width to check for layout flickering.</Box>
      <div
        style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'nowrap', inlineSize: 'calc(100% - 32px)', margin: 16 }}
      >
        <div style={{ whiteSpace: 'nowrap' }}>
          <Box padding="s">flex-grow: 0</Box>
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <BasicTable columns={columns} resizableColumns={true} totalRowCount={items.length} i18nStrings={{ tableLabel: 'flex-grow: 1' }}>
            <DataHeader />
            <DataBody items={items} />
          </BasicTable>
        </div>
      </div>
    </Box>
  );
}
