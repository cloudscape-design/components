// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Key, useState } from 'react';

import { SpaceBetween } from '~components';
import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import FormField from '~components/form-field';
import Grid from '~components/grid';
import Icon from '~components/icon';
import Select, { SelectProps } from '~components/select';
import ToggleButton from '~components/toggle-button';
import TreeView, { TreeViewProps } from '~components/tree-view';

import { cdsItems, Item as KeyboardNavigationItem, nonCdsItems } from './items/keyboard-navigation-items';
import { textItems } from './items/permutations-items';

export default function TreeViewKeyboardNavigation() {
  const [pressedItems, setPressedItems] = useState<ReadonlyArray<string>>([]);

  return (
    <SpaceBetween size="m">
      <h1>TreeView keyboard navigation</h1>

      {/* <Button>Focus here</Button>

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
      </Grid> */}

      <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>Focusable CDS elements inside tree-item</h2>}>
          <TreeView<KeyboardNavigationItem>
            ariaLabel="Tree view with focusable CDS elements inside"
            items={cdsItems}
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

      {/* <Button>Focus here</Button>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <Container header={<h2>Focusable non-CDS elements inside tree-item</h2>}>
          <TreeView
            ariaLabel="Tree view with focusable non-CDS elements inside"
            items={nonCdsItems}
            renderItem={item => item}
            getItemId={item => item.id}
            getItemChildren={item => item.children}
            i18nStrings={{
              expandButtonLabel: () => 'Expand item',
              collapseButtonLabel: () => 'Collapse item',
            }}
          />
        </Container>
      </Grid> */}
    </SpaceBetween>
  );
}
