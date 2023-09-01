// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Header from '~components/header';
import Table from '~components/table';
import Box from '~components/box';
import { generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(20);

export default function TableWithTreeGridPage() {
  const [expandedSet, setExpandedSet] = useState(new Set<string>());
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
            return true;
          },
          getItemExpanded(item) {
            return expandedSet.has(item.id);
          },
          getItemLevel() {
            return 1;
          },
          onItemExpandedChange(item, expanded) {
            const newExpandedSet = new Set([...expandedSet]);
            expanded ? newExpandedSet.add(item.id) : newExpandedSet.delete(item.id);
            setExpandedSet(newExpandedSet);
          },
        }}
      />
    </Box>
  );
}
