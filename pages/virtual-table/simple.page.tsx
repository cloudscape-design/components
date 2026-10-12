// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import VirtualTable from '~components/virtual-table';

import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: string;
  name: string;
  type: string;
  status: string;
}

const items: Item[] = Array.from({ length: 25 }, (_, index) => ({
  id: `row-${index}`,
  name: `Resource ${index}`,
  type: index % 3 === 0 ? 'Instance' : index % 3 === 1 ? 'Volume' : 'Snapshot',
  status: index % 2 === 0 ? 'Available' : 'Pending',
}));

export default function VirtualTableSimplePage() {
  return (
    <>
      <h1>VirtualTable — shared column layout + resize</h1>
      <p>
        Config-driven generic VirtualTable (cell F1-A1). This dev page exercises the shared{' '}
        <code>grid-template-columns</code> layout with a fixed + flexible + resizable column mix: <b>ID</b> is a fixed
        120px track, <b>Name</b> is flexible (minmax minWidth 160px, 1fr), <b>Type</b> is fixed 140px, and <b>Status</b>{' '}
        is flexible. Every column is resizable via the trailing divider on its header cell, and the header row aligns to
        every body row content-independently.
      </p>
      <ScreenshotArea>
        <VirtualTable
          items={items}
          trackBy={item => item.id}
          estimatedRowHeight={23}
          height={480}
          resizableColumns={true}
          getExpandedContent={item => (
            <div>
              <b>{item.name}</b> — {item.type}, {item.status}
            </div>
          )}
          columnDefinitions={[
            { id: 'id', header: 'ID', cell: item => item.id, width: 120 },
            { id: 'name', header: 'Name', cell: item => item.name, minWidth: 160, isStretch: true },
            { id: 'type', header: 'Type', cell: item => item.type, width: 140 },
            { id: 'status', header: 'Status', cell: item => item.status, minWidth: 120 },
          ]}
          ariaLabels={{
            tableLabel: 'Resources',
            expandButtonLabel: (item, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${item.name}`,
            expandedRegionLabel: item => `Details for ${item.name}`,
          }}
        />
      </ScreenshotArea>
    </>
  );
}
