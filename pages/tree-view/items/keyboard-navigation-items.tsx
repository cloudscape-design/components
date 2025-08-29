// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Link from '~components/link';
import Popover from '~components/popover';
import { TreeViewProps } from '~components/tree-view';

import { Actions } from '../common';

export interface Item extends TreeViewProps.TreeItem {
  id: string;
  children?: Item[];
  hasToggleButton?: boolean;
}

export const cdsItems: Item[] = [
  {
    id: 'cds1',
    content: (
      <>
        Item 1{' '}
        <Popover size="small" content="popover content" dismissButton={false}>
          popover
        </Popover>
      </>
    ),
    actions: <Actions actionType="button-dropdown" itemLabel="Item 1" />,
    announcementLabel: 'Item 1 popover',
  },
  {
    id: 'cds2',
    content: (
      <>
        Item 2{' '}
        <Popover
          size="medium"
          content={
            <>
              Popover content and a <Button>button</Button>
            </>
          }
        >
          popover with dismiss button
        </Popover>
      </>
    ),
    actions: <Actions actionType="button-group" itemLabel="Item 2" />,
    announcementLabel: 'Item 2 popover with dismiss button',
    children: [
      {
        id: 'cds2.1',
        content: 'Item 2.1',
        actions: <Actions actionType="button-group" itemLabel="Item 2.1" />,
      },
      {
        id: 'cds2.2',
        content: 'Item 2.2',
        actions: <Actions actionType="button-group" itemLabel="Item 2.2" />,
      },
    ],
  },
  {
    id: 'cds3',
    content: 'Item 3',
    hasToggleButton: true,
    actions: <Actions actionType="inline-button-dropdown" itemLabel="Item 3" />,
    announcementLabel: 'Item 3',
    children: [
      {
        id: 'cds3.1',
        content: 'Item 3.1',
        actions: <Actions actionType="inline-button-dropdown" itemLabel="Item 3.1" />,
        announcementLabel: 'Item 3.1',
        hasToggleButton: true,
      },
      {
        id: 'cds3.2',
        content: 'Item 3.2',
        actions: <Actions actionType="inline-button-dropdown" itemLabel="Item 3.2" />,
        announcementLabel: 'Item 3.2',
        hasToggleButton: true,
        children: [
          {
            id: 'cds3.2.1',
            content: 'Item 3.2.1',
            actions: <Actions actionType="button-group" itemLabel="Item 3.2.1" />,
          },
          {
            id: 'cds3.2.2',
            content: 'Item 3.2.2',
            actions: <Actions actionType="button-group" itemLabel="Item 3.2.2" />,
          },
          {
            id: 'cds3.2.3',
            content: 'Item 3.2.3',
            actions: <Actions actionType="button-group" itemLabel="Item 3.2.3" />,
          },
        ],
      },
    ],
  },
  {
    id: 'cds4',
    content: 'Item 4',
    secondaryContent: (
      <>
        Description with{' '}
        <Link href="#" variant="primary">
          link
        </Link>
      </>
    ),
    children: [
      {
        id: 'cds4.1',
        content: 'Item 4.1',
      },
    ],
  },
  {
    id: 'cds5',
    content: 'Item 5',
    actions: <Actions actionType="button-group" itemLabel="Item 3.2.1" />,
    children: [
      {
        id: 'cds5.1',
        content: 'Item 5.1',
      },
    ],
  },
];

export const nonCdsItems: Item[] = [
  {
    id: 'non-cds1',
    content: 'Item 1',
    actions: <button>Action</button>,
    children: [
      {
        id: 'non-cds1.1',
        content: 'Item 1.1',
        actions: <button>Action</button>,
      },
      {
        id: 'non-cds1.2',
        content: 'Item 1.2',
        actions: <button>Action</button>,
      },
    ],
  },
  {
    id: 'non-cds2',
    content: (
      <>
        Item 2 with <a href="#">link</a>
      </>
    ),
    actions: <button>Action</button>,
    announcementLabel: 'Item 2 with link',
    children: [
      {
        id: 'non-cds2.1',
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
    id: 'non-cds3',
    content: 'Item 3',
    actions: (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        <button>Action 1</button>
        <button>Action 2</button>
      </div>
    ),
  },
];
