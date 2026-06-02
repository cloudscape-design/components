// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Container, Header, SpaceBetween } from '~components';
import List from '~components/list';

interface TreeItem {
  id: string;
  content: string;
  children?: TreeItem[];
}

const initialData: TreeItem[] = [
  {
    id: 'item-1',
    content: 'Group 1',
    children: [
      { id: 'item-1-1', content: 'Item 1.1' },
      {
        id: 'item-1-2',
        content: 'Item 1.2',
        children: [
          { id: 'item-1-2-1', content: 'Item 1.2.1' },
          {
            id: 'item-1-2-2',
            content: 'Item 1.2.2',
            children: [
              { id: 'item-1-2-2-1', content: 'Item 1.2.2.1' },
              { id: 'item-1-2-2-2', content: 'Item 1.2.2.2' },
            ],
          },
          { id: 'item-1-2-3', content: 'Item 1.2.3' },
        ],
      },
      { id: 'item-1-3', content: 'Item 1.3' },
    ],
  },
  {
    id: 'item-2',
    content: 'Group 2',
    children: [
      { id: 'item-2-1', content: 'Item 2.1' },
      {
        id: 'item-2-2',
        content: 'Item 2.2',
        children: [
          { id: 'item-2-2-1', content: 'Item 2.2.1' },
          { id: 'item-2-2-2', content: 'Item 2.2.2' },
        ],
      },
    ],
  },
  {
    id: 'item-3',
    content: 'Group 3',
    children: [
      { id: 'item-3-1', content: 'Item 3.1' },
      { id: 'item-3-2', content: 'Item 3.2' },
      { id: 'item-3-3', content: 'Item 3.3' },
    ],
  },
];

export default function NestedSortableListPage() {
  const [items, setItems] = useState(initialData);

  const updateItemChildren = (items: TreeItem[], targetId: string, newChildren: TreeItem[]): TreeItem[] => {
    return items.map(item => {
      if (item.id === targetId) {
        return { ...item, children: newChildren };
      }
      if (item.children) {
        return {
          ...item,
          children: updateItemChildren(item.children, targetId, newChildren),
        };
      }
      return item;
    });
  };

  const handleChildSort = (itemId: string, newChildren: TreeItem[]) => {
    setItems(prev => updateItemChildren(prev, itemId, newChildren));
  };

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header variant="h1">Recursive Nested Sortable Lists</Header>

        <Container header={<Header variant="h2">Tree Structure with Recursive Sorting</Header>}>
          <RecursiveList
            items={items}
            onSortingChange={newItems => setItems(newItems)}
            depth={0}
            onChildSort={handleChildSort}
          />
        </Container>

        <Container header={<Header variant="h2">Debug: Current Data Structure</Header>}>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>{JSON.stringify(items, null, 2)}</pre>
        </Container>
      </SpaceBetween>
    </Box>
  );
}

interface RecursiveListProps {
  items: TreeItem[];
  onSortingChange: (items: TreeItem[]) => void;
  depth: number;
  onChildSort: (itemId: string, newChildren: TreeItem[]) => void;
}

function RecursiveList({ items, onSortingChange, depth, onChildSort }: RecursiveListProps) {
  const [localItems, setLocalItems] = useState(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleSort = (e: { detail: { items: ReadonlyArray<TreeItem> } }) => {
    const newItems = [...e.detail.items];
    setLocalItems(newItems);
    onSortingChange(newItems);
  };

  return (
    <List
      items={localItems}
      sortable={true}
      onSortingChange={handleSort}
      disableItemPaddings={false}
      renderItem={item => ({
        id: item.id,
        content: (
          <SpaceBetween size="s">
            <Box variant={depth === 0 ? 'h3' : 'span'}>{item.content}</Box>
            {item.children && item.children.length > 0 && (
              <Box padding={{ left: 'l' }}>
                <RecursiveList
                  items={item.children}
                  onSortingChange={newChildren => onChildSort(item.id, newChildren)}
                  depth={depth + 1}
                  onChildSort={onChildSort}
                />
              </Box>
            )}
          </SpaceBetween>
        ),
      })}
    />
  );
}
