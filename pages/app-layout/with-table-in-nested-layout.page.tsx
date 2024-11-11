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
      disableContentPaddings={true}
      content={
        <AppLayout
          navigationHide={true}
          content={
            <Table
              header={
                <Header
                  variant="awsui-h1-sticky"
                  description="Demo page with footer"
                  actions={<Button variant="primary">Button</Button>}
                >
                  Sticky Scrollbar Example
                </Header>
              }
              stickyHeader={true}
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
              items={new Array(100).fill(null).map((_, index) => ({
                name: `Item ${index}`,
                alt: index,
                description: `This is the ${index} item`,
                type: '1A',
                size: 'Small',
              }))}
            />
          }
        />
      }
    />
  );
}

export default App;
