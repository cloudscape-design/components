// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { ButtonDropdown } from '~components';
import Badge from '~components/badge';
import Box from '~components/box';
import ButtonGroup from '~components/button-group';
import Container from '~components/container';
import Icon from '~components/icon';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TreeView from '~components/tree-view';

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
}

const items: Item[] = [
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
      },
      {
        id: '1.3',
        content: 'Item 1.3',
        details: 'us-east-1',
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
  },
  {
    id: '3',
    content: 'Item 3',
    children: [
      {
        id: '3.1',
        content: 'Item 3.1',
      },
    ],
  },
  {
    id: '4',
    content: <RdsAccessRoleTreeItemContent />,
    hideIcon: true,
    children: [
      {
        id: '4.1',
        content: 'Item 4.1',
        children: [
          {
            id: '4.1.1',
            content: 'Item 4.1.1',
          },
          {
            id: '4.1.2',
            content: 'Item 4.1.2',
            details: 'us-east-1',
            children: [
              {
                id: '4.1.2.1',
                content: 'Item 4.1.2.1',
              },
            ],
          },
          {
            id: '4.1.3',
            content: 'Item 4.1.3',
            details: 'us-east-1',
            children: [
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

function Actions(
  { actionType }: { actionType?: 'button-group' | 'button-dropdown' } = { actionType: 'button-dropdown' }
) {
  const [pressed, setPressed] = useState(false);

  if (actionType === 'button-group') {
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

  return (
    <ButtonDropdown
      items={[
        { id: 'start', text: 'Start' },
        { id: 'stop', text: 'Stop', disabled: true },
        {
          id: 'hibernate',
          text: 'Hibernate',
          disabled: true,
        },
        { id: 'reboot', text: 'Reboot', disabled: true },
        { id: 'terminate', text: 'Terminate' },
      ]}
      ariaLabel="Control instance"
      variant="icon"
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
          <Actions actionType="button-group" />
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

export default function BasicTreeView() {
  const [expandedItems, setExpandedItems] = useState<Array<string>>(['1', '4.1']);

  return (
    <>
      <h1>Basic tree view</h1>

      <Box padding="xl">
        <div style={{ width: '60%' }}>
          <Container>
            <TreeView
              ariaLabel="Random data tree view"
              items={items}
              renderItem={item => {
                return {
                  icon: item.hideIcon ? undefined : (
                    <Icon name={expandedItems.includes(item.id) ? 'folder-open' : 'folder'} ariaLabel="folder" />
                  ),
                  content: item.content,
                  secondaryContent: <Box color="text-status-inactive">{item.details}</Box>,
                  actions: item.hasActions ? <Actions /> : undefined,
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
          </Container>
        </div>

        <div style={{ marginTop: '10px' }}>Expanded items: {expandedItems.map(id => `Item ${id}`).join(', ')}</div>
      </Box>
    </>
  );
}
