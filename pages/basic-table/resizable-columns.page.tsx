// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BasicTable, { BasicTableProps } from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { DataBody, DataHeader, makeItems } from './common';

// Faithful non-sticky port of table/resizable-columns (reference defaults stickyHeader=false).
// Column config mirrors the reference's fixed + flexible mix: Name fixed 200, Type fixed 130
// (minWidth 130), Size flexible (minWidth 100), Status flexible last column — the last resizable
// column fills remaining width (1fr) and honors its resized width as the track floor, so dragging
// it wider forces horizontal scroll (Table's last-column behavior). window.__btColumnWidths mirrors
// the emitted detail so the harness can assert the commit fires once per gesture.
declare global {
  interface Window {
    __btColumnWidths?: Record<number, number>;
    __btColumnWidthsCommits?: number;
  }
}

export default function BasicTableResizableColumnsPage() {
  const items = makeItems(30);
  const [widths, setWidths] = useState<Record<number, number>>({});
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header variant="h1">Resizable columns</Header>
        <Header counter={`(${items.length})`}>Resizable resources</Header>
        <BasicTable
          columns={[{ width: 200 }, { width: 130, minWidth: 130 }, { minWidth: 100 }, {}]}
          totalRowCount={items.length}
          resizableColumns={true}
          columnWidths={widths}
          onColumnWidthsChange={(e: { detail: BasicTableProps.ColumnWidthsDetail }) => {
            window.__btColumnWidths = e.detail.widths;
            window.__btColumnWidthsCommits = (window.__btColumnWidthsCommits ?? 0) + 1;
            setWidths(e.detail.widths);
          }}
          i18nStrings={{ tableLabel: 'Resources', resizerRoleDescription: 'Resize column' }}
        >
          <DataHeader />
          <DataBody items={items} />
        </BasicTable>
      </SpaceBetween>
    </Box>
  );
}
