// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';
import {
  KeyboardNavigationProcessor,
  KeyboardNavigationProvider,
} from '../../../lib/components/tree-view/keyboard-navigation';
import { itemsWithFocusables as items, ItemWithFocusables as Item } from './items';

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
    expect(() => navigation.onUnregisterActive()).not.toThrow();
    expect(() => navigation.refresh()).not.toThrow();
    expect(() => navigation.cleanup()).not.toThrow();
  });

  test('does not throw when tree-view is null', () => {
    function TestTreeView() {
      return <KeyboardNavigationProvider getTreeView={() => null}>{null}</KeyboardNavigationProvider>;
    }
    expect(() => render(<TestTreeView />)).not.toThrow();
  });

  test('does not throw when focusing on incorrect target', () => {
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
