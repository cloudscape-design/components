// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Header from '~components/header';
import Table from '~components/table';
import { Instance, generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';
import ScreenshotArea from '../utils/screenshot-area';

const allItems = generateItems();
const PAGE_SIZE = 50;

export default function App() {
  const { items } = useCollection(allItems, {
    pagination: { pageSize: PAGE_SIZE },
    sorting: {},
  });
  return (
    <ScreenshotArea>
      <div style={{ blockSize: '400px', overflow: 'scroll' }}>
        <Table<Instance>
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Sticky Scrollbar Example
            </Header>
          }
          columnDefinitions={columnsConfig}
          items={items}
        />
      </div>
    </ScreenshotArea>
  );
}
