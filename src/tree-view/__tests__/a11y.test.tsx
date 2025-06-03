// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';

interface Item {
  id: string;
  title: string;
  items?: Item[];
}

const defaultItems: Item[] = [
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

const defaultProps: TreeViewProps<Item> = {
  items: defaultItems,
  getItemId: item => item.id,
  getItemChildren: item => item.items,
  renderItem: item => ({
    content: item.title,
  }),
};

function renderTreeView(props: Partial<TreeViewProps<Item>> = {}) {
  const { container } = render(<TreeView {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findTreeView()!;
  return { wrapper };
}

function renderTreeViewWithI18NProvider(props: Partial<TreeViewProps<Item>> = {}) {
  const { container } = render(
    <TestI18nProvider
      messages={{
        'tree-view': {
          'i18nStrings.expandButtonLabel': 'Expand item',
          'i18nStrings.collapseButtonLabel': 'Collapse item',
        },
      }}
    >
      <TreeView {...defaultProps} {...props} />
    </TestI18nProvider>
  );
  const wrapper = createWrapper(container).findTreeView()!;
  return { wrapper };
}

test('sets aria-label', () => {
  const ariaLabel = 'This is the aria label for this tree view';
  const { wrapper } = renderTreeView({ ariaLabel });

  expect(wrapper.find('[role=tree]')!.getElement().getAttribute('aria-label')).toEqual(ariaLabel);
});

test('sets aria-expanded on expandable items', () => {
  const { wrapper } = renderTreeView();

  expect(wrapper.findItemById('1')!.getElement().getAttribute('aria-expanded')).toEqual('false');
  wrapper.findItemById('1')!.findItemToggle()!.getElement().click();
  expect(wrapper.findItemById('1')!.getElement().getAttribute('aria-expanded')).toEqual('true');

  expect(wrapper.findItemById('2')!.getElement().getAttribute('aria-expanded')).toBeNull();
});

test('i18n provider adds label to expand/collapse toggle', () => {
  const { wrapper } = renderTreeViewWithI18NProvider();

  const collapsedItem = wrapper.findItemById('1', { expanded: false })!;
  expect(collapsedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Expand item');

  collapsedItem.findItemToggle()!.getElement().click();
  const expandedItem = wrapper.findItemById('1', { expanded: true })!;
  expect(expandedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Collapse item');
});

test('i18nStrings adds custom label to expand/collapse toggle', () => {
  const { wrapper } = renderTreeViewWithI18NProvider({
    i18nStrings: {
      expandButtonLabel: item => `Expand ${item.title}`,
      collapseButtonLabel: item => `Collapse ${item.title}`,
    },
  });

  const collapsedItem = wrapper.findItemById('1', { expanded: false })!;
  expect(collapsedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Expand Item 1');

  collapsedItem.findItemToggle()!.getElement().click();
  const expandedItem = wrapper.findItemById('1', { expanded: true })!;
  expect(expandedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Collapse Item 1');
});

test('correct aria-level is set', () => {
  const { wrapper } = renderTreeView();

  const rootLevelItem = wrapper.findItemById('1')!;
  rootLevelItem.findItemToggle()!.getElement().click();

  const level1Item = wrapper.findItemById('1.2')!;
  level1Item.findItemToggle()!.getElement().click();

  const level2Item = wrapper.findItemById('1.2.1')!;

  expect(rootLevelItem.getElement().getAttribute('aria-level')).toBeNull(); // root level shouldn't have aria-level
  expect(level1Item.getElement().getAttribute('aria-level')).toEqual('1');
  expect(level2Item.getElement().getAttribute('aria-level')).toEqual('2');
});
