// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { range } from 'lodash';

import Box from '~components/box';
import Header from '~components/header';
import Link from '~components/link';
import Table, { TableProps } from '~components/table';

import { generateItems, Instance } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(20);

export default function () {
  const [clicks, setClicks] = useState(0);

  const tallItemsConfig: TableProps.ColumnDefinition<Instance>[] = columnsConfig.map((config, index) => ({
    ...config,
    cell: (item, ...rest) =>
      index === 0 ? (
        <Link onFollow={() => setClicks(prev => prev + 1)}>{item.id}</Link>
      ) : (
        <ul>
          {range(0, 20).map(index => {
            return <li key={index}>{config.cell(item, ...rest)}</li>;
          })}
        </ul>
      ),
  }));

  return (
    <Box padding="s">
      <Table
        header={<Header headingTagOverride="h1">Table with tall rows, clicks: {clicks}</Header>}
        columnDefinitions={tallItemsConfig}
        items={items}
        stickyHeader={true}
        variant="container"
      />
      <div style={{ blockSize: '90vh', padding: 10 }}>Placeholder to allow page scroll beyond table</div>
    </Box>
  );
}
