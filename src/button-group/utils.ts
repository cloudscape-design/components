// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonGroupProps } from './interfaces';
import {
  InternalItem as ButtonDropdownInternalItem,
  InternalItemGroup as ButtonDropdownInternalItemGroup,
} from '../button-dropdown/interfaces';

export function isItemGroup(item: ButtonGroupProps.ItemOrGroup): item is ButtonGroupProps.ItemGroup {
  return (item as ButtonGroupProps.ItemGroup).items !== undefined;
}

export function splitItems(items: readonly ButtonGroupProps.ItemOrGroup[], limit: number) {
  limit = Math.max(limit, 0);
  const primary: ButtonGroupProps.ItemOrGroup[] = [];
  const secondary: ButtonGroupProps.ItemOrGroup[] = [];

  let total = 0;
  for (const item of items) {
    const itemLength = isItemGroup(item) ? item.items.length : 1;

    if (total + itemLength <= limit) {
      primary.push(item);
    } else {
      secondary.push(item);
    }

    total += itemLength;
  }

  return { primary, secondary };
}

export function findItemById(items: readonly ButtonGroupProps.ItemOrGroup[], id: string): ButtonGroupProps.Item | null {
  for (const item of items) {
    if (isItemGroup(item)) {
      const found = findItemById(item.items, id);

      if (found) {
        return found;
      }
    } else if (item.id === id) {
      return item;
    }
  }

  return null;
}

export function toDropdownItems(items: readonly ButtonGroupProps.ItemOrGroup[]) {
  return items.map(current => {
    if (isItemGroup(current)) {
      const group: ButtonDropdownInternalItemGroup = {
        id: current.id,
        text: current.text,
        items: toDropdownItems(current.items),
      };

      return group;
    } else {
      const item: ButtonDropdownInternalItem = {
        id: current.id,
        text: current.text,
        disabled: current.disabled,
        iconAlt: current.iconAlt,
        iconName: current.iconName,
        iconUrl: current.iconUrl,
        iconSvg: current.iconSvg,
      };

      return item;
    }
  });
}

export function getFirstLoadingItem(items: readonly ButtonGroupProps.Item[]): null | ButtonGroupProps.Item {
  for (const item of items) {
    if (item.loading) {
      return item;
    }
  }
  return null;
}
