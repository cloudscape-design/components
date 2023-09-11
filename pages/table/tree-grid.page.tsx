// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Header from '~components/header';
import Table from '~components/table';
import Box from '~components/box';
import { Instance, generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';
import pseudoRandom from '../utils/pseudo-random';

const roots = generateItems(10);

interface ExtendedInstance extends Instance {
  hasChildren: boolean;
}

interface TreeItemNode {
  item: ExtendedInstance;
  children: TreeItemNode[];
}

const itemsTree: TreeItemNode[] = roots.map(root => {
  const childItems1 = generateItems(Math.round(pseudoRandom() * 5));
  const children1: TreeItemNode[] = childItems1.map(child => {
    const childItems2 = generateItems(Math.round(pseudoRandom() * 2));
    const children2 = childItems2.map(child => ({ item: { ...child, hasChildren: false }, children: [] }));
    return { item: { ...child, hasChildren: children2.length > 0 }, children: children2 };
  });
  return { item: { ...root, hasChildren: children1.length > 0 }, children: children1 };
});
const itemToParent = new Map<ExtendedInstance, null | ExtendedInstance>();

function traverse(parent: null | ExtendedInstance, nodes: TreeItemNode[]) {
  for (const node of nodes) {
    itemToParent.set(node.item, parent);
    traverse(node.item, node.children);
  }
}

traverse(null, itemsTree);

const items = [...itemToParent.keys()];

export default function TableWithTreeGridPage() {
  const [expandedSet, setExpandedSet] = useState(new Set<ExtendedInstance>());

  function isVisible(item: ExtendedInstance) {
    let parent = itemToParent.get(item);
    while (parent !== null) {
      if (parent && !expandedSet.has(parent)) {
        return false;
      }
      parent = (parent && itemToParent.get(parent)) ?? null;
    }
    return true;
  }

  return (
    <Box padding="s">
      <Table
        header={<Header headingTagOverride="h1">Table with tree grid</Header>}
        columnDefinitions={columnsConfig}
        items={items.filter(isVisible)}
        variant="container"
        selectionType="multi"
        treeGrid={{
          getItemExpandable: item => item.hasChildren,
          getItemExpanded: item => expandedSet.has(item),
          getItemParent: item => itemToParent.get(item) ?? null,
          onItemExpandedChange(item, expanded) {
            const newExpandedSet = new Set([...expandedSet]);
            expanded ? newExpandedSet.add(item) : newExpandedSet.delete(item);
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
