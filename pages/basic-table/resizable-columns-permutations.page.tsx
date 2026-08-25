// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable, { BasicTableProps } from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';

import { DataBody, DataHeader, makeItems } from './common';

// Resizable-columns visual matrix: the same data across the resize-relevant layout axes —
// fixed-width vs flexible-with-min columns, and columnLayout 'fixed' vs 'auto' (content-sized
// flexible tracks). Each variant is independently resizable.
const items = makeItems(4);

const variants: Array<{ label: string; columns: BasicTableProps.ColumnDefinition[]; columnLayout?: 'fixed' | 'auto' }> = [
  { label: 'Fixed widths', columns: [{ width: 200 }, { width: 140 }, { width: 120 }, { width: 160 }] },
  { label: 'Flexible with min', columns: [{ minWidth: 160 }, { minWidth: 120 }, { minWidth: 100 }, {}] },
  { label: 'columnLayout=auto', columns: [{ minWidth: 120 }, { minWidth: 120 }, { minWidth: 100 }, {}], columnLayout: 'auto' },
];

export default function BasicTableResizablePermutationsPage() {
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — resizable columns permutations</Box>
        {variants.map(variant => (
          <SpaceBetween key={variant.label} size="s">
            <Box variant="h2">{variant.label}</Box>
            <BasicTable
              columns={variant.columns}
              resizableColumns={true}
              columnLayout={variant.columnLayout}
              totalRowCount={items.length}
              i18nStrings={{ tableLabel: variant.label }}
            >
              <DataHeader />
              <DataBody items={items} />
            </BasicTable>
          </SpaceBetween>
        ))}
      </SpaceBetween>
    </Box>
  );
}
