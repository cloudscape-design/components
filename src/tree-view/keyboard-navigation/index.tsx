// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { useEffect, useMemo } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
} from '@cloudscape-design/component-toolkit/internal';

import AsyncStore, { useSelector } from '../../area-chart/async-store';
import { getAllFocusables } from '../../internal/components/focus-lock/utils';
import { KeyCode } from '../../internal/keycode';
import handleKey, { isEventLike } from '../../internal/utils/handle-key';
import {
  findTreeItemById,
  findTreeItemByIndex,
  focusElement,
  getClosestTreeItem,
  getClosestTreeItemContent,
  getToggleButtonOfTreeItem,
  isElementDisabled,
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
  const navigationActive = useSelector(keyboardNavigation, state => state.navigationActive);

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
      navigationActive={navigationActive}
      getNextFocusTarget={keyboardNavigation.getNextFocusTarget}
    >
      {children}
    </SingleTabStopNavigationProvider>
  );
}

interface FocusedTreeItem {
  treeItemId: string;
  treeItemIndex: number;
  element: HTMLElement;
}

interface KeyboardNavigationAsyncStore {
  navigationActive: boolean;
}

export class KeyboardNavigationProcessor extends AsyncStore<KeyboardNavigationAsyncStore> {
  // Props
  private _treeView: null | HTMLUListElement = null;
  private _navigationAPI: { current: null | SingleTabStopNavigationAPI };
  private _pageUpDownSize: number = 0;

  // State
  private focusedTreeItem: null | FocusedTreeItem = null;

  constructor(navigationAPI: { current: null | SingleTabStopNavigationAPI }) {
    super({ navigationActive: true });
    this._navigationAPI = navigationAPI;
  }

  public init(treeView: HTMLUListElement) {
    this._treeView = treeView;
    const controller = new AbortController();

    treeView.addEventListener('focusin', this.onFocusin, { signal: controller.signal });
    treeView.addEventListener('focusout', this.onFocusout, { signal: controller.signal });
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
    const treeItemIndex = parseInt(treeItem.getAttribute('data-awsui-tree-item-index') ?? '');

    this.focusedTreeItem = {
      treeItemId: treeItem.id,
      treeItemIndex,
      element: focusedElement,
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

  private setNavigationActive(navigationActive: boolean) {
    this.set(() => ({ navigationActive }));
  }

  private onFocusout = (event: FocusEvent) => {
    const target = event.relatedTarget as null | Element;

    // Re-enable navigation
    // so that when tree-view is focused again, the last focused tree-item can be re-focused
    if (target === null) {
      this.setNavigationActive(true);
      return;
    }

    // Disable navigation if the new focus target is inside the tree-item content
    // so that the focusables inside can be navigated with tab
    const closestTreeItemContent = getClosestTreeItemContent(target);
    if (closestTreeItemContent) {
      this.setNavigationActive(false);
    } else {
      this.setNavigationActive(true);
    }
  };

  private onKeydown = (event: KeyboardEvent) => {
    if (!this.focusedTreeItem || !this.get().navigationActive) {
      return;
    }

    const keys = [
      KeyCode.up,
      KeyCode.down,
      KeyCode.left, // when RTL, left arrow moves focus inside
      KeyCode.right, // when LTR, right arrow moves focus inside
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
        onInlineEnd: () => this.moveFocusInsideTreeItem(from),
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

  private moveFocusInsideTreeItem(from: FocusedTreeItem) {
    const nextFocusableElement = this.getNextFocusableTreeItemContent(from);

    if (nextFocusableElement) {
      focusElement(nextFocusableElement);
    }
  }

  private moveFocusBetweenTreeItems(from: FocusedTreeItem, by: number) {
    focusElement(this.getNextFocusableTreeItem(from, by));
  }

  private getNextFocusableTreeItemContent(from: FocusedTreeItem) {
    const treeItem = findTreeItemById(this.treeView, from.treeItemId);
    if (!treeItem) {
      return null;
    }

    const treeItemFocusables = this.getFocusablesFrom(treeItem);

    // Focus would always be on the toggle button which is at index 0 so next focusable is at index 1.
    const targetElementIndex = 1;
    const isValidIndex = targetElementIndex < treeItemFocusables.length;

    if (isValidIndex) {
      return treeItemFocusables[targetElementIndex];
    }

    return null;
  }
}
