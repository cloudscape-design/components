// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Checkbox from '~components/checkbox';
import Header from '~components/header';

import { makeItems } from './common';

// Focusable elements inside the sticky header (unbounded/overlay mode): a select-all checkbox in a
// `variant="selection"` header cell + resize handles on the data columns. This is the a11y guard for
// the overlay — the aria-hidden duplicate must NOT expose a second, keyboard-focusable copy of these
// controls (every focusable in the overlay is forced tabIndex -1), while the real in-flow header
// keeps them interactive. A focus-target button precedes the table for tab-order checks.
const columns = [{ width: 40 }, { width: 220 }, { minWidth: 160 }, { minWidth: 140 }];

export default function BasicTableStickyHeaderFocusablesPage() {
  const items = makeItems(20);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const allSelected = items.every(item => selectedIds.has(item.id));
  const someSelected = items.some(item => selectedIds.has(item.id));
  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(items.map(item => item.id)));
  const toggleRow = (id: string) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <Box padding="l">
      <button id="focus-target">Focus target</button>
      <Box variant="h1">BasicTable — sticky header focusable elements</Box>
      <BasicTable
        columns={columns}
        resizableColumns={true}
        stickyHeader={<Header headingTagOverride="h2">Testing table</Header>}
        totalRowCount={items.length}
        i18nStrings={{ tableLabel: 'Testing table' }}
      >
        <BasicTableHeader>
          <BasicTableHeaderCell variant="selection">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={toggleAll}
              ariaLabel="Select all"
            />
          </BasicTableHeaderCell>
          <BasicTableHeaderCell>Name</BasicTableHeaderCell>
          <BasicTableHeaderCell>Type</BasicTableHeaderCell>
          <BasicTableHeaderCell>Status</BasicTableHeaderCell>
        </BasicTableHeader>
        <BasicTableBody>
          {items.map((item, index) => (
            <BasicTableRow key={item.id} index={index} id={item.id} selected={selectedIds.has(item.id)}>
              <BasicTableCell variant="selection">
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleRow(item.id)}
                  ariaLabel={`Select ${item.name}`}
                />
              </BasicTableCell>
              <BasicTableCell>{item.name}</BasicTableCell>
              <BasicTableCell>{item.type}</BasicTableCell>
              <BasicTableCell>{item.status}</BasicTableCell>
            </BasicTableRow>
          ))}
        </BasicTableBody>
      </BasicTable>
      <div style={{ blockSize: '90vh', padding: 10 }}>Placeholder to allow page scroll beyond table</div>
    </Box>
  );
}
