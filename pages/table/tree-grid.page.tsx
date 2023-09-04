// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Header from '~components/header';
import Table from '~components/table';
import Box from '~components/box';
import { Instance, dnsName, generateItems, id, imageId, instanceType, state } from './generate-data';
import { columnsConfig } from './shared-configs';
import pseudoRandom from '../utils/pseudo-random';

const items = generateItems(20);
for (let i = items.length - 1; i >= 0; i--) {
  for (let j = 0; j < Math.round(pseudoRandom() * 5); j++) {
    const value: Instance = {
      id: items[i].id + ':' + id(),
      state: state(),
      type: instanceType(),
      imageId: imageId(),
    };
    if (value.state !== 'PENDING') {
      value.dnsName = dnsName();
    }
    items.splice(i + j + 1, 0, value);
  }
}

export default function TableWithTreeGridPage() {
  const [expandedSet, setExpandedSet] = useState(new Set<string>());
  return (
    <Box padding="s">
      <Table
        header={<Header headingTagOverride="h1">Table with tree grid</Header>}
        columnDefinitions={columnsConfig}
        items={items.filter(item => !item.id.includes(':') || expandedSet.has(item.id.split(':')[0]))}
        variant="container"
        selectionType="multi"
        treeGrid={{
          getItemExpandable(item) {
            return items.some(otherItem => otherItem.id.startsWith(item.id + ':'));
          },
          getItemExpanded(item) {
            return expandedSet.has(item.id);
          },
          getItemLevel(item) {
            return item.id.includes(':') ? 2 : 1;
          },
          onItemExpandedChange(item, expanded) {
            const newExpandedSet = new Set([...expandedSet]);
            expanded ? newExpandedSet.add(item.id) : newExpandedSet.delete(item.id);
            setExpandedSet(newExpandedSet);
          },
        }}
        ariaLabels={{
          selectionGroupLabel: 'group label',
          allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
          itemSelectionLabel: ({ selectedItems }, item) =>
            `${item.id} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
          tableLabel: 'Items',
        }}
      />
    </Box>
  );
}
