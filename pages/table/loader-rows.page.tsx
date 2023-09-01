// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';
import Box from '~components/box';
import { Instance, generateItems } from './generate-data';
import { Button, StatusIndicator } from '~components';
import { columnsConfig as originalColumnsConfig } from './shared-configs';

const items = generateItems(20);

const rows: TableProps.RowType<Instance>[] = items.map(item => ({ type: 'data', item }));
rows.splice(20, 0, { type: 'loader', content: <StatusIndicator type="info">End of results</StatusIndicator> });
rows.splice(15, 0, { type: 'loader', content: <StatusIndicator type="error">Loading error</StatusIndicator> });
rows.splice(10, 0, { type: 'loader', content: <StatusIndicator type="loading">Loading</StatusIndicator> });
rows.splice(0, 0, { type: 'loader', content: <Button variant="inline-link">Load more</Button> });

const columnsConfig = originalColumnsConfig.flatMap(column =>
  column.id !== 'type'
    ? [column]
    : [column, column, column, column, column, column, column, column, column, column].map((typeColumn, index) => ({
        ...typeColumn,
        id: typeColumn.id! + index,
        header: typeColumn.header + '-' + (index + 1),
      }))
);

export default function LoaderRowPage() {
  return (
    <Box padding="s">
      <Table
        selectionType="multi"
        header={<Header headingTagOverride="h1">Table with loader rows</Header>}
        columnDefinitions={columnsConfig}
        items={items}
        variant="container"
        rows={rows}
      />
    </Box>
  );
}
