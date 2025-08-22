// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef, useState } from 'react';
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
  findTreeItemById,
  findTreeItemByIndex,
  focusElement,
  getClosestTreeItem,
  getClosestTreeItemContent,
  getToggleButtonOfTreeItem,
  isElementDisabled,
  isElementToggle,
  isTreeItem,
} from './utils';

// Focus highlight offset to be checked in compact mode

// Keyboard navigation works weird when there a button group inside

// When focused on an element inside the tree-item, the navigation is disabled
// so when we click outside the tree-view and lose focus and re-focus on the tree-view,
// the focus starts from the first tree-item, not where it was the last time

// Create a bug ticket in customer issues for tree view tab stop and button group tab stop combination

// re-activate the navigation when focus goes outside tree-view -> onblur? and check related target if it's outside tree-view then re-enable

// event will only be on blur, if on blur event target on tree-item, we disable navigation
// on blur tree-view re-activate

export function KeyboardNavigationProvider({
  getTreeView,
  children,
}: {
  getTreeView: () => null | HTMLUListElement;
  children: React.ReactNode;
}) {
  const [navigationActive, _setNavigationActive] = useState(true);
  const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);

  const setNavigationActive = useCallback(
    (active: boolean) => {
      _setNavigationActive(active);

      setTimeout(() => {
        navigationAPI.current?.updateFocusTarget();
      }, 1);
    },
    [navigationAPI]
  );

  const keyboardNavigation = useMemo(() => new KeyboardNavigationProcessor(navigationAPI, setNavigationActive), []);

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

class KeyboardNavigationProcessor {
  // Props
  private _treeView: null | HTMLUListElement = null;
  private _navigationAPI: { current: null | SingleTabStopNavigationAPI };
  private setNavigationActive: (active: boolean) => void;

  // State
  private focusedTreeItem: null | FocusedTreeItem = null;

  constructor(
    navigationAPI: { current: null | SingleTabStopNavigationAPI },
    setNavigationActive: (active: boolean) => void
  ) {
    this._navigationAPI = navigationAPI;
    this.setNavigationActive = setNavigationActive;
  }

  public init(treeView: HTMLUListElement) {
    this._treeView = treeView;
    const controller = new AbortController();

    this.treeView.addEventListener('focusin', this.onFocusin, { signal: controller.signal });
    this.treeView.addEventListener('focusout', this.onFocusout, { signal: controller.signal });
    this.treeView.addEventListener('keydown', this.onKeydown, { signal: controller.signal });
    // this.treeView.addEventListener('blur', this.onBlur, { signal: controller.signal });

    this.cleanup = () => {
      controller.abort();
    };
  }

  public cleanup() {
    // Do nothing before initialized.
  }

  public refresh() {
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
    const treeItem = this.focusedTreeItem;
    const firstTreeItemToggle = this.treeView.querySelector(
      '[data-tree-view-toggle-button=true]'
    ) as null | HTMLButtonElement;
    console.log('firstTreeItemToggle:', firstTreeItemToggle);

    let focusTarget: null | HTMLElement = firstTreeItemToggle;
    console.log('tree item that was focused before: ', treeItem);

    // Focus on the element that was focused before.
    if (treeItem) {
      focusTarget = this.getNextFocusableTreeItem(treeItem, 0);
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
    const treeItemIndex = parseInt(treeItem.getAttribute('data-keyboard-navigation-index') ?? '');

    this.focusedTreeItem = {
      treeItemId: treeItem.id,
      treeItemIndex,
      element: focusedElement,
    };

    console.log('focusedTreeItem: ', {
      treeItemId: treeItem.id,
      treeItemIndex,
      element: focusedElement,
    });
  }

  private onFocusin = (event: FocusEvent) => {
    console.log('onFocusin', event.target);

    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    this.updateFocusedTreeItem(event.target);
    if (!this.focusedTreeItem) {
      return;
    }

    this._navigationAPI.current?.updateFocusTarget();
  };

  private onFocusout = (event: FocusEvent) => {
    console.log('onFocusout');

    const target = event.relatedTarget as null | Element;

    if (target === null) {
      console.log('navigation enabled');
      this.setNavigationActive(true);
      return;
    }

    const closestTreeItemContent = getClosestTreeItemContent(target);
    if (closestTreeItemContent) {
      this.setNavigationActive(false);
      console.log('navigation disabled');
    } else {
      this.setNavigationActive(true);
      console.log('navigation enabled');
    }
  };

  private onBlur = (event: FocusEvent) => {
    const target = event.relatedTarget as HTMLElement;

    const isTargetTreeItem = isTreeItem(target);
    if (isTargetTreeItem) {
      this.setNavigationActive(false);
      console.log('navigation disabled');
    } else {
      this.setNavigationActive(true);
      console.log('navigation enabled');
    }
  };

  private onKeydown = (event: KeyboardEvent) => {
    console.log('onKeydown');
    if (!this.focusedTreeItem) {
      return;
    }

    const keys = [KeyCode.up, KeyCode.down, KeyCode.right, KeyCode.home, KeyCode.end];

    if (!this.isRegistered(document.activeElement) || keys.indexOf(event.keyCode) === -1) {
      console.log('returning in onKeydown');
      return;
    }

    const from = this.focusedTreeItem;
    event.preventDefault();

    if (isEventLike(event)) {
      handleKey(event, {
        onBlockStart: () => this.moveFocusBetweenTreeItems(from, -1),
        onBlockEnd: () => this.moveFocusBetweenTreeItems(from, 1),
        onInlineEnd: () => this.moveFocusInsideTreeItem(from),
        onHome: () => {
          console.log('onHome');
          this.moveFocusBetweenTreeItems(from, -Infinity);
        },
        onEnd: () => {
          console.log('onEnd');
          this.moveFocusBetweenTreeItems(from, Infinity);
        },
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
