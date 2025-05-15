// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, SpaceBetween } from '~components';
import Box from '~components/box';
import Icon from '~components/icon';
import Treeview from '~components/treeview';

import { Actions, Content } from './common';
import { allItems, items } from './generate-data';

console.log('items: ', items);
console.log('all items: ', allItems);
const allExpandableItemIds = allItems.filter(item => item.children && item.children.length > 0).map(item => item.id);
console.log('expandable item ids: ', allExpandableItemIds);

export default function TestPage() {
  const [expandedItems, setExpandedItems] = useState<Array<string>>([]);

  return (
    <>
      <h1>Test performance page</h1>

      <SpaceBetween size="s">
        <Button
          onClick={() => {
            setExpandedItems(allExpandableItemIds);
            console.time('expand-all');
            requestAnimationFrame(() => console.timeEnd('expand-all'));
          }}
        >
          Expand all
        </Button>

        <Button
          onClick={() => {
            setExpandedItems([]);
            console.time('collapse-all');
            requestAnimationFrame(() => console.timeEnd('collapse-all'));
          }}
        >
          Collapse all
        </Button>
      </SpaceBetween>

      <Box padding="xl">
        <Treeview
          items={items}
          renderItem={item => {
            const isExpanded = expandedItems.includes(item.id);
            return {
              icon: <Icon name={isExpanded ? 'folder-open' : 'folder'} />,
              content: <Content {...item} />,
              secondaryContent: item.hasActions ? <Actions /> : undefined,
              description: item.tagName ? (
                <SpaceBetween size="xs" direction="horizontal">
                  <Box color="text-status-inactive">
                    <Icon name="ticket" />
                    <span>{item.tagName}</span>
                  </Box>
                </SpaceBetween>
              ) : undefined,
            };
          }}
          getItemId={item => item.id}
          getItemChildren={item => item.children}
          onItemToggle={({ detail }: any) => {
            if (detail.expanded) {
              return setExpandedItems(prev => [...prev, detail.item.id]);
            } else {
              return setExpandedItems(prev => prev.filter(id => id !== detail.item.id));
            }
          }}
          expandedItems={expandedItems}
        />
      </Box>
    </>
  );
}
