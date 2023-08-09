// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DrawerItem } from './interfaces';

export const splitItems = (items: DrawerItem[] | undefined, splitIndex: number) => {
  let visibleItems = items;
  let overflowItems = undefined;
  if (items) {
    visibleItems = items.slice(0, splitIndex);
    overflowItems = items.slice(splitIndex, items.length);
  }
  return { visibleItems, overflowItems };
};
