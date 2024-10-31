// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps, LinkItem } from '../interfaces';
import { traverseItems } from './create-items-tree';

export const isItemGroup = (item: ButtonDropdownProps.ItemOrGroup): item is ButtonDropdownProps.ItemGroup =>
  item && (item as ButtonDropdownProps.ItemGroup).items !== undefined;

export const isLinkItem = (item: LinkItem | ButtonDropdownProps.ItemOrGroup): item is LinkItem =>
  item && (item as LinkItem).href !== undefined;

export const isCheckboxItem = (item: ButtonDropdownProps.ItemOrGroup): item is ButtonDropdownProps.CheckboxItem =>
  item && (item as ButtonDropdownProps.CheckboxItem).itemType === 'checkbox';

export const getItemTarget = (item: ButtonDropdownProps.Item) => (item.external ? '_blank' : undefined);

export function indexIncludes(source: number[], target: number[]) {
  for (let index = 0; index < source.length; index++) {
    if (source[index] !== target[index]) {
      return false;
    }
  }

  return true;
}

export function indexEquals(left: number[], right: number[]) {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
}

export function hasCheckboxItems(items: ButtonDropdownProps.Items) {
  let hasCheckboxItems = false;
  traverseItems(items, item => {
    if (item.itemType === 'checkbox') {
      hasCheckboxItems = true;
    }
  });
  return hasCheckboxItems;
}

export function hasDisabledReasonItems(items: ButtonDropdownProps.Items) {
  let hasDisabledReasons = false;
  traverseItems(items, item => {
    if (item.disabledReason) {
      hasDisabledReasons = true;
    }
  });
  return hasDisabledReasons;
}
