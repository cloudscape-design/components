// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { Checkbox } from '~components';
import Badge from '~components/badge';
import Box from '~components/box';
import Container from '~components/container';
import Grid from '~components/grid';
import Icon from '~components/icon';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TreeView, { TreeViewProps } from '~components/tree-view';

import ScreenshotArea from '../utils/screenshot-area';
import { Actions } from './common';

import styles from './styles.scss';

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
  actionType?: 'button-group' | 'button-dropdown' | 'inline-button-dropdown';
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
        actionType: 'button-group',
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
    hasActions: true,
    actionType: 'inline-button-dropdown',
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
    details: 'This item is on level 0',
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
  const [useCustomIcon, setUseCustomIcon] = useState(false);
  const [useCaretIconWithSlowerAnimation, setUseCaretIconWithSlowerAnimation] = useState(false);

  const renderItemToggleIcon = ({ expanded }: TreeViewProps.ItemToggleRenderIconData) => {
    if (useCustomIcon) {
      return <Icon size="small" name={expanded ? 'treeview-collapse' : 'treeview-expand'} ariaLabel="Toggle" />;
    }

    if (useCaretIconWithSlowerAnimation) {
      return (
        <Icon
          size="small"
          name={'caret-down-filled'}
          className={clsx(styles.animation, expanded && styles['animation-expanded'])}
        />
      );
    }
  };

  return (
    <ScreenshotArea>
      <h1>Basic tree view</h1>

      <Checkbox checked={useCustomIcon} onChange={({ detail }) => setUseCustomIcon(detail.checked)}>
        Use custom icon
      </Checkbox>
      <Checkbox
        checked={useCaretIconWithSlowerAnimation}
        onChange={({ detail }) => setUseCaretIconWithSlowerAnimation(detail.checked)}
      >
        Use caret icon with slower animation
      </Checkbox>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 10, xxs: 12 } }]}>
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
                secondaryContent: item.details && <Box color="text-status-inactive">{item.details}</Box>,
                actions: item.hasActions ? <Actions actionType={item.actionType} /> : undefined,
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
            i18nStrings={{
              expandButtonLabel: () => 'Expand item',
              collapseButtonLabel: () => 'Collapse item',
            }}
            renderItemToggleIcon={renderItemToggleIcon}
          />
        </Container>
      </Grid>

      <div style={{ marginTop: '10px' }}>Expanded items: {expandedItems.map(id => `Item ${id}`).join(', ')}</div>
    </ScreenshotArea>
  );
}
