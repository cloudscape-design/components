// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, SpaceBetween } from '~components';
import Box from '~components/box';
import Icon from '~components/icon';
import TreeView from '~components/tree-view';

import { Actions, Content } from './common';
import { allItems, items } from './items/dynamic-items';

const allExpandableItemIds = allItems.filter(item => item.children && item.children.length > 0).map(item => item.id);

export default function DynamicItemsPage() {
  const [expandedItems, setExpandedItems] = useState<Array<string>>([]);

  return (
    <>
      <h1>Dynamic items page</h1>

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
        <TreeView
          items={items}
          renderItem={item => {
            const isExpanded = expandedItems.includes(item.id);
            return {
              icon: <Icon name={isExpanded ? 'folder-open' : 'folder'} />,
              content: <Content {...item} />,
              actions: item.hasActions ? <Actions actionType="button-group" itemLabel={item.name} /> : undefined,
              secondaryContent: item.tagName ? (
                <Box color="text-status-inactive">
                  <SpaceBetween size="xxs" direction="horizontal">
                    <Icon name="ticket" />
                    <span>{item.tagName}</span>
                  </SpaceBetween>
                </Box>
              ) : undefined,
            };
          }}
          getItemId={item => item.id}
          getItemChildren={item => item.children}
          onItemToggle={({ detail }) => {
            if (detail.expanded) {
              const logName = `expand-item-${detail.item.name}`;
              console.time(logName);
              requestAnimationFrame(() => console.timeEnd(logName));
              return setExpandedItems(prev => [...prev, detail.id]);
            } else {
              const logName = `collapse-item-${detail.item.name}`;
              console.time(logName);
              requestAnimationFrame(() => console.timeEnd(logName));
              return setExpandedItems(prev => prev.filter(id => id !== detail.id));
            }
          }}
          expandedItems={expandedItems}
          i18nStrings={{
            expandButtonLabel: () => 'Expand item',
            collapseButtonLabel: () => 'Collapse item',
          }}
        />
      </Box>
    </>
  );
}
