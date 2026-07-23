// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import VirtualTable from '~components/virtual-table';

import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: string;
  name: string;
  status: string;
}

const items: Item[] = Array.from({ length: 25 }, (_, index) => ({
  id: `row-${index}`,
  name: `Resource ${index}`,
  status: index % 2 === 0 ? 'Available' : 'Pending',
}));

export default function VirtualTableSimplePage() {
  return (
    <>
      <h1>VirtualTable — scaffold</h1>
      <p>
        Config-driven generic VirtualTable (cell F1-A1). This dev page exercises the scaffolded shell; virtualization,
        measurement, and row expansion land in the core implementation unit.
      </p>
      <ScreenshotArea>
        <VirtualTable
          items={items}
          trackBy={item => item.id}
          estimatedRowHeight={23}
          height={480}
          columnDefinitions={[
            { id: 'name', header: 'Name', cell: item => item.name, isStretch: true },
            { id: 'status', header: 'Status', cell: item => item.status },
          ]}
          ariaLabels={{ tableLabel: 'Resources' }}
        />
      </ScreenshotArea>
    </>
  );
}
