// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Box, Button, Header, SpaceBetween, Table, TableProps } from '~components';

interface Item {
  name: string;
  children?: Item[];
}

const items: Item[] = [
  {
    name: 'Root-1',
    children: [
      { name: 'Nested-1.1' },
      {
        name: 'Nested-1.2',
        children: [{ name: 'Nested-1.2.1' }, { name: 'Nested-1.2.2' }],
      },
    ],
  },
  {
    name: 'Root-2',
    children: [
      { name: 'Nested-2.1' },
      {
        name: 'Nested-2.2',
        children: [{ name: 'Nested-2.2.1', children: [{ name: 'Nested-2.2.1.1' }] }],
      },
    ],
  },
  { name: 'Root-3 (leaf)' },
];

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name },
];

export default function ExpandCollapseAllPage() {
  const tableRef = useRef<TableProps.Ref>(null);
  const [expandedItems, setExpandedItems] = useState<ReadonlyArray<Item>>([]);

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header variant="h1">Table expand / collapse all</Header>

        <SpaceBetween size="xs" direction="horizontal">
          <Button data-testid="expand-all" onClick={() => tableRef.current?.expandAll?.()}>
            Expand all
          </Button>
          <Button data-testid="collapse-all" onClick={() => tableRef.current?.collapseAll?.()}>
            Collapse all
          </Button>
          <Box variant="span" padding={{ top: 'xxs' }} data-testid="expanded-count">
            Expanded: {expandedItems.length}
          </Box>
        </SpaceBetween>

        <Table
          ref={tableRef}
          columnDefinitions={columnDefinitions}
          items={items}
          trackBy="name"
          ariaLabels={{
            tableLabel: 'Expand/collapse all demo',
            expandButtonLabel: item => `Expand ${item?.name}`,
            collapseButtonLabel: item => `Collapse ${item?.name}`,
          }}
          expandableRows={{
            getItemChildren: item => item.children ?? [],
            isItemExpandable: item => !!item.children && item.children.length > 0,
            expandedItems,
            onExpandableItemToggle: ({ detail }) =>
              setExpandedItems(prev => {
                const next = prev.filter(item => item.name !== detail.item.name);
                return detail.expanded ? [...next, detail.item] : next;
              }),
            onExpandAllToggle: ({ detail }) => setExpandedItems(detail.expandedItems),
          }}
        />
      </SpaceBetween>
    </Box>
  );
}
