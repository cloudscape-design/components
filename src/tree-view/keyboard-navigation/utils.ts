// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function focusElement(element: null | HTMLElement) {
  if (element) {
    element.focus();
  }
}

export function getClosestTreeItem(element: Element) {
  return element.closest('li[data-keyboard-navigation-index]') as null | HTMLLIElement;
}

export function getToggleButtonOfTreeItem(treeItem: HTMLLIElement) {
  const toggleElement = treeItem.querySelector('[data-tree-view-toggle-button=true]');
  return toggleElement as null | HTMLElement;
}

export function isToggleFocused(element: HTMLElement): boolean {
  return element.getAttribute('data-tree-view-toggle-button') === 'true';
}

export function isElementDisabled(element: HTMLElement) {
  if (element instanceof HTMLButtonElement) {
    return element.disabled;
  }
  return false;
}

export function findTreeItemByIndex(treeView: HTMLUListElement, targetTreeItemIndex: number, delta: number) {
  let targetTreeItem: null | HTMLLIElement = null;
  const treeItemElements = Array.from(treeView.querySelectorAll('li[data-keyboard-navigation-index]'));

  if (delta < 0) {
    treeItemElements.reverse();
  }

  for (const element of treeItemElements) {
    const elementIndex = parseInt(element.getAttribute('data-keyboard-navigation-index') ?? '');
    targetTreeItem = element as HTMLLIElement;

    if (elementIndex === targetTreeItemIndex) {
      break;
    }
    if (delta >= 0 && elementIndex > targetTreeItemIndex) {
      break;
    }
    if (delta < 0 && elementIndex < targetTreeItemIndex) {
      break;
    }
  }
  return targetTreeItem;
}
