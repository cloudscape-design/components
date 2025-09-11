// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';
import { KeyCode } from '../../internal/keycode';
import { KeyboardNavigationProcessor, KeyboardNavigationProvider } from '../keyboard-navigation';
import { KeyboardNavigationItem as Item, keyboardNavigationItems as items } from './items';

const TestTreeView = (props: Partial<TreeViewProps<Item>> = {}) => (
  <TreeView
    items={items}
    getItemId={item => item.id}
    getItemChildren={item => item.children}
    renderItem={item => ({
      content: item.content,
      secondaryContent: item.secondaryContent,
      actions: item.actions,
      announcementLabel: item.announcementLabel,
    })}
    {...props}
  />
);

function renderTreeView(props: Partial<TreeViewProps<Item>> = {}) {
  const { container, rerender } = render(<TestTreeView {...props} />);
  const wrapper = createWrapper(container).findTreeView()!;
  return { container, treeView: container.querySelector('[role="tree"]')!, wrapper, rerender };
}

function readActiveElement() {
  return document.activeElement ? formatElement(document.activeElement) : null;
}

function formatElement(element: Element) {
  const tagName = element.tagName.toUpperCase();
  const text = element.textContent || element.getAttribute('aria-label') || element.getAttribute('data-testid') || '';
  return `${tagName}[${text}]`;
}

const treeItemIndexAttribute = 'data-awsui-tree-item-index';

test('tree-items have flat indices', () => {
  const { wrapper } = renderTreeView();

  const firstRootLevelItem = wrapper.findItemById('1-button-actions')!;
  expect(firstRootLevelItem.getElement().getAttribute(treeItemIndexAttribute)).toBe('0');

  const secondRootLevelItem = wrapper.findItemById('2-button-group')!;
  expect(secondRootLevelItem.getElement().getAttribute(treeItemIndexAttribute)).toBe('1');

  // expand first item to reveal children
  firstRootLevelItem.findItemToggle()!.getElement().click();
  // now the first children should get second root level item's index
  const children = firstRootLevelItem.findChildItems()!;
  expect(children[0].getElement().getAttribute(treeItemIndexAttribute)).toBe('1');
  expect(children[1].getElement().getAttribute(treeItemIndexAttribute)).toBe('2');

  // second root level item's index should be updated
  expect(secondRootLevelItem.getElement().getAttribute(treeItemIndexAttribute)).toBe('3');

  const allItems = wrapper.findItems();
  const lastRootLevelItem = allItems[allItems.length - 1];
  expect(lastRootLevelItem.getElement().getAttribute(treeItemIndexAttribute)).toBe(`${allItems.length - 1}`);
});

describe('KeyboardNavigationProvider', () => {
  test('does not throw when not initialized', () => {
    const navigation = new KeyboardNavigationProcessor({
      current: {
        updateFocusTarget: () => {},
        getFocusTarget: () => null,
        isRegistered: () => false,
      },
    });
    expect(() => navigation.getNextFocusTarget()).not.toThrow();
    expect(() => navigation.refresh()).not.toThrow();
    expect(() => navigation.cleanup()).not.toThrow();
  });

  test('throws no error when focusing on incorrect target', () => {
    function TestTreeView() {
      const treeViewRef = useRef<HTMLUListElement>(null);
      return (
        <KeyboardNavigationProvider getTreeView={() => treeViewRef.current}>
          <ul ref={treeViewRef} data-testid="tree-view">
            <li>
              <button tabIndex={0} data-testid="random-button">
                Random button
              </button>
            </li>
            <li>
              <svg focusable="false">
                <g tabIndex={0}>graphic</g>
              </svg>
            </li>
          </ul>
        </KeyboardNavigationProvider>
      );
    }

    const { container } = render(<TestTreeView />);

    const button = container.querySelector('button')!;
    const g = container.querySelector('g')!;

    button.focus();
    expect(button).toHaveFocus();

    g.focus();
    expect(g).toHaveFocus();
  });

  test('does not focus re-registered element if the focus is not within the tree-view anymore', () => {
    const { container, rerender } = render(
      <div>
        <TestTreeView />
        <button data-testid="outside-focus-target">outside</button>
      </div>
    );
    const wrapper = createWrapper(container).findTreeView()!;

    const firstToggle = wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement();
    const outsideButton = container.querySelector('[data-testid="outside-focus-target"]') as HTMLButtonElement;

    firstToggle.focus();
    expect(firstToggle).toHaveFocus();

    rerender(
      <div>
        <TestTreeView />
        <button data-testid="outside-focus-target">outside</button>
      </div>
    );
    expect(firstToggle).toHaveFocus();

    outsideButton.focus();
    expect(outsideButton).toHaveFocus();

    rerender(
      <div>
        <TestTreeView />
        <button data-testid="outside-focus-target">outside</button>
      </div>
    );
    expect(outsideButton).toHaveFocus();
  });
});

