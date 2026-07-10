// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import { isItemGroup } from './utils';

function matchesString(value: string | undefined, lowerCaseSearchText: string): boolean {
  if (!value) {
    return false;
  }
  return value.toLowerCase().indexOf(lowerCaseSearchText) > -1;
}

function matchesItem(item: ButtonDropdownProps.Item | ButtonDropdownProps.CheckboxItem, searchText: string): boolean {
  return (
    matchesString(item.text, searchText) ||
    matchesString(item.secondaryText, searchText) ||
    matchesString(item.labelTag, searchText)
  );
}

export function filterItems(items: ButtonDropdownProps.Items, filterText: string): ButtonDropdownProps.Items {
  const lowerCaseSearchText = filterText.toLowerCase();

  return items.reduce<ButtonDropdownProps.ItemOrGroup[]>((acc, item) => {
    if (!isItemGroup(item)) {
      if (matchesItem(item, lowerCaseSearchText)) {
        acc.push(item);
      }
      return acc;
    }

    // Filtered results are rendered as a collapsed (flat) list, so nested
    // groups would otherwise render a header per level. Flatten all matching
    // descendants into the top-most group and keep only its header.
    const matchingChildren = collectMatchingLeaves(item.items, lowerCaseSearchText);

    if (matchingChildren.length > 0) {
      acc.push({ ...item, items: matchingChildren });
    }

    return acc;
  }, []);
}

function collectMatchingLeaves(
  items: ButtonDropdownProps.Items,
  searchText: string
): Array<ButtonDropdownProps.Item | ButtonDropdownProps.CheckboxItem> {
  return items.reduce<Array<ButtonDropdownProps.Item | ButtonDropdownProps.CheckboxItem>>((acc, item) => {
    if (isItemGroup(item)) {
      acc.push(...collectMatchingLeaves(item.items, searchText));
    } else if (matchesItem(item, searchText)) {
      acc.push(item);
    }
    return acc;
  }, []);
}

export function countLeafItems(items: ButtonDropdownProps.Items): number {
  let count = 0;
  for (const item of items) {
    if (isItemGroup(item)) {
      count += countLeafItems(item.items);
    } else {
      count++;
    }
  }
  return count;
}
