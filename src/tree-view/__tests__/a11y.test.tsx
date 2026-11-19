// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';
import { KeyCode } from '../../internal/keycode';
import { defaultProps, Item, itemsWithFocusables } from './items';

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

  const itemToggle = wrapper.findItemById('1')!.findItemToggle()!.getElement();

  expect(itemToggle).toHaveAccessibleName('Expand item Item 1');
  itemToggle.click(); // expand
  expect(itemToggle).toHaveAccessibleName('Collapse item Item 1');
});

test('i18nStrings adds custom label to expand/collapse toggle', () => {
  const { wrapper } = renderTreeViewWithI18NProvider({
    i18nStrings: {
      expandButtonLabel: item => `Expand ${item.title}`,
      collapseButtonLabel: item => `Collapse ${item.title}`,
    },
  });

  const itemToggle = wrapper.findItemById('1')!.findItemToggle()!.getElement();

  expect(itemToggle).toHaveAccessibleName('Expand Item 1 Item 1'); // i18n string + item content
  itemToggle.click(); // expand
  expect(itemToggle).toHaveAccessibleName('Collapse Item 1 Item 1');
});

test('announcementLabel is added to aria-label', () => {
  const { wrapper } = renderTreeViewWithI18NProvider({
    renderItem: item => ({ content: item.title, announcementLabel: 'Test announcement label' }),
  });

  const itemToggle = wrapper.findItemById('1')!.findItemToggle()!.getElement();

  expect(itemToggle).toHaveAccessibleName('Expand item Test announcement label'); // i18n string + item content
  itemToggle.click(); // expand
  expect(itemToggle).toHaveAccessibleName('Collapse item Test announcement label');
});

test('only expand label is added to aria-label if content is not string and announcementLabel is not provided', () => {
  const { wrapper } = renderTreeViewWithI18NProvider({
    renderItem: item => ({ content: <>{item.title}</> }),
  });

  const itemToggle = wrapper.findItemById('1')!.findItemToggle()!.getElement();

  expect(itemToggle).toHaveAccessibleName('Expand item');
  itemToggle.click(); // expand
  expect(itemToggle).toHaveAccessibleName('Collapse item');
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

describe('ariaRole', () => {
  test('uses tree semantics by default', () => {
    renderTreeView({ ariaLabel: 'Files', expandedItems: ['1'] });

    const tree = screen.getByRole('tree', { name: 'Files' });
    expect(within(tree).getAllByRole('treeitem').length).toBeGreaterThan(0);
    expect(within(tree).getByRole('group', { name: 'Item 1.1' })).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });

  test('renders nested lists with explicit list roles when set to "list"', () => {
    const { wrapper } = renderTreeView({ ariaRole: 'list', ariaLabel: 'Files', expandedItems: ['1'] });

    expect(screen.queryByRole('tree')).toBeNull();
    expect(screen.queryByRole('treeitem')).toBeNull();
    expect(screen.queryByRole('group')).toBeNull();

    const list = screen.getByRole('list', { name: 'Files' });
    const nestedList = within(list).getAllByRole('list')[0];
    expect(within(nestedList).getAllByRole('listitem').length).toBe(2);
    // Explicit roles are required: Safari drops list semantics from lists styled with `list-style: none`.
    expect(list).toHaveAttribute('role', 'list');
    expect(nestedList).toHaveAttribute('role', 'list');

    for (const item of wrapper.findItems()) {
      expect(item.getElement().tagName).toBe('LI');
      expect(item.getElement()).toHaveAttribute('role', 'listitem');
      expect(item.getElement()).not.toHaveAttribute('aria-expanded');
      expect(item.getElement()).not.toHaveAttribute('aria-level');
    }
  });

  test('keeps the expanded state on the toggle button when set to "list"', () => {
    const { wrapper } = renderTreeView({ ariaRole: 'list' });

    const toggle = wrapper.findItemById('1')!.findItemToggle()!.getElement();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    toggle.click();
    expect(wrapper.findItemById('1')!.findItemToggle()!.getElement()).toHaveAttribute('aria-expanded', 'true');
  });

  test('puts all toggles and actions in the tab order when set to "list"', () => {
    const renderWithFocusables = (ariaRole: TreeViewProps.AriaRole) =>
      render(
        <TreeView
          ariaRole={ariaRole}
          items={itemsWithFocusables}
          getItemId={item => item.id}
          getItemChildren={item => item.children}
          renderItem={item => ({ content: item.content, actions: item.actions })}
        />
      );

    // In tree mode only one element is in the tab order (roving tabindex).
    const { unmount } = renderWithFocusables('tree');
    expect(
      screen
        .getAllByRole('button')
        .filter(button => !button.closest('[role="toolbar"]'))
        .some(button => button.getAttribute('tabindex') === '-1')
    ).toBe(true);
    unmount();

    renderWithFocusables('list');
    // Button group is a toolbar that manages its own roving tabindex, so its buttons are excluded.
    const buttons = screen.getAllByRole('button').filter(button => !button.closest('[role="toolbar"]'));
    expect(buttons.length).toBeGreaterThan(1);
    for (const button of buttons) {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    }
  });

  test('does not move focus with arrow keys when set to "list"', () => {
    const { wrapper } = renderTreeView({ ariaRole: 'list' });

    const toggle = wrapper.findItemById('1')!.findItemToggle()!.getElement();
    toggle.focus();
    fireEvent.keyDown(toggle, { keyCode: KeyCode.down });
    fireEvent.keyDown(toggle, { keyCode: KeyCode.right });

    expect(document.activeElement).toBe(toggle);
  });
});
