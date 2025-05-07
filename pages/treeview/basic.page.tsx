// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import ButtonGroup from '~components/button-group';
import Container from '~components/container';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Treeview, { TreeviewProps } from '~components/treeview';

const progressiveStepContent = (
  <div style={{ display: 'flex' }}>
    <StatusIndicator type="warning">Checked 5 nodes</StatusIndicator>
    <div style={{ borderLeft: '1px solid grey', marginLeft: '8px', marginRight: '8px' }} />
    <SpaceBetween direction="horizontal" size="s">
      <StatusIndicator type="warning">1</StatusIndicator>
      <StatusIndicator type="in-progress">1</StatusIndicator>
      <StatusIndicator type="success">2</StatusIndicator>
    </SpaceBetween>
  </div>
);

const progressiveStepItemsContent = [
  <StatusIndicator key={'success-child'} type="success">
    node-17 (eksclu-node-12345)
  </StatusIndicator>,
  <StatusIndicator key={'loading-child'} type="loading">
    node-18 (eksclu-node-09876)
  </StatusIndicator>,
  <StatusIndicator key={'success-child-2'} type="success">
    node-19 (eksclu-node-ab123)
  </StatusIndicator>,
];

const items: TreeviewProps.TreeItem[] = [
  {
    id: '1',
    content: 'Item 1',
    items: [
      {
        id: '1.1',
        content: 'Item 1.1',
        items: [
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
      },
      {
        id: '1.3',
        content: 'Item 1.3',
        details: <Box color="text-status-inactive">us-east-1</Box>,
        actions: <Actions />,
        items: [
          {
            id: '1.3.1',
            content: 'Item 1.3.1',
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
  },
  {
    id: '3',
    content: 'Item 3',
    items: [
      {
        id: '3.1',
        content: 'Item 3.1',
      },
    ],
  },
  {
    id: '4',
    content: <RdsAccessRoleTreeItemContent />,
    items: [
      {
        id: '4.1',
        content: 'Item 4.1',
        items: [
          {
            id: '4.1.1',
            content: 'Item 4.1.1',
          },
          {
            id: '4.1.2',
            content: 'Item 4.1.2',
            details: <Box color="text-status-inactive">us-east-1</Box>,
            items: [
              {
                id: '4.1.2.1',
                content: 'Item 4.1.2.1',
              },
            ],
          },
          {
            id: '4.1.3',
            content: 'Item 4.1.3',
            items: [
              {
                id: '4.1.3.1',
                content: 'Item 4.1.3.1',
              },
              {
                id: '4.1.3.2',
                content: 'Item 4.1.3.2',
              },
              {
                id: '4.1.3.3',
                content: 'Item 4.1.3.3',
              },
            ],
          },
        ],
      },
      {
        id: '4.2',
        content: 'Item 4.2',
      },
    ],
  },
  {
    id: '5',
    content: 'Item 5',
  },
  {
    id: '6',
    content: progressiveStepContent,
    items: [
      {
        id: '6.1',
        content: progressiveStepItemsContent[0],
      },
      {
        id: '6.2',
        content: progressiveStepItemsContent[1],
      },
      {
        id: '6.3',
        content: progressiveStepItemsContent[2],
      },
    ],
  },
  {
    id: '7',
    content: 'Item 7',
  },
];

function Actions() {
  const [pressed, setPressed] = useState(false);

  return (
    <ButtonGroup
      variant="icon"
      items={[
        {
          id: 'settings',
          iconName: 'settings',
          type: 'icon-button',
          text: 'Settings',
        },
        {
          id: 'menu',
          type: 'menu-dropdown',
          text: 'Menu',
          items: [
            { id: 'start', text: 'Start' },
            { id: 'stop', text: 'Stop', disabled: true },
            {
              id: 'hibernate',
              text: 'Hibernate',
              disabled: true,
            },
            { id: 'reboot', text: 'Reboot', disabled: true },
            { id: 'terminate', text: 'Terminate' },
          ],
        },
        {
          type: 'icon-toggle-button',
          id: 'favorite',
          text: 'Favorite',
          pressed: pressed,
          iconName: 'star',
          pressedIconName: 'star-filled',
        },
      ]}
      onItemClick={({ detail }) => {
        if (detail.id === 'favorite') {
          setPressed(!pressed);
        }
      }}
    />
  );
}

function RdsAccessRoleTreeItemContent() {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
          <Icon name="user-profile-active" />
          <span>RdsAccessRole</span>
          <Badge color="red">1</Badge>
          <Badge color="blue">1</Badge>
          <Badge color="green">3</Badge>
        </div>

        <div>
          <Actions />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Box color="text-status-inactive">
          <Icon name="globe" />
          us-east-1
        </Box>
        <Box color="text-status-inactive">
          <Icon name="ticket" />
          prod-eng-xyz-zip-f
        </Box>
      </div>
    </div>
  );
}

export default function BasicTreeview() {
  const [expandedItems, setExpandedItems] = useState<Array<string>>(['1', '4.1']);

  return (
    <>
      <h1>Basic treeview</h1>

      <Box padding="xl">
        <div style={{ width: '60%' }}>
          <Container>
            <Treeview
              items={items}
              onExpandableItemToggle={({ detail }: any) => {
                if (detail.expanded) {
                  return setExpandedItems(prev => [...prev, detail.id]);
                } else {
                  return setExpandedItems(prev => prev.filter(id => id !== detail.id));
                }
              }}
              expandedItems={expandedItems}
            />
          </Container>
        </div>

        <div style={{ marginTop: '10px' }}>Expanded items: {expandedItems.map(id => `Item ${id}`).join(', ')}</div>
      </Box>
    </>
  );
}
