// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef } from 'react';
import Button from '~components/button';
import Table, { TableProps } from '~components/table';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import AppContext, { AppContextType } from '../app/app-context';
import { Checkbox } from '~components';

type PageContext = React.Context<
  AppContextType<{
    enableKeyboardNavigation: boolean;
  }>
>;

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
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
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
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button id="scroll-content" onClick={scrollContainers}>
          Align scroll position
        </Button>
        <Checkbox
          checked={urlParams.enableKeyboardNavigation}
          onChange={event => {
            setUrlParams({ enableKeyboardNavigation: event.detail.checked });
            window.location.reload();
          }}
        >
          Keyboard navigation
        </Checkbox>
      </SpaceBetween>
      <ScreenshotArea disableAnimations={true}>
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
            enableKeyboardNavigation={urlParams.enableKeyboardNavigation}
          />
          <Table
            items={[]}
            columnDefinitions={columns}
            loading={true}
            loadingText="Loading resources"
            enableKeyboardNavigation={urlParams.enableKeyboardNavigation}
          />
          {/* Regression test for: AWSUI-11339 */}
          <div style={{ width: 600.25 }}>
            <Table
              items={[]}
              columnDefinitions={columns.slice(0, 2)}
              empty="In container with fractional width"
              enableKeyboardNavigation={urlParams.enableKeyboardNavigation}
            />
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </div>
  );
}
