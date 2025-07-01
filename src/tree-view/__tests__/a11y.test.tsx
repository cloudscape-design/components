// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';
import { defaultProps, Item } from './common';

import styles from '../../../lib/components/tree-view/styles.css.js';

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

  expect(wrapper.findByClassName(styles.tree)!.getElement().getAttribute('aria-label')).toEqual(ariaLabel);
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
  expect(collapsedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Expand item Item 1');

  collapsedItem.findItemToggle()!.getElement().click();
  const expandedItem = wrapper.findItemById('1', { expanded: true })!;
  expect(expandedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Collapse item Item 1');
});

test('i18nStrings adds custom label to expand/collapse toggle', () => {
  const { wrapper } = renderTreeViewWithI18NProvider({
    i18nStrings: {
      expandButtonLabel: item => `Expand ${item.title}`,
      collapseButtonLabel: item => `Collapse ${item.title}`,
    },
  });

  const collapsedItem = wrapper.findItemById('1', { expanded: false })!;
  expect(collapsedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Expand Item 1 Item 1'); // i18n string + item content

  collapsedItem.findItemToggle()!.getElement().click();
  const expandedItem = wrapper.findItemById('1', { expanded: true })!;
  expect(expandedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Collapse Item 1 Item 1');
});

test('announcementLabel is added to aria-label', () => {
  const { wrapper } = renderTreeViewWithI18NProvider({
    renderItem: item => ({ content: item.title, announcementLabel: 'Test announcement label' }),
  });

  const collapsedItem = wrapper.findItemById('1', { expanded: false })!;
  expect(collapsedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Expand item Test announcement label'); // i18n string + item content

  collapsedItem.findItemToggle()!.getElement().click();
  const expandedItem = wrapper.findItemById('1', { expanded: true })!;
  expect(expandedItem.findItemToggle()!.getElement()).toHaveAccessibleName('Collapse item Test announcement label');
});

test('correct aria-level is set', () => {
  const { wrapper } = renderTreeView();

  const rootLevelItem = wrapper.findItemById('1')!;
  rootLevelItem.findItemToggle()!.getElement().click();

  const level2Item = wrapper.findItemById('1.2')!;
  level2Item.findItemToggle()!.getElement().click();

  const level3Item = wrapper.findItemById('1.2.1')!;

  expect(rootLevelItem.getElement().getAttribute('aria-level')).toEqual('1');
  expect(level2Item.getElement().getAttribute('aria-level')).toEqual('2');
  expect(level3Item.getElement().getAttribute('aria-level')).toEqual('3');
});
