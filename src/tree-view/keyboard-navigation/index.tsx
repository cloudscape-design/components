// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { useEffect, useMemo } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
} from '@cloudscape-design/component-toolkit/internal';

import { getAllFocusables } from '../../internal/components/focus-lock/utils';
import { KeyCode } from '../../internal/keycode';
import handleKey, { isEventLike } from '../../internal/utils/handle-key';
import {
  findTreeItemByIndex,
  findTreeItemContentById,
  focusElement,
  getClosestTreeItem,
  getToggleButtonOfTreeItem,
  isElementDisabled,
  isTreeItemToggle,
} from './utils';

export function KeyboardNavigationProvider({
  getTreeView,
  children,
  pageUpDownSize = 10,
}: {
  getTreeView: () => null | HTMLUListElement;
  children: React.ReactNode;
  pageUpDownSize?: number;
}) {
  const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);

  const keyboardNavigation = useMemo(() => new KeyboardNavigationProcessor(navigationAPI), []);

  const getTreeViewStable = useStableCallback(getTreeView);

  // Initialize the processor with the treeView container assuming it is mounted synchronously and only once.
  useEffect(() => {
    const treeView = getTreeViewStable();
    if (treeView) {
      keyboardNavigation.init(treeView);
      return keyboardNavigation.cleanup;
    }
  }, [keyboardNavigation, getTreeViewStable]);

  // Notify the processor of the props change.
  useEffect(() => {
    keyboardNavigation.update({ pageUpDownSize });
  }, [keyboardNavigation, pageUpDownSize]);

  // Notify the processor of the new render.
  useEffect(() => {
    keyboardNavigation.refresh();
  });

  return (
    <SingleTabStopNavigationProvider
      ref={navigationAPI}
      getNextFocusTarget={keyboardNavigation.getNextFocusTarget}
      navigationActive={true}
    >
      {children}
    </SingleTabStopNavigationProvider>
  );
}

interface FocusedTreeItem {
  treeItemId: string;
  treeItemIndex: number;
  element: HTMLElement;
  elementIndex: number;
}

export class KeyboardNavigationProcessor {
  // Props
  private _treeView: null | HTMLUListElement = null;
  private _navigationAPI: { current: null | SingleTabStopNavigationAPI };
  private _pageUpDownSize: number = 0;

  // State
  private focusedTreeItem: null | FocusedTreeItem = null;

  constructor(navigationAPI: { current: null | SingleTabStopNavigationAPI }) {
    this._navigationAPI = navigationAPI;
  }

  public init(treeView: HTMLUListElement) {
    this._treeView = treeView;
    const controller = new AbortController();

    treeView.addEventListener('focusin', this.onFocusin, { signal: controller.signal });
    treeView.addEventListener('keydown', this.onKeydown, { signal: controller.signal });

    this.cleanup = () => {
      controller.abort();
    };
  }

  public cleanup = () => {
    // Do nothing before initialized.
  };

  public refresh() {
    // Timeout ensures the newly rendered content elements are registered.
    setTimeout(() => {
      if (this._treeView) {
        // Update focused tree-item in case tree-items change.
        this.updateFocusedTreeItem(this.focusedTreeItem?.element);
        this._navigationAPI.current?.updateFocusTarget();
      }
    }, 0);
  }

  public update({ pageUpDownSize }: { pageUpDownSize: number }) {
    this._pageUpDownSize = pageUpDownSize;
  }

  public getNextFocusTarget = () => {
    if (!this.treeView) {
      return null;
    }

    const treeItem = this.focusedTreeItem;
    const firstTreeItemToggle = this.treeView.querySelector(
      '[data-awsui-tree-view-toggle-button=true]'
    ) as null | HTMLButtonElement;

    let focusTarget: null | HTMLElement = firstTreeItemToggle;

    // Focus on the element that was focused before.
    if (treeItem) {
      focusTarget = this.getNextFocusableTreeItem(treeItem, 0);
    }

    return focusTarget;
  };

  private get pageUpDownSize() {
    return this._pageUpDownSize;
  }

  private get treeView(): null | HTMLUListElement {
    return this._treeView;
  }

  private getFocusablesFrom(target: HTMLElement) {
    const isElementRegistered = (element: Element) => this._navigationAPI.current?.isRegistered(element);
    return getAllFocusables(target).filter(el => isElementRegistered(el) && !isElementDisabled(el));
  }

  private isRegistered(element: null | Element): boolean {
    return !element || (this._navigationAPI.current?.isRegistered(element) ?? false);
  }

  private updateFocusedTreeItem(focusedElement?: HTMLElement): void {
    if (!focusedElement) {
      return;
    }

    const treeItem = getClosestTreeItem(focusedElement);
    if (!treeItem) {
      return;
    }

    const treeItemContent = findTreeItemContentById(this.treeView, treeItem.id);

    this.focusedTreeItem = {
      treeItemId: treeItem.id,
      treeItemIndex: parseInt(treeItem.getAttribute('data-awsui-tree-item-index') ?? ''),
      element: focusedElement,
      elementIndex: treeItemContent ? this.getFocusablesFrom(treeItemContent).indexOf(focusedElement) : 0,
    };
  }

