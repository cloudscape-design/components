// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import Grid from '~components/grid';
import SpaceBetween from '~components/space-between';
import TreeView from '~components/tree-view';

import { Item, stsnRegisteredItems } from './items/keyboard-navigation-items';

interface FlattenedItem extends Item {
  parentId: string;
  noActionButton?: boolean;
}

const flattenItems = (items: Item[]) => {
  const allItems: FlattenedItem[] = [];

  const pushItem = (item: Item, parentId: string) => {
    allItems.push({ ...item, parentId });
    if (item.children) {
      item.children.forEach(i => pushItem(i, item.id));
    }
  };

  items.forEach(i => pushItem(i, 'root'));

  return allItems;
};

export default function TreeViewWithRemovableItems() {
  const [items, setItems] = useState(flattenItems(stsnRegisteredItems));
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const removeButton = (itemId: string) => {
    setItems(currentItems => currentItems.map(item => (item.id === itemId ? { ...item, noActionButton: true } : item)));
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    setExpandedItems(currentExpandedItems => currentExpandedItems.filter(id => id !== itemId));
  };

  return (
    <SpaceBetween size="m">
      <h1>Tree view with removable elements</h1>

      <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>Tree view with removable items</h2>}>
          <TreeView<FlattenedItem>
            ariaLabel="Tree view with removable items"
            items={items.filter(i => i.parentId === 'root')}
            renderItem={item => ({
              content: item.content,
              actions: (
                <Button ariaLabel={`${item.announcementLabel ?? item.content}`} onClick={() => removeItem(item.id)}>
                  Remove item
                </Button>
              ),
              announcementLabel: item.announcementLabel,
              secondaryContent: item.secondaryContent ? (
                <Box color="text-status-inactive">{item.secondaryContent}</Box>
              ) : undefined,
            })}
            getItemId={item => item.id}
            getItemChildren={item => items.filter(i => i.parentId === item.id)}
            i18nStrings={{
              expandButtonLabel: () => 'Expand item',
              collapseButtonLabel: () => 'Collapse item',
            }}
            expandedItems={expandedItems}
            onItemToggle={({ detail }: any) =>
              setExpandedItems(prev =>
                detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
              )
            }
          />
        </Container>
      </Grid>

      <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>Tree view with removable action buttons</h2>}>
          <TreeView<FlattenedItem>
            ariaLabel="Tree view with removable action buttons"
            items={items.filter(i => i.parentId === 'root')}
            renderItem={item => ({
              content: item.content,
              actions: !item.noActionButton && (
                <Button ariaLabel={`${item.announcementLabel ?? item.content}`} onClick={() => removeButton(item.id)}>
                  Remove button
                </Button>
              ),
              announcementLabel: item.announcementLabel,
              secondaryContent: item.secondaryContent ? (
                <Box color="text-status-inactive">{item.secondaryContent}</Box>
              ) : undefined,
            })}
            getItemId={item => item.id}
            getItemChildren={item => items.filter(i => i.parentId === item.id)}
            i18nStrings={{
              expandButtonLabel: () => 'Expand item',
              collapseButtonLabel: () => 'Collapse item',
            }}
          />
        </Container>
      </Grid>

      <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>Tree view with removable action buttons and regular buttons</h2>}>
          <TreeView<FlattenedItem>
            ariaLabel="Tree view with removable action buttons and regular buttons"
            items={items.filter(i => i.parentId === 'root')}
            renderItem={item => ({
              content: item.content,
              actions: (
                <SpaceBetween size="xs" direction="horizontal">
                  {!item.noActionButton && (
                    <Button
                      ariaLabel={`${item.announcementLabel ?? item.content}`}
                      onClick={() => removeButton(item.id)}
                    >
                      Remove button
                    </Button>
                  )}
                  <Button>Button</Button>
                </SpaceBetween>
              ),
              announcementLabel: item.announcementLabel,
              secondaryContent: item.secondaryContent ? (
                <Box color="text-status-inactive">{item.secondaryContent}</Box>
              ) : undefined,
            })}
            getItemId={item => item.id}
            getItemChildren={item => items.filter(i => i.parentId === item.id)}
            i18nStrings={{
              expandButtonLabel: () => 'Expand item',
              collapseButtonLabel: () => 'Collapse item',
            }}
          />
        </Container>
      </Grid>
    </SpaceBetween>
  );
}
