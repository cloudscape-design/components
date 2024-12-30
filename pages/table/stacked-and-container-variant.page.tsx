// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Grid from '~components/grid';
import Header from '~components/header';
import Table from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

export default () => {
  return (
    <ScreenshotArea>
      {/* These two should look identical */}
      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
        <ExampleTable variant="container" />

        <ExampleTable variant="stacked" />
      </Grid>

      <br />

      <ExampleTable variant="stacked" />
      <ExampleTable variant="stacked" />
    </ScreenshotArea>
  );
};

const ExampleTable = ({ variant }: { variant: 'container' | 'embedded' | 'borderless' | 'stacked' | 'full-page' }) => {
  const [selectedItems, setSelectedItems] = useState<any>([{ name: 'Item 6' }]);

  return (
    <Table
      variant={variant}
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      columnDefinitions={[
        {
          id: 'variable',
          header: 'Name',
          cell: item => item.name,
          sortingField: 'name',
          isRowHeader: true,
        },
        {
          id: 'value',
          header: 'Value',
          cell: item => item.value,
          sortingField: 'value',
        },
      ]}
      items={[
        {
          name: 'Item 1',
          value: 'First',
          size: 'Small',
        },
        {
          name: 'Item 2',
          value: 'Second',
          size: 'Large',
        },
        {
          name: 'Item 3',
          value: 'Third',
          size: 'Large',
        },
        {
          name: 'Item 4',
          value: 'Fourth',
          size: 'Small',
        },
        {
          name: 'Item 5',
          value: '-',
          size: 'Large',
        },
        {
          name: 'Item 6',
          value: 'Sixth',
          size: 'Small',
        },
      ]}
      selectionType="multi"
      trackBy="name"
      header={<Header>Table with variant {variant}</Header>}
    />
  );
};
