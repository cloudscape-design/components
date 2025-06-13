// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TreeViewProps } from '../interfaces';

interface TransformTreeItemPropsParams
  extends Pick<TreeViewProps, 'expandedItems' | 'renderItem' | 'getItemId' | 'getItemChildren'> {
  item: any;
  index: number;
}

export function transformTreeItemProps({
  item,
  index,
  expandedItems = [],
  renderItem,
  getItemId,
  getItemChildren,
}: TransformTreeItemPropsParams) {
  const treeitem = renderItem(item, index);
  const itemId = getItemId(item, index);
  const children = getItemChildren(item, index) || [];
  const isExpandable = children.length > 0;
  const isExpanded = isExpandable && expandedItems.includes(itemId);

  return {
    id: itemId,
    isExpandable,
    isExpanded,
    children,
    ...treeitem,
  };
}
