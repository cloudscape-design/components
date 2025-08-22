// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { TreeViewProps } from '~components';
import Box from '~components/box';
import Button from '~components/button';
import Icon from '~components/icon';
import Link from '~components/link';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

import { Actions } from '../common';

export interface Item extends TreeViewProps.TreeItem {
  id: string;
  children?: Item[];
  hasToggleButton?: boolean;
}

export const cdsItems: Item[] = [
  {
    id: '1',
    content: (
      <>
        Item 1{' '}
        <Popover size="small" content="popover content" dismissButton={false}>
          popover
        </Popover>
      </>
    ),
    // actions: <Actions actionType="button-dropdown" itemLabel="Item 1" />,
    announcementLabel: 'Item 1 popover',
  },
  {
    id: '2',
    content: (
      <>
        Item 2{' '}
        {/* <Popover
          size="medium"
          content={
            <>
              Popover content and a <Button>button</Button>
            </>
          }
        >
          popover with dismiss button
        </Popover> */}
      </>
    ),
    actions: <Actions actionType="button-group" itemLabel="Item 2" />,
    announcementLabel: 'Item 2 popover with dismiss button',
    children: [
      {
        id: '2.1',
        content: 'Item 2.1',
        // actions: <Actions actionType="button-group" itemLabel="Item 2.1" />,
      },
      {
        id: '2.2',
        content: 'Item 2.2',
        // actions: <Actions actionType="button-group" itemLabel="Item 2.1" />,
      },
    ],
  },
  {
    id: '3',
    content: 'Item 3',
    hasToggleButton: true,
    // actions: <Actions actionType="inline-button-dropdown" itemLabel="Item 3" />,
    announcementLabel: 'Item 3',
    children: [
      {
        id: '3.1',
        content: 'Item 3.1',
        // actions: <Actions actionType="inline-button-dropdown" itemLabel="Item 3.1" />,
        announcementLabel: 'Item 3.1',
        hasToggleButton: true,
      },
      {
        id: '3.2',
        content: 'Item 3.2',
        // actions: <Actions actionType="inline-button-dropdown" itemLabel="Item 3.2" />,
        announcementLabel: 'Item 3.2',
        hasToggleButton: true,
        children: [
          {
            id: '3.2.1',
            content: 'Item 3.2.1',
            // actions: <Actions actionType="button-group" itemLabel="Item 2.1" />,
          },
        ],
      },
    ],
  },
  {
    id: '4',
    content: 'Item 4',
    secondaryContent: (
      <>
        Description with <Link href="#">link</Link>
      </>
    ),
    children: [
      {
        id: '4.1',
        content: 'Item 4.1',
      },
    ],
  },
];

export const nonCdsItems: Item[] = [
  {
    id: '1',
    content: 'Item 1',
    actions: <button>Action</button>,
    children: [
      {
        id: '1.1',
        content: 'Item 1.1',
        actions: <button>Action</button>,
      },
      {
        id: '1.2',
        content: 'Item 1.2',
        actions: <button>Action</button>,
      },
    ],
  },
  {
    id: '2',
    content: (
      <>
        Item 2 with <a href="#">link</a>
      </>
    ),
    actions: <button>Action</button>,
    announcementLabel: 'Item 2 with link',
    children: [
      {
        id: '2.1',
        content: (
          <>
            Item 2.1 with <a href="#">link</a>
          </>
        ),
        announcementLabel: 'Item 2.1 with link',
      },
    ],
  },
  {
    id: '3',
    content: 'Item 3',
    actions: (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        <button>Action 1</button>
        <button>Action 2</button>
      </div>
    ),
  },
];
