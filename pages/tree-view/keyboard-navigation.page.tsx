// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { SpaceBetween } from '~components';
import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import Grid from '~components/grid';
import ToggleButton from '~components/toggle-button';
import TreeView from '~components/tree-view';

import {
  Item as KeyboardNavigationItem,
  nonStsnRegisteredItems,
  stsnRegisteredItems,
} from './items/keyboard-navigation-page-items';
import { textItems } from './items/permutations-items';

export default function TreeViewKeyboardNavigation() {
  const [pressedItems, setPressedItems] = useState<ReadonlyArray<string>>([]);

  return (
    <SpaceBetween size="m">
      <h1>TreeView keyboard navigation</h1>

      <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>No focusable elements inside tree-item</h2>}>
          <TreeView
            ariaLabel="Tree view without focusable elements inside"
            items={textItems}
            renderItem={item => item}
            getItemId={item => item.id}
            getItemChildren={item => item.children}
            i18nStrings={{
              expandButtonLabel: () => 'Expand item',
              collapseButtonLabel: () => 'Collapse item',
            }}
          />
        </Container>
      </Grid>

      <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>Focusable registered elements inside tree-item</h2>}>
          <TreeView<KeyboardNavigationItem>
            ariaLabel="Tree view with focusable registered elements inside"
            items={stsnRegisteredItems}
            renderItem={item => ({
              icon: item.hasToggleButton ? (
                <ToggleButton
                  onChange={({ detail }: any) => {
                    if (detail.pressed) {
                      setPressedItems(prev => [...prev, item.id]);
                    } else {
                      setPressedItems(prev => prev.filter(id => id !== item.id));
                    }
                  }}
                  pressed={pressedItems.includes(item.id)}
                  ariaLabel={`Favorite ${item.id}`}
                  iconName="star"
                  pressedIconName="star-filled"
                  variant="icon"
                />
              ) : undefined,
              content: item.content,
              secondaryContent: item.secondaryContent ? (
                <Box color="text-status-inactive">{item.secondaryContent}</Box>
              ) : undefined,
              announcementLabel: item.announcementLabel,
              actions: item.actions,
            })}
            getItemId={item => item.id}
            getItemChildren={item => item.children}
            i18nStrings={{
              expandButtonLabel: () => 'Expand item',
              collapseButtonLabel: () => 'Collapse item',
            }}
          />
        </Container>
      </Grid>

      <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>Focusable non-registered elements inside tree-item</h2>}>
          <TreeView
            ariaLabel="Tree view with focusable non-registered elements inside"
            items={nonStsnRegisteredItems}
            renderItem={item => item}
            getItemId={item => item.id}
            getItemChildren={item => item.children}
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