  private onFocusin = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    this.updateFocusedTreeItem(event.target);
    if (!this.focusedTreeItem) {
      return;
    }

    this._navigationAPI.current?.updateFocusTarget();
  };

  private onKeydown = (event: KeyboardEvent) => {
    if (!this.focusedTreeItem) {
      return;
    }

    const keys = [
      KeyCode.up,
      KeyCode.down,
      KeyCode.left,
      KeyCode.right,
      KeyCode.pageUp,
      KeyCode.pageDown,
      KeyCode.home,
      KeyCode.end,
    ];

    if (!this.isRegistered(document.activeElement) || keys.indexOf(event.keyCode) === -1) {
      return;
    }

    const from = this.focusedTreeItem;
    event.preventDefault();

    if (isEventLike(event)) {
      handleKey(event, {
        onBlockStart: () => this.moveFocusBetweenTreeItems(from, -1),
        onBlockEnd: () => this.moveFocusBetweenTreeItems(from, 1),
        onInlineEnd: () => {
          // If focus is on the toggle, move focus to the first element inside the tree-item
          if (isTreeItemToggle(from.element)) {
            return this.moveFocusInsideTreeItem(from, 0);
          }

          return this.moveFocusInsideTreeItem(from, 1);
        },
        onInlineStart: () => {
          // If focus is on the toggle, move focus to the last element inside the tree-item
          if (isTreeItemToggle(from.element)) {
            return this.moveFocusToTheLastElementInsideTreeItem(from);
          }

          return this.moveFocusInsideTreeItem(from, -1);
        },
        onPageUp: () => this.moveFocusBetweenTreeItems(from, -this.pageUpDownSize),
        onPageDown: () => this.moveFocusBetweenTreeItems(from, this.pageUpDownSize),
        onHome: () => this.moveFocusBetweenTreeItems(from, -Infinity),
        onEnd: () => this.moveFocusBetweenTreeItems(from, Infinity),
      });
    }
  };

  private getNextFocusableTreeItem(from: FocusedTreeItem, by: number) {
    const targetTreeItemIndex = from.treeItemIndex + by;
    const targetTreeItem = findTreeItemByIndex(this.treeView, targetTreeItemIndex, by);
    if (!targetTreeItem) {
      return null;
    }

    // Return the toggle of the tree-item
    const targetTreeItemToggle = getToggleButtonOfTreeItem(targetTreeItem);
    if (!targetTreeItemToggle) {
      return null;
    }

    return targetTreeItemToggle;
  }

  private moveFocusInsideTreeItem(from: FocusedTreeItem, by: number) {
    const nextFocusableElement = this.getNextFocusableTreeItemContent(from, by);

    if (nextFocusableElement) {
      focusElement(nextFocusableElement);
    }
  }

  private moveFocusBetweenTreeItems(from: FocusedTreeItem, by: number) {
    const isToggleFocused = isTreeItemToggle(from.element);

    // If toggle is not focused (focus is inside the tree-item),
    // pressing up or down arrow keys should move focus to the toggle
    focusElement(this.getNextFocusableTreeItem(from, isToggleFocused ? by : 0));
  }

  private moveFocusToTheLastElementInsideTreeItem(from: FocusedTreeItem) {
    const treeItem = findTreeItemContentById(this.treeView, from.treeItemId);
    if (!treeItem) {
      return null;
    }

    const treeItemFocusables = this.getFocusablesFrom(treeItem);

    const focusableElement = treeItemFocusables[treeItemFocusables.length - 1];

    if (focusableElement) {
      focusElement(focusableElement);
    }
  }

  private getNextFocusableTreeItemContent(from: FocusedTreeItem, by: number) {
    const treeItem = findTreeItemContentById(this.treeView, from.treeItemId);
    if (!treeItem) {
      return null;
    }

    const treeItemFocusables = this.getFocusablesFrom(treeItem);

    const targetElementIndex = isTreeItemToggle(from.element) ? by : from.elementIndex + by;

    // Move focus to the tree-item toggle if
    // left arrow key is pressed while focused on the first element inside the tree-item, or
    // right arrow key is pressed while focused on the last element inside the tree-item
    const isTargetToggle =
      (from.elementIndex === 0 && by < 0) || (targetElementIndex === treeItemFocusables.length && by > 0);
    if (isTargetToggle) {
      return this.getNextFocusableTreeItem(from, 0);
    }

    const isValidIndex = targetElementIndex < treeItemFocusables.length;
    if (isValidIndex) {
      return treeItemFocusables[targetElementIndex];
    }

    return null;
  }
}
