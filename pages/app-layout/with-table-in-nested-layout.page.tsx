// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Button from '~components/button';
import Header from '~components/header';
import Table from '~components/table';

function App() {
  return (
    <AppLayout
      toolsHide={true}
      content={
        <AppLayout
          navigationHide={true}
          content={
            <Table
              header={
                <Header
                  variant="awsui-h1-sticky"
                  description="Demo page with footer"
                  actions={<Button variant="primary"> Button </Button>}
                >
                  Sticky Scrollbar Example
                </Header>
              }
              stickyHeader={true}
              // manually set vertical offset to test this feature
              // stickyHeaderVerticalOffset={99}
              variant="full-page"
              columnDefinitions={[
                {
                  id: 'variable',
                  header: 'Variable name',
                  cell: item => item.name,
                  sortingField: 'name',
                  isRowHeader: true,
                },
                {
                  id: 'alt',
                  header: 'Text value',
                  cell: item => item.alt || '-',
                  sortingField: 'alt',
                },
                {
                  id: 'description',
                  header: 'Description',
                  cell: item => item.description || '-',
                },
              ]}
              items={[
                {
                  name: 'Item 1',
                  alt: 'First',
                  description: 'This is the first item',
                  type: '1A',
                  size: 'Small',
                },
                {
                  name: 'Item 2',
                  alt: 'Second',
                  description: 'This is the second item',
                  type: '1B',
                  size: 'Large',
                },
                {
                  name: 'Item 3',
                  alt: 'Third',
                  description: '-',
                  type: '1A',
                  size: 'Large',
                },
                {
                  name: 'Item 4',
                  alt: 'Fourth',
                  description: 'This is the fourth item',
                  type: '2A',
                  size: 'Small',
                },
                {
                  name: 'Item 5',
                  alt: '-',
                  description: 'This is the fifth item with a longer description',
                  type: '2A',
                  size: 'Large',
                },
                {
                  name: 'Item 6',
                  alt: 'Sixth',
                  description: 'This is the sixth item',
                  type: '1A',
                  size: 'Small',
                },
              ]}
            />
          }
        />
      }
    />
  );
}

export default App;
