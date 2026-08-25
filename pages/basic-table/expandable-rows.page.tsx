// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableExpandedContent,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import Icon from '~components/icon';
import KeyValuePairs from '~components/key-value-pairs';
import SpaceBetween from '~components/space-between';

import { makeItems } from './common';

// Row expansion via ExpandedContent. The disclosure toggle lives in a `variant="disclosure"` leading
// cell with id `${row.id}-toggle`, so pressing Escape inside the expanded region returns focus to it.
// Expansion is consumer-controlled per row. Non-sticky faithful port of table/expandable-rows; sticky
// parity is owned by sticky-header.page.tsx.
export default function BasicTableExpandableRowsPage() {
  const items = makeItems(20);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set([items[0].id]));

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — expandable rows</Box>
        <Header counter={`(${items.length})`}>Expandable resources</Header>
        <BasicTable
          columns={[{ width: 40 }, { width: 220 }, { minWidth: 140 }, {}]}
          totalRowCount={items.length}
          i18nStrings={{ tableLabel: 'Resources' }}
        >
          <BasicTableHeader>
            <BasicTableHeaderCell variant="disclosure" />
            <BasicTableHeaderCell>Name</BasicTableHeaderCell>
            <BasicTableHeaderCell>Type</BasicTableHeaderCell>
            <BasicTableHeaderCell>Status</BasicTableHeaderCell>
          </BasicTableHeader>
          <BasicTableBody>
            {items.map((item, index) => {
              const isExpanded = expanded.has(item.id);
              return (
                <BasicTableRow
                  key={item.id}
                  index={index}
                  id={item.id}
                  expanded={isExpanded}
                  onToggleExpand={() => toggle(item.id)}
                >
                  <BasicTableCell variant="disclosure">
                    <button
                      id={`${item.id}-toggle`}
                      aria-expanded={isExpanded}
                      aria-controls={`${item.id}-region`}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.name}`}
                      onClick={() => toggle(item.id)}
                      style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', display: 'flex' }}
                    >
                      <Icon name={isExpanded ? 'caret-down-filled' : 'caret-right-filled'} />
                    </button>
                  </BasicTableCell>
                  <BasicTableCell>{item.name}</BasicTableCell>
                  <BasicTableCell>{item.type}</BasicTableCell>
                  <BasicTableCell>{item.status}</BasicTableCell>
                  <BasicTableExpandedContent label={`${item.name} details`}>
                    <KeyValuePairs
                      columns={3}
                      items={[
                        { label: 'Id', value: item.id },
                        { label: 'Type', value: item.type },
                        { label: 'Size', value: item.size },
                      ]}
                    />
                  </BasicTableExpandedContent>
                </BasicTableRow>
              );
            })}
          </BasicTableBody>
        </BasicTable>
      </SpaceBetween>
    </Box>
  );
}
