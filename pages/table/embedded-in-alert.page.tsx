// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';

export default () => {
  return (
    <SpaceBetween direction="vertical" size="m">
      <Alert type="info" header="Alert with borderless table">
        <Box variant="p">Some explanation</Box>

        <ExampleTable variant="borderless" />
      </Alert>

      <Alert type="info" header="Alert with container table">
        <Box variant="p">Some explanation</Box>

        <ExampleTable variant="container" />
      </Alert>

      <ExampleTable variant="borderless" />
    </SpaceBetween>
  );
};

const ExampleTable = ({ variant }: { variant: 'container' | 'embedded' | 'borderless' | 'stacked' | 'full-page' }) => {
  const [selectedItems, setSelectedItems] = useState<any>([{ name: 'Item 6' }]);

  return (
    <Table
      variant={variant}
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      ariaLabels={{
        selectionGroupLabel: 'Items selection',
        allItemsSelectionLabel: () => 'select all',
        itemSelectionLabel: (selection, item) => item.name,
      }}
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
