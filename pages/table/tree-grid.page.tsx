// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Header from '~components/header';
import Table from '~components/table';
import Box from '~components/box';
import { generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(20);

export default function TableWithTreeGridPage() {
  return (
    <Box padding="s">
      <Table
        header={<Header headingTagOverride="h1">Table with tree grid</Header>}
        columnDefinitions={columnsConfig}
        items={items}
        variant="container"
        selectionType="multi"
        treeGrid={{
          getItemExpandable() {
            return false;
          },
          getItemExpanded() {
            return false;
          },
          getItemLevel() {
            return 1;
          },
          onItemExpandedChange() {},
        }}
      />
    </Box>
  );
}
