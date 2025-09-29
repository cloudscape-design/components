// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import treeItemStyles from '../tree-item/styles.css.js';

export function getClosestTreeItem(element: Element) {
  return element.closest('li[data-awsui-tree-item-index]') as null | HTMLLIElement;
}

export function getToggleButtonOfTreeItem(treeItem: null | HTMLLIElement) {
  const toggleElement = treeItem?.querySelector(`.${treeItemStyles['tree-item-focus-target']}`);
  return toggleElement as null | HTMLElement;
}

export function isElementDisabled(element: HTMLElement) {
  if (element instanceof HTMLButtonElement) {
    return element.disabled;
  }
  return false;
}

export function findTreeItemByIndex(treeView: HTMLUListElement, targetTreeItemIndex: number, delta: number) {
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
  }
  return targetTreeItem;
}

export function findTreeItemContentById(treeView: HTMLUListElement, treeItemId: string) {
  const treeItemContent = treeView.querySelector(
    `li[data-awsui-tree-item-index][id="${treeItemId}"] .${treeItemStyles['tree-item-structured-item']}`
  );
  return treeItemContent as null | HTMLLIElement;
}

export function isTreeItemToggle(element: Element) {
  return element.classList.contains(treeItemStyles['tree-item-focus-target']);
}
