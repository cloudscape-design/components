// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
