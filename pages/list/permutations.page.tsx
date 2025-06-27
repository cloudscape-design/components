// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, ButtonDropdown, Icon, SpaceBetween } from '~components';
import List, { ListProps } from '~components/list';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  content: string;
  description?: string;
  timestamp?: string;
}
const items: Item[] = [
  { content: 'Item 1', timestamp: '3:23 pm' },
  { content: 'Item 2 has a longer title', timestamp: 'Two hours ago' },
  {
    content: 'Item 3 with more text',
    description: 'Item 3 has a long description that probably spans onto multiple lines on smaller viewports.',
    timestamp: 'Yesterday',
  },
  { content: 'Item 4', description: 'Description', timestamp: 'January 1 2025' },
];

/* eslint-disable react/jsx-key */
const permutations = createPermutations<
  ListProps<Item> & { viewportWidth: number; _disablePaddings: boolean | 'item' }
>([
  {
    viewportWidth: [200, 400],
    items: [items],
    _disablePaddings: [false, true, 'item'],
    renderItem: [
      ({ content }) => ({ content, id: content }),
      ({ content }) => ({ content, id: content, secondaryContent: <Box variant="small">Description</Box> }),
      ({ content }) => ({
        content,
        id: content,
        icon: <Icon name="anchor-link" ariaLabel="Icon" />,
        secondaryContent: <Box variant="small">Description</Box>,
      }),
      ({ content, description }) => ({
        id: content,
        content,
        secondaryContent: description && <Box variant="small">{description}</Box>,
        actions: <ButtonDropdown variant="icon" items={[{ id: 'item', text: 'item' }]} ariaLabel="Actions" />,
      }),
      ({ content, description, timestamp }) => ({
        id: content,
        content,
        secondaryContent: description && <Box variant="small">{description}</Box>,
        actions: (
          <SpaceBetween size="xs" direction="horizontal" alignItems="center">
            <Box variant="small">{timestamp}</Box>
            <ButtonDropdown variant="icon" items={[{ id: 'item', text: 'item' }]} ariaLabel="Actions" />
          </SpaceBetween>
        ),
      }),
    ],
  },
]);
/* eslint-enable react/jsx-key */

export default function ListItemPermutations() {
  return (
    <>
      <h1>List permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={({ viewportWidth, _disablePaddings, ...permutation }) => (
            <div style={{ width: viewportWidth, borderRight: '1px solid red', padding: '4px', overflow: 'hidden' }}>
              <List
                {...permutation}
                disablePaddings={_disablePaddings === true}
                disableItemPaddings={_disablePaddings === 'item'}
              />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
