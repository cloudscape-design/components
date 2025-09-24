// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getClosestTreeItem(element: Element) {
  return element.closest('li[data-awsui-tree-item-index]') as null | HTMLLIElement;
}

export function getToggleButtonOfTreeItem(treeItem: HTMLLIElement) {
  const toggleElement = treeItem.querySelector('[data-awsui-tree-view-toggle-button=true]');
  return toggleElement as null | HTMLElement;
}

export function isElementDisabled(element: HTMLElement) {
  if (element instanceof HTMLButtonElement) {
    return element.disabled;
  }
  return false;
}

export function findTreeItemByIndex(treeView: null | HTMLUListElement, targetTreeItemIndex: number, delta: number) {
  if (!treeView) {
    return null;
  }

  let targetTreeItem: null | HTMLLIElement = null;
  const treeItemElements = Array.from(treeView.querySelectorAll('li[data-awsui-tree-item-index]'));

  if (delta < 0) {
    treeItemElements.reverse();
  }

  for (const element of treeItemElements) {
    const elementIndex = parseInt(element.getAttribute('data-awsui-tree-item-index') ?? '');
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

export function findTreeItemContentById(treeView: null | HTMLUListElement, treeItemId: string) {
  if (!treeView) {
    return null;
  }

  const treeItem = treeView.querySelector(
    `li[data-awsui-tree-item-index][id="${treeItemId}"] div[data-awsui-structured-item=true]`
  );
  return treeItem as null | HTMLLIElement;
}

export function isTreeItemToggle(element: Element) {
  return (
    (element.tagName === 'BUTTON' || element.tagName === 'DIV') &&
    element.getAttribute('data-awsui-tree-view-toggle-button') === 'true'
  );
}
