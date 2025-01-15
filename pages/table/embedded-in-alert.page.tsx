// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const tableItems = generateItems(6);

export default () => {
  return (
    <ScreenshotArea>
      <h1>Table embedded in alert</h1>

      <SpaceBetween direction="vertical" size="m">
        <Alert type="info" header="Alert with borderless table" statusIconAriaLabel="Info">
          <Box variant="p">Some description</Box>

          <ExampleTable variant="borderless" />
        </Alert>

        <Alert type="info" header="Alert with container table" statusIconAriaLabel="Info">
          <Box variant="p">Some description</Box>

          <ExampleTable variant="container" />
        </Alert>

        <ExampleTable variant="borderless" />
      </SpaceBetween>
    </ScreenshotArea>
  );
};

const ExampleTable = ({ variant }: { variant: TableProps.Variant }) => {
  const [selectedItems, setSelectedItems] = useState<any>([tableItems[tableItems.length - 1]]);

  return (
    <Table
      variant={variant}
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      columnDefinitions={columnsConfig}
      items={tableItems}
      selectionType="multi"
      header={<Header>Table with variant {variant}</Header>}
      ariaLabels={{
        selectionGroupLabel: 'Items selection',
        allItemsSelectionLabel: () => 'select all',
        itemSelectionLabel: (selection, item) => item.id,
      }}
    />
  );
};
