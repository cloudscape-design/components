// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '../../../lib/components/button';
import ButtonGroup from '../../../lib/components/button-group';
import Link from '../../../lib/components/link';
import Popover from '../../../lib/components/popover';
import { TreeViewProps } from '../../../lib/components/tree-view';

export interface Item {
  id: string;
  title: string;
  items?: Item[];
}

export const items: Item[] = [
  {
    id: '1',
    title: 'Item 1',
    items: [
      {
        id: '1.1',
        title: 'Item 1.1',
      },
      {
        id: '1.2',
        title: 'Item 1.2',
        items: [
          {
            id: '1.2.1',
            title: 'Item 1.2.1',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Item 2',
  },
];

export const defaultProps: TreeViewProps<Item> = {
  items: items,
  getItemId: item => item.id,
  getItemChildren: item => item.items,
  renderItem: item => ({
    content: item.title,
  }),
};

export interface KeyboardNavigationItem extends TreeViewProps.TreeItem {
  id: string;
  children?: KeyboardNavigationItem[];
}

export const keyboardNavigationItems: KeyboardNavigationItem[] = [
  {
    id: '1-button-actions',
    content: 'Item 1',
    actions: <Button variant="inline-icon" iconName="star" ariaLabel="Item 1 actions"></Button>,
    children: [
      {
        id: '1.1-only-text',
        content: 'Item 1.1',
      },
      {
        id: '1.2-only-text',
        content: 'Item 1.2',
      },
    ],
  },
  {
    id: '2-button-group',
    content: 'Item 2',
    actions: (
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
            type: 'icon-toggle-button',
            id: 'favorite',
            text: 'Favorite',
            pressed: false,
            iconName: 'star',
            pressedIconName: 'star-filled',
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
        ]}
        onItemClick={() => {}}
        ariaLabel="Item 2 actions"
      />
    ),
    children: [
      {
        id: '2.1-only-text',
        content: 'Item 2.1',
      },
      {
        id: '2.2-only-text',
        content: 'Item 2.2',
      },
      {
        id: '2.3-only-text',
        content: 'Item 2.3',
      },
      {
        id: '2.4-only-text',
        content: 'Item 2.4',
      },
    ],
  },
  {
    id: '3-popover',
    content: <Popover content="popover content">Item 3 popover</Popover>,
    actions: <Button variant="inline-icon" iconName="star" ariaLabel="Item 3 actions" disabled={true}></Button>,
    announcementLabel: 'Item 3',
  },
  {
    id: '4-multiple-focusables',
    content: 'Item 4',
    secondaryContent: <Link href="#">link</Link>,
    actions: <Button variant="inline-icon" iconName="star" ariaLabel="Item 4 actions"></Button>,
    children: [
      {
        id: '4.1-only-text',
        content: 'Item 4.1',
      },
    ],
  },
  {
    id: '5-only-text',
    content: 'Item 5',
    children: [
      {
        id: '5.1-only-text',
        content: 'Item 5.1',
      },
      {
        id: '5.2-only-text',
        content: 'Item 5.2',
      },
      {
        id: '5.3-only-text',
        content: 'Item 5.3',
      },
      {
        id: '5.4-only-text',
        content: 'Item 5.4',
      },
    ],
  },
];
