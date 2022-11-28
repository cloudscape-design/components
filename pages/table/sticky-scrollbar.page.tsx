// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Header from '~components/header';
import Table from '~components/table';
import Box from '~components/box';
import Link from '~components/link';
import { Instance, generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';
import ScreenshotArea from '../utils/screenshot-area';

const allItems = generateItems();
const PAGE_SIZE = 12;

export default function App() {
  const { items } = useCollection(allItems, {
    pagination: { pageSize: PAGE_SIZE },
    sorting: {},
  });
  return (
    <ScreenshotArea>
      <Table<Instance>
        header={
          <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
            Sticky Scrollbar Example
          </Header>
        }
        columnDefinitions={columnsConfig}
        items={items}
        footer={
          <Box textAlign="center">
            <Link href="#">View all</Link>
          </Box>
        }
      />
    </ScreenshotArea>
  );
}
