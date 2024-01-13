// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import Button from '~components/button';
import Table, { TableProps } from '~components/table';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';

const columns: TableProps.ColumnDefinition<any>[] = [
  {
    header: 'LongColumnHeader',
    cell: item => item,
  },
  {
    header: 'LongColumnHeader',
    cell: item => item,
  },
  {
    header: 'LongColumnHeader',
    cell: item => item,
  },
  {
    header: 'LongColumnHeader',
    cell: item => item,
  },
  {
    header: 'LongColumnHeader',
    cell: item => item,
  },
];

export default function () {
  const rootRef = useRef<HTMLDivElement>(null);

  function scrollContainers() {
    const rootElement = rootRef.current!;
    for (const table of Array.prototype.slice.call(rootElement.querySelectorAll('table')) as HTMLElement[]) {
      const container = table.parentElement!;
      container.scrollLeft = (container.scrollWidth - container.offsetWidth) / 2;
    }
  }

  return (
    <div ref={rootRef}>
      <h1>Tables with empty states</h1>
      <Button id="scroll-content" onClick={scrollContainers}>
        Align scroll position
      </Button>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <Table
            items={[]}
            columnDefinitions={columns}
            empty={
              <>
                <p>No resources to display</p>
                <Button>Create some</Button>
              </>
            }
          />
          <Table items={[]} columnDefinitions={columns} loading={true} loadingText="Loading resources" />
          {/* Regression test for: AWSUI-11339 */}
          <div style={{ width: 600.25 }}>
            <Table items={[]} columnDefinitions={columns.slice(0, 2)} empty="In container with fractional width" />
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </div>
  );
}
