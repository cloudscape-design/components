// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { DataBody, DataHeader, makeItems } from './common';

// Keyboard scroll: every column has a large minWidth so the grid is wider than a narrow container,
// forcing a horizontal scroll viewport. The active scroller is exposed as a focusable region
// (role/tabindex/aria-label) so keyboard users can arrow-scroll it, and grid navigation moves the
// roving cell across the overflowing columns.
const columnsWithMinWidth = [{ minWidth: 200 }, { minWidth: 200 }, { minWidth: 200 }, { minWidth: 200 }];

export default function BasicTableKeyboardScrollPage() {
  const items = makeItems(4);
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — keyboard scroll</Box>
        <Box>Every column has minWidth 200, so this narrow container scrolls horizontally.</Box>

        <div style={{ maxInlineSize: 500 }}>
          <SpaceBetween size="s">
            <Header counter={`(${items.length})`}>Resources</Header>
            <BasicTable columns={columnsWithMinWidth} totalRowCount={items.length} i18nStrings={{ tableLabel: 'Resources' }}>
              <DataHeader />
              <DataBody items={items} />
            </BasicTable>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </Box>
  );
}
