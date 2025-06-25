// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

import { Actions } from '../common';

export interface Item {
  id: string;
  content: React.ReactNode;
  secondaryContent?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: Item[];
}

export const textItems: Item[] = [
  {
    id: '1',
    content: 'Item 1',
    secondaryContent: 'Description 1',
    actions: 'Actions slot',
    children: [{ id: '1.1', content: 'Item 1.1', secondaryContent: 'Description 1.1', actions: 'Actions slot' }],
  },
  {
    id: '2',
    content: 'Item 2',
    secondaryContent: 'Description 2',
    actions: <Actions actionType="button-group" />,
  },
  {
    id: '3',
    content: 'Item 3',
    secondaryContent: 'Description 3',
    actions: <Actions actionType="button-dropdown" />,
    children: [
      { id: '3.1', content: 'Item 3.1', secondaryContent: 'Description 3.1', actions: 'Actions slot' },
      {
        id: '3.2',
        content: 'Item 3.2',
        secondaryContent: 'Description 3.2',
        actions: <Actions actionType="inline-button-dropdown" />,
        children: [{ id: '3.2.1', content: 'Item 3.2.1', secondaryContent: 'Description 3.2.1' }],
      },
      { id: '3.3', content: 'Item 3.3', secondaryContent: 'Description 3.3' },
    ],
  },
];

export const longTextItems: Item[] = [
  {
    id: 'long-text-1',
    content:
      'This item and its children all have long texts such as; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    secondaryContent: (
      <Box color="text-status-inactive">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Sed ut
        perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Sed ut perspiciatis
        unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
      </Box>
    ),
    icon: <Icon name="file" />,
    actions: <Actions actionType="text" />,
  },
  {
    id: 'long-text-2',
    content:
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt',
    secondaryContent: (
      <Box color="text-status-inactive">
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
        numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem, Neque porro quisquam
        est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
        incidunt ut labore et dolore magnam aliquam quaerat voluptatem
      </Box>
    ),
    icon: <Icon name="file" />,
    actions: <Actions actionType="button-group" />,
    children: [
      {
        id: 'long-text-2.1',
        content:
          'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt',
        icon: <Icon name="file" />,
        secondaryContent: (
          <Box color="text-status-inactive">
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
            numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem, Neque porro
            quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
            modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem
          </Box>
        ),
      },
      {
        id: 'long-text-2.2',
        content:
          'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt',
        secondaryContent: (
          <Box color="text-status-inactive">
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
            numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem, Neque porro
            quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
            modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem
          </Box>
        ),
        icon: <Icon name="file" />,
        children: [
          {
            id: 'long-text-2.2.1',
            content:
              'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt',
            secondaryContent:
              'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem',
            icon: <Icon name="file" />,
          },
        ],
      },
    ],
  },
  {
    id: 'long-text-3',
    content:
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque',
    secondaryContent:
      'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam',
    icon: <Icon name="file" />,
    actions: <Actions actionType="button-dropdown" />,
    children: [
      {
        id: 'long-text-3.1',
        content:
          'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt',
        secondaryContent:
          'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem',
      },
    ],
  },
  {
    id: 'long-text-4',
    content:
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque',
    secondaryContent:
      'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam',
    icon: <Icon name="file" />,
    actions: <Actions actionType="inline-button-dropdown" />,
  },
];

export const statusIndicatorItems: Item[] = [
  {
    id: 'status-indicator-1',
    content: <StatusIndicator type="success">Evaluated</StatusIndicator>,
    secondaryContent: 'Successful',
  },
  {
    id: 'status-indicator-2',
    content: (
      <div style={{ display: 'flex' }}>
        <StatusIndicator type="warning">Checked 5 nodes</StatusIndicator>
        <div style={{ borderLeft: '1px solid grey', marginLeft: '8px', marginRight: '8px' }} />
        <SpaceBetween direction="horizontal" size="s">
          <StatusIndicator type="success">1</StatusIndicator>
          <StatusIndicator type="in-progress">1</StatusIndicator>
          <StatusIndicator type="warning">1</StatusIndicator>
          <StatusIndicator type="error">1</StatusIndicator>
        </SpaceBetween>
      </div>
    ),
    children: [
      {
        id: 'status-indicator-2.1',
        content: <StatusIndicator type="success">node-17 (eksclu-node-12345)</StatusIndicator>,
      },
      {
        id: 'status-indicator-2.2',
        content: <StatusIndicator type="in-progress">node-18 (eksclu-node-09876)</StatusIndicator>,
        secondaryContent: 'In progress',
      },
      {
        id: 'status-indicator-2.3',
        content: <StatusIndicator type="warning">node-20 (eksclu-node-wx456)</StatusIndicator>,
        children: [
          {
            id: 'status-indicator-2.3.1',
            content: <StatusIndicator type="warning">Checked resource utilization</StatusIndicator>,
            secondaryContent: 'CPU utilization threshold exceeded.',
          },
          {
            id: 'status-indicator-2.3.2',
            content: <StatusIndicator type="success">Checked network connectivity</StatusIndicator>,
          },
        ],
      },
      {
        id: 'status-indicator-2.4',
        content: <StatusIndicator type="error">node-19 (eksclu-node-ab123)</StatusIndicator>,
      },
    ],
  },
  {
    id: 'status-indicator-3',
    content: <StatusIndicator type="success">Checked EKS clusters</StatusIndicator>,
  },
  {
    id: 'status-indicator-4',
    content: (
      <div style={{ display: 'flex' }}>
        <StatusIndicator type="in-progress">Running automation</StatusIndicator>
        <div style={{ borderLeft: '1px solid grey', marginLeft: '8px', marginRight: '8px' }} />
        <SpaceBetween direction="horizontal" size="s">
          <StatusIndicator type="error">1</StatusIndicator>
          <StatusIndicator type="in-progress">1</StatusIndicator>
          <StatusIndicator type="success">1</StatusIndicator>
        </SpaceBetween>
      </div>
    ),
    children: [
      {
        id: 'status-indicator-4.1',
        content: <StatusIndicator type="success">First action</StatusIndicator>,
      },
      {
        id: 'status-indicator-4.2',
        content: <StatusIndicator type="error">Second action</StatusIndicator>,
      },
      {
        id: 'status-indicator-4.3',
        content: <StatusIndicator type="loading">Third action</StatusIndicator>,
      },
    ],
  },
];

export function getAllExpandableItemIds(items: Item[]) {
  const expandableItemIds: string[] = [];

  const pushItem = (item: Item) => {
    if (item.children) {
      expandableItemIds.push(item.id);
      item.children.forEach(pushItem);
    }
  };

  items.forEach(pushItem);
  return expandableItemIds;
}
