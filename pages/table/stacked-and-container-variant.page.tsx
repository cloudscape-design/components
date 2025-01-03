// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Grid from '~components/grid';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const tableItems = generateItems(6);

export default () => {
  return (
    <ScreenshotArea>
      <h1>Stacked and container variants</h1>

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
    />
  );
};
