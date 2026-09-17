// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import TableRoot from '~components/table-root';

import { SimplePage } from '../app/templates';
import { DataBody, DataHeader, makeItems } from './common';

// A minimal read-only table in auto layout. `columnLayout` is omitted, so it
// defaults to `{ type: 'auto' }` — columns size to their content and the count comes from the cells.
export default function TableSimplePage() {
  const items = makeItems(8);
  return (
    <SimplePage title="Table atomics — simple (auto layout)" screenshotArea={{}}>
      <SpaceBetween size="s">
        <Header counter={`(${items.length})`}>Resources</Header>
        <TableRoot ariaLabel="Resources">
          <DataHeader />
          <DataBody items={items} />
        </TableRoot>
      </SpaceBetween>
    </SimplePage>
  );
}
