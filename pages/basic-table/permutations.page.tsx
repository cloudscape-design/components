// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableProps,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';

import { DataHeader, DATA_COLUMNS, Item, makeItems } from './common';

// General visual matrix over the already-built props: role (grid/table), density, striped rows, and
// a selected row. Each variant renders the same 4-column data so the visual differences are directly
// comparable — the BasicTable analogue of table/permutations.
const items = makeItems(4);

const variants: Array<{
  label: string;
  role?: BasicTableProps.Role;
  contentDensity?: 'comfortable' | 'compact';
  striped?: boolean;
  selectedIndex?: number;
}> = [
  { label: 'role=grid (default)' },
  { label: 'role=table' , role: 'table' },
  { label: 'compact density', contentDensity: 'compact' },
  { label: 'striped rows', striped: true },
  { label: 'a selected row', selectedIndex: 1 },
];

function Rows({ items, striped, selectedIndex }: { items: Item[]; striped?: boolean; selectedIndex?: number }) {
  return (
    <BasicTableBody>
      {items.map((item, index) => (
        <BasicTableRow
          key={item.id}
          index={index}
          id={item.id}
          striped={striped ? index % 2 === 1 : undefined}
          selected={selectedIndex === index}
        >
          <BasicTableCell>{item.name}</BasicTableCell>
          <BasicTableCell>{item.type}</BasicTableCell>
          <BasicTableCell>{item.size}</BasicTableCell>
          <BasicTableCell>{item.status}</BasicTableCell>
        </BasicTableRow>
      ))}
    </BasicTableBody>
  );
}

export default function BasicTablePermutationsPage() {
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — permutations</Box>
        {variants.map(variant => (
          <SpaceBetween key={variant.label} size="s">
            <Box variant="h2">{variant.label}</Box>
            <BasicTable
              columns={DATA_COLUMNS}
              role={variant.role}
              contentDensity={variant.contentDensity}
              totalRowCount={items.length}
              i18nStrings={{ tableLabel: variant.label }}
            >
              <DataHeader />
              <Rows items={items} striped={variant.striped} selectedIndex={variant.selectedIndex} />
            </BasicTable>
          </SpaceBetween>
        ))}
      </SpaceBetween>
    </Box>
  );
}
