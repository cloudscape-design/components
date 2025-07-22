// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '~components/badge';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

const progressiveStepContent = (
  <div style={{ display: 'flex' }}>
    <StatusIndicator type="warning">Checked 5 nodes</StatusIndicator>
    <div style={{ borderLeft: '1px solid grey', marginLeft: '8px', marginRight: '8px' }} />
    <SpaceBetween direction="horizontal" size="s">
      <Popover content="There is an item with warning status" dismissButton={false} position="top">
        <StatusIndicator type="warning">1</StatusIndicator>
      </Popover>
      <StatusIndicator type="in-progress">1</StatusIndicator>
      <StatusIndicator type="error">1</StatusIndicator>
      <StatusIndicator type="success">2</StatusIndicator>
    </SpaceBetween>
  </div>
);

const progressiveStepItemsContent = [
  <StatusIndicator key={'warning-child'} type="warning">
    node-17 (eksclu-node-12345)
  </StatusIndicator>,
  <StatusIndicator key={'loading-child'} type="loading">
    node-18 (eksclu-node-09876)
  </StatusIndicator>,
  <StatusIndicator key={'error-child'} type="error">
    <Popover content="This is an error message" position="top" dismissButton={false}>
      node-18 (eksclu-node-09876)
    </Popover>
  </StatusIndicator>,
  <StatusIndicator key={'success-child'} type="success">
    node-19 (eksclu-node-ab123)
  </StatusIndicator>,
  <StatusIndicator key={'success-child-2'} type="success">
    node-20 (eksclu-node-ab124)
  </StatusIndicator>,
];

interface Item {
  id: string;
  content: React.ReactNode;
  details?: string;
  children?: Item[];
  hasActions?: boolean;
  hideIcon?: boolean;
  announcementLabel?: string;
}

export const items: Item[] = [
  {
    id: '1',
    content: 'Item 1',
    children: [
      {
        id: '1.1',
        content: 'Item 1.1',
        children: [
          {
            id: '1.1.1',
            content: 'Item 1.1.1',
          },
          {
            id: '1.1.2',
            content: 'Item 1.1.2',
          },
        ],
      },
      {
        id: '1.2',
        content: 'Item 1.2',
        hasActions: true,
        details: 'us-east-1',
      },
      {
        id: '1.3',
        content: 'Item 1.3',
        hasActions: true,
        children: [
          {
            id: '1.3.1',
            content: 'Item 1.3.1',
            hasActions: true,
          },
          {
            id: '1.3.2',
            content: 'Item 1.3.2',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    content: 'Item 2',
    hasActions: true,
    details: 'us-east-1',
  },
  {
    id: '3',
    content: 'Item 3',
    hasActions: true,
    children: [
      {
        id: '3.1',
        content: 'Item 3.1',
      },
    ],
  },
  {
    id: '4',
    content: (
      <SpaceBetween direction="horizontal" size="s">
        <span>Item 4 but imagine this is a longer text</span>
        <SpaceBetween direction="horizontal" size="xxs">
          <Badge color="red">1</Badge>
          <Badge color="blue">1</Badge>
          <Badge color="green">3</Badge>
        </SpaceBetween>
      </SpaceBetween>
    ),
    announcementLabel: 'Item 4 but imagine this is a longer text',
    hasActions: true,
    details: 'Some random description regarding the item and it is a bit long too',
    children: [
      {
        id: '4.1',
        content: 'Item 4.1',
        details: 'This item is an end node',
      },
      {
        id: '4.2',
        content: 'Item 4.2',
        children: [
          {
            id: '4.2.1',
            content: 'Item 4.2.1',
          },
          {
            id: '4.2.2',
            content: 'Item 4.2.2',
            details: 'This item has a single child',
            children: [
              {
                id: '4.2.2.1',
                content: 'Item 4.2.2.1',
              },
            ],
          },
        ],
      },
      {
        id: '4.3',
        content: 'Item 4.3',
      },
    ],
  },

  {
    id: '5',
    content: 'Item 5',
    details: 'This item is on level 1',
  },
  {
    id: '6',
    content: progressiveStepContent,
    announcementLabel: 'Checked 5 nodes',
    hideIcon: true,
    hasActions: true,
    children: [
      {
        id: '6.1',
        content: progressiveStepItemsContent[0],
        hideIcon: true,
      },
      {
        id: '6.2',
        content: progressiveStepItemsContent[1],
        hideIcon: true,
      },
      {
        id: '6.3',
        content: progressiveStepItemsContent[2],
        hideIcon: true,
      },
      {
        id: '6.4',
        content: progressiveStepItemsContent[3],
        hideIcon: true,
      },
    ],
  },
  {
    id: '7',
    content: 'Item 7',
  },
];
