// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import VirtualTable from '~components/virtual-table';

import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: string;
  name: string;
  status: string;
  detail: string;
}

const items: Item[] = Array.from({ length: 25 }, (_, index) => ({
  id: `row-${index}`,
  name: `Resource ${index}`,
  status: index % 2 === 0 ? 'Available' : 'Pending',
  detail: `Extended detail for resource ${index}: arbitrary non-tabular expanded content.`,
}));

export default function VirtualTableHeadlessCoreScaffoldPage() {
  return (
    <>
      <h1>VirtualTable — headless core + compound skin scaffold</h1>
      <p>
        Cell F3-A2: a headless data-grid core (<code>useVirtualGrid</code>) plus a thin Cloudscape skin shaped as
        compound components (Root/Header/HeaderCell/Body/Row/Cell/ExpandedContent). This dev page exercises the
        scaffolded skin — the core hands out props objects (grid/header/row/disclosure/expanded), the skin spreads them,
        including a materialised disclosure column and a first-class ExpandedContent child for arbitrary non-tabular row
        detail. Windowing, measurement, focus, and the live-tail engine land in the core implementation unit.
      </p>
      <ScreenshotArea>
        <VirtualTable.Root
          items={items}
          trackBy={(item: Item) => item.id}
          estimatedRowHeight={23}
          defaultExpandedItems={['row-0']}
          ariaLabels={{
            tableLabel: 'Resources',
            expandButtonLabel: (item, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${item.name}`,
            expandedRegionLabel: item => `${item.name} details`,
          }}
        >
          <VirtualTable.Header sticky={true}>
            <VirtualTable.HeaderCell columnId="name">Name</VirtualTable.HeaderCell>
            <VirtualTable.HeaderCell columnId="status" stretch={true}>
              Status
            </VirtualTable.HeaderCell>
          </VirtualTable.Header>
          <VirtualTable.Body>
            {(item: Item, api) => (
              <VirtualTable.Row item={item} api={api}>
                <VirtualTable.Cell columnId="name">{item.name}</VirtualTable.Cell>
                <VirtualTable.Cell columnId="status">{item.status}</VirtualTable.Cell>
                <VirtualTable.ExpandedContent estimatedHeight={80}>
                  <div>
                    <strong>Details</strong>
                    <p>{item.detail}</p>
                  </div>
                </VirtualTable.ExpandedContent>
              </VirtualTable.Row>
            )}
          </VirtualTable.Body>
        </VirtualTable.Root>
      </ScreenshotArea>
    </>
  );
}
