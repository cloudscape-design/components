// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import VirtualTable from '~components/virtual-table';

import ScreenshotArea from '../utils/screenshot-area';

interface Log {
  id: string;
  timestamp: string;
  level: string;
  message: string;
}

const items: Log[] = Array.from({ length: 25 }, (_, index) => ({
  id: `log-${index}`,
  timestamp: `2026-07-18T05:${String(index % 60).padStart(2, '0')}:00Z`,
  level: index % 5 === 0 ? 'ERROR' : 'INFO',
  message: `Log event ${index}`,
}));

export default function VirtualTableSimplePage() {
  return (
    <>
      <h1>VirtualTable — scaffold (F2-A1, logs-specialized)</h1>
      <p>
        Config-driven, logs-specialized VirtualTable (cell F2-A1). A required <code>viewConfig</code> whose{' '}
        <code>type</code> selects the built-in surface supplies that view&apos;s columns. This dev page exercises the
        scaffolded standard-view shell; windowing, measurement, live tail, the two-mode filter, and row expansion land
        in the core implementation unit.
      </p>
      <ScreenshotArea>
        <VirtualTable
          items={items}
          trackBy={item => item.id}
          estimatedRowHeight={23}
          viewConfig={{
            type: 'standard',
            columnDefinitions: [
              { id: 'timestamp', header: 'Timestamp', width: 210, cell: item => item.timestamp },
              { id: 'level', header: 'Level', width: 90, cell: item => item.level },
              { id: 'message', header: 'Message', isStretch: true, cell: item => item.message },
            ],
          }}
          expandedContentPreset="log-record"
          getExpandedContent={item => <div>Detail for {item.id}</div>}
          defaultExpandedItems={['log-2']}
          ariaLabels={{
            gridLabel: 'Log events',
            expandRowLabel: item => `Show detail for ${item.id}`,
            collapseRowLabel: item => `Hide detail for ${item.id}`,
          }}
        />
      </ScreenshotArea>
    </>
  );
}
