// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { useEffect, useMemo } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { getAllFocusables } from '../../internal/components/focus-lock/utils';
import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
} from '../../internal/context/single-tab-stop-navigation-context';
import { KeyCode } from '../../internal/keycode';
import handleKey, { isEventLike } from '../../internal/utils/handle-key';
import {
  findTreeItemByIndex,
  focusElement,
  getClosestTreeItem,
  getToggleButtonOfTreeItem,
  isElementDisabled,
} from './utils';

export function KeyboardNavigationProvider({
  getTreeView,
  children,
}: {
  getTreeView: () => null | HTMLUListElement;
  children: React.ReactNode;
}) {
  const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);
  const keyboardNavigation = useMemo(() => new KeyboardNavigationProcessor(navigationAPI), []);

  const getTreeViewStable = useStableCallback(getTreeView);

  // Initialize the processor with the treeView container assuming it is mounted synchronously and only once.
  useEffect(() => {
    const treeView = getTreeViewStable();
    if (treeView) {
      keyboardNavigation.init(treeView);
    }
    return () => keyboardNavigation.cleanup();
  }, [keyboardNavigation, getTreeViewStable]);

  // Notify the processor of the new render.
  useEffect(() => {
    keyboardNavigation.refresh();
  });

  return (
    <SingleTabStopNavigationProvider
      ref={navigationAPI}
      navigationActive={true}
      getNextFocusTarget={keyboardNavigation.getNextFocusTarget}
      // isElementSuppressed={keyboardNavigation.isElementSuppressed}
      // onRegisterFocusable={keyboardNavigation.onRegisterFocusable}
      // onUnregisterActive={keyboardNavigation.onUnregisterActive}
    >
      {children}
    </SingleTabStopNavigationProvider>
  );
}

interface FocusedTreeItem {
  treeItemId: string;
  treeItemIndex: number;
  elementIndex: number;
  element: HTMLElement;
}

class KeyboardNavigationProcessor {
  // Props
  private _treeView: null | HTMLUListElement = null;
  private _navigationAPI: { current: null | SingleTabStopNavigationAPI };

  // State
  private focusedTreeItem: null | FocusedTreeItem = null;
  private focusInside = false;

  constructor(navigationAPI: { current: null | SingleTabStopNavigationAPI }) {
    this._navigationAPI = navigationAPI;
  }

  public init(treeView: HTMLUListElement) {
    this._treeView = treeView;
    const controller = new AbortController();

    this.treeView.addEventListener('focusin', this.onFocusin, { signal: controller.signal });
    this.treeView.addEventListener('focusout', this.onFocusout, { signal: controller.signal });
    this.treeView.addEventListener('keydown', this.onKeydown, { signal: controller.signal });

    this.cleanup = () => {
      controller.abort();
    };
  }

  public cleanup() {
    // Do nothing before initialized.
  }

  public refresh() {
    console.log('refresh');
    // Timeout ensures the newly rendered content elements are registered.
    setTimeout(() => {
      if (this._treeView) {
        // Update focused tree-item indices in case tree-items change.
        this.updateFocusedTreeItem(this.focusedTreeItem?.element);
        this._navigationAPI.current?.updateFocusTarget();
      }
    }, 0);
  }

  public getNextFocusTarget = () => {
    console.log('getNextFocusTarget');
    const treeItem = this.focusedTreeItem;
    const firstTreeItemToggle = this.treeView.querySelector(
      '[data-tree-view-toggle-button=true]'
    ) as null | HTMLButtonElement;

    let focusTarget: null | HTMLElement = firstTreeItemToggle;

    // When a navigation-focused element is present in the tree-view it is used for user-navigation instead.
    if (treeItem) {
      focusTarget = this.getNextFocusableTreeItem(treeItem, 0);
      // focusTarget = this.getNextFocusable(cell, { x: 0, y: 0 });
    }

    return focusTarget;
  };

  private get treeView(): HTMLUListElement {
    if (!this._treeView) {
      throw new Error('Invariant violation: KeyboardNavigationProcessor is used before initialization.');
    }
    return this._treeView;
  }

  private getFocusablesFrom(target: HTMLElement) {
    const isElementRegistered = (element: Element) => this._navigationAPI.current?.isRegistered(element);
    return getAllFocusables(target).filter(el => isElementRegistered(el) && !isElementDisabled(el));
  }

  private updateFocusedTreeItem(focusedElement?: HTMLElement): void {
    if (!focusedElement) {
      return;
    }

    const treeItem = getClosestTreeItem(focusedElement);
    if (!treeItem) {
      return;
    }
    const treeItemIndex = parseInt(treeItem.getAttribute('data-keyboard-navigation-index') ?? '');

    const treeItemFocusables = this.getFocusablesFrom(treeItem);
    const elementIndex = treeItemFocusables.indexOf(focusedElement);

    this.focusedTreeItem = {
      treeItemId: treeItem.id,
      treeItemIndex,
      elementIndex,
      element: focusedElement,
    };

    console.log('focusedTreeItem: ', {
      treeItemId: treeItem.id,
      treeItemIndex,
      elementIndex,
      element: focusedElement,
    });
  }

  private onFocusin = (event: FocusEvent) => {
    console.log('onFocusin');
    this.focusInside = true;

    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    this.updateFocusedTreeItem(event.target);
    if (!this.focusedTreeItem) {
      return;
    }

    this._navigationAPI.current?.updateFocusTarget();
  };

  private onFocusout = () => {
    console.log('onFocusout');
    this.focusInside = false;
  };

  private onKeydown = (event: KeyboardEvent) => {
    console.log('onKeydown');
    if (!this.focusedTreeItem) {
      return;
    }

    const keys = [
      KeyCode.up,
      KeyCode.down,
      // KeyCode.left,
      // KeyCode.right,
      // KeyCode.pageUp,
      // KeyCode.pageDown,
      // KeyCode.home,
      // KeyCode.end,
    ];

    if (
      // invalidModifierCombination ||
      // this.isElementSuppressed(document.activeElement) ||
      !this.isRegistered(document.activeElement) ||
      keys.indexOf(event.keyCode) === -1
    ) {
      console.log('returning in onKeydown');
      return;
    }

    const from = this.focusedTreeItem;
    event.preventDefault();

    if (isEventLike(event)) {
      handleKey(event, {
        onBlockStart: () => this.moveFocusBetweenTreeItems(from, -1),
        onBlockEnd: () => this.moveFocusBetweenTreeItems(from, 1),
      });
    }
  };

  private moveFocusBetweenTreeItems(from: FocusedTreeItem, by: number) {
    focusElement(this.getNextFocusableTreeItem(from, by));
  }

  private getNextFocusableTreeItem(from: FocusedTreeItem, by: number) {
    const targetTreeItemIndex = from.treeItemIndex + by;
    const targetTreeItem = findTreeItemByIndex(this.treeView, targetTreeItemIndex, by);
    console.log('targetTreeItem: ', targetTreeItem);
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

  private isRegistered(element: null | Element): boolean {
    return !element || (this._navigationAPI.current?.isRegistered(element) ?? false);
  }
}
