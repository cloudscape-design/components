// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';

interface Item {
  id: string;
  children?: Item[];
}

const items: Item[] = [
  { id: 'a', children: [{ id: 'a.1' }] },
  { id: 'b', children: [{ id: 'b.1' }] },
  { id: 'c', children: [{ id: 'c.1' }] },
];

const defaultProps: TreeViewProps = {
  items,
  renderItem: (item: Item) => ({ content: item.id }),
  getItemId: (item: Item) => item.id,
  getItemChildren: (item: Item) => item.children,
  icons: { expandToggle: ({ expanded }) => <span data-testid={expanded ? 'expanded' : 'collapsed'} /> },
};

it('renders the custom expand toggle with the current state', () => {
  const { queryAllByTestId } = render(<TreeView {...defaultProps} expandedItems={['a']} />);
  expect(queryAllByTestId('expanded')).toHaveLength(1);
  expect(queryAllByTestId('collapsed')).toHaveLength(2);
});

it('ignores the deprecated renderItemToggleIcon when icons.expandToggle is set', () => {
  const { queryAllByTestId } = render(
    <TreeView {...defaultProps} renderItemToggleIcon={() => <span data-testid="per-item" />} />
  );
  expect(queryAllByTestId('collapsed')).toHaveLength(3);
  expect(queryAllByTestId('per-item')).toHaveLength(0);
});