describe('Keyboard navigation', () => {
  test('up and down arrow keys - navigates between tree items', () => {
    const { treeView, wrapper } = renderTreeView();
    const firstToggle = wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement();

    // Focus on first toggle button
    firstToggle.focus();
    expect(readActiveElement()).toBe('BUTTON[Item 1]');

    // Navigate down
    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 2]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 3]');

    // Navigate up
    fireEvent.keyDown(treeView, { keyCode: KeyCode.up });
    expect(readActiveElement()).toBe('BUTTON[Item 2]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.up });
    expect(readActiveElement()).toBe('BUTTON[Item 1]');
  });

  test('up and down arrow keys - navigates between children and parent', () => {
    const { treeView, wrapper } = renderTreeView();
    const firstToggle = wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement();

    firstToggle.focus();
    firstToggle.click();

    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 1.1]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.up });
    expect(readActiveElement()).toBe('BUTTON[Item 1]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 1.2]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 2]');
  });

  test('up and down arrow keys - if focus is inside the tree-item it moves focus to tree-item toggle', () => {
    const { treeView, wrapper } = renderTreeView();
    const multipleFocusableToggle = wrapper.findItemById('4-multiple-focusables')!.findItemToggle()!.getElement();

    multipleFocusableToggle.focus();

    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('BUTTON[Item 4 actions]');

    // Focus back to toggle
    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 4]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.left });
    expect(readActiveElement()).toBe('A[link]');

    // Focus back to toggle
    fireEvent.keyDown(treeView, { keyCode: KeyCode.up });
    expect(readActiveElement()).toBe('BUTTON[Item 4]');
  });

  test('right and left arrow key - navigates between focusables in tree item content', () => {
    const { treeView, wrapper } = renderTreeView();
    const multipleFocusableToggle = wrapper.findItemById('4-multiple-focusables')!.findItemToggle()!.getElement();

    multipleFocusableToggle.focus();

    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('BUTTON[Item 4 actions]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('A[link]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.left });
    expect(readActiveElement()).toBe('BUTTON[Item 4 actions]');
  });

  test('right and left arrow key - focus is circular', () => {
    const { treeView, wrapper } = renderTreeView();
    const firstToggle = wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement();

    firstToggle.focus();

    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('BUTTON[Item 1 actions]');

    // Focus back to toggle
    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('BUTTON[Item 1]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.left });
    expect(readActiveElement()).toBe('BUTTON[Item 1 actions]');

    // Focus back to toggle
    fireEvent.keyDown(treeView, { keyCode: KeyCode.left });
    expect(readActiveElement()).toBe('BUTTON[Item 1]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.left });
    expect(readActiveElement()).toBe('BUTTON[Item 1 actions]');
  });

  test('right and left arrow key - does not navigate if no focusable elements inside', () => {
    const { treeView, wrapper } = renderTreeView();
    const firstToggle = wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement();

    firstToggle.focus();
    firstToggle.click();

    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 1.1]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('BUTTON[Item 1.1]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.left });
    expect(readActiveElement()).toBe('BUTTON[Item 1.1]');
  });

  test('right and arrow keys - ignores disabled elements', () => {
    const { treeView, wrapper } = renderTreeView();

    wrapper.findItemById('2-button-group')!.findItemToggle()!.getElement().focus();
    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 3]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('BUTTON[Item 3 popover]');

    // Skipped the disabled button so focus must be back to the toggle
    fireEvent.keyDown(treeView, { keyCode: KeyCode.right });
    expect(readActiveElement()).toBe('BUTTON[Item 3]');
  });

  test('page up and down keys - navigates by 10 tree-items', () => {
    const { treeView, wrapper } = renderTreeView();

    // Expand all expandable items
    wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement().click();
    wrapper.findItemById('2-button-group')!.findItemToggle()!.getElement().click();
    wrapper.findItemById('5-only-text')!.findItemToggle()!.getElement().click();

    expect(wrapper.findItems().length).toBe(15);

    wrapper.findItemById('2-button-group')!.findItemToggle()!.getElement().focus();
    fireEvent.keyDown(treeView, { keyCode: KeyCode.pageDown });
    expect(readActiveElement()).toBe('BUTTON[Item 5.3]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.pageUp });
    expect(readActiveElement()).toBe('BUTTON[Item 2]');
  });

  test('page up and down keys - focuses on the top or bottom tree-items if there are less than 10 items', () => {
    const { treeView, wrapper } = renderTreeView();

    wrapper.findItemById('2-button-group')!.findItemToggle()!.getElement().focus();
    fireEvent.keyDown(treeView, { keyCode: KeyCode.pageDown });
    expect(readActiveElement()).toBe('BUTTON[Item 5]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.pageUp });
    expect(readActiveElement()).toBe('BUTTON[Item 1]');
  });

  test('home and end keys - navigates to first and last tree-items', () => {
    const { treeView, wrapper } = renderTreeView();

    // Expand all expandable items
    wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement().click();
    wrapper.findItemById('2-button-group')!.findItemToggle()!.getElement().click();
    wrapper.findItemById('5-only-text')!.findItemToggle()!.getElement().click();

    expect(wrapper.findItems().length).toBe(15);

    wrapper.findItemById('2-button-group')!.findItemToggle()!.getElement().focus();
    fireEvent.keyDown(treeView, { keyCode: KeyCode.home });
    expect(readActiveElement()).toBe('BUTTON[Item 1]');

    fireEvent.keyDown(treeView, { keyCode: KeyCode.end });
    expect(readActiveElement()).toBe('BUTTON[Item 5.4]');
  });

  test('prevents default behavior for handled keyboard events', () => {
    const { treeView, wrapper } = renderTreeView();

    const firstToggle = wrapper.findItemById('1-button-actions')!.findItemToggle()!.getElement();
    firstToggle.focus();

    const rightKeydownEvent = new KeyboardEvent('keydown', { keyCode: KeyCode.right, bubbles: true });
    const preventDefaultSpy = jest.spyOn(rightKeydownEvent, 'preventDefault');

    treeView.dispatchEvent(rightKeydownEvent);

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

    // Expand to reveal only text children
    firstToggle.focus();
    firstToggle.click();

    // Focus to child by pressing down since the child item doesn't have children (so no toggle button) on its own,
    // the toggle cannot be retrived via test util
    fireEvent.keyDown(treeView, { keyCode: KeyCode.down });
    expect(readActiveElement()).toBe('BUTTON[Item 1.1]');

    treeView.dispatchEvent(rightKeydownEvent);
    // toHaveBeenCalledTimes should stay as 1 since the second event shouldn't get prevented
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });
});
