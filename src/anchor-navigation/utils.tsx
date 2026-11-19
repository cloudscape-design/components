// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { AnchorItem } from './anchor-item';
import { AnchorNavigationProps } from './interfaces';

import styles from './styles.css.js';
import testUtilsStyles from './test-classes/styles.css.js';

interface AnchorRenderQueueItem {
  items: AnchorNavigationProps.Anchor[];
  parentList: React.ReactNode[];
  startIndex: number;
}

const collectChildItems = (
  items: AnchorNavigationProps.Anchor[],
  currentIndex: number,
  currentLevel: number
): AnchorNavigationProps.Anchor[] => {
  const childItems: AnchorNavigationProps.Anchor[] = [];
  let nextIndex = currentIndex + 1;

  while (nextIndex < items.length && items[nextIndex].level > currentLevel) {
    childItems.push(items[nextIndex]);
    nextIndex++;
  }

  return childItems;
};

interface RenderContext {
  onFollowHandler: (anchor: AnchorNavigationProps.Anchor, sourceEvent: React.SyntheticEvent | Event) => void;
  currentActiveHref: string | undefined;
}

const createAnchorItem = (
  currentItem: AnchorNavigationProps.Anchor,
  index: number,
  childItems: AnchorNavigationProps.Anchor[],
  renderQueue: AnchorRenderQueueItem[],
  context: RenderContext
) => {
  const childList: React.ReactNode[] = [];
  const hasChildren = childItems.length > 0;
  const olClassNAme = clsx(styles['anchor-list'], testUtilsStyles['anchor-list']);

  if (hasChildren) {
    renderQueue.push({
      items: childItems,
      parentList: childList,
      startIndex: index + 1,
    });
  }

  return (
    <AnchorItem
      onFollow={context.onFollowHandler}
      isActive={currentItem.href === context.currentActiveHref}
      key={index}
      index={index}
      anchor={currentItem}
    >
      {hasChildren && <ol className={olClassNAme}>{childList}</ol>}
    </AnchorItem>
  );
};

const processQueueItem = (
  items: AnchorNavigationProps.Anchor[],
  startIndex: number,
  parentList: React.ReactNode[],
  renderQueue: AnchorRenderQueueItem[],
  context: RenderContext
) => {
  let currentIndex = 0;
  while (currentIndex < items.length) {
    const currentItem = items[currentIndex];
    const childItems = collectChildItems(items, currentIndex, currentItem.level);

    parentList.push(createAnchorItem(currentItem, startIndex + currentIndex, childItems, renderQueue, context));
    currentIndex += childItems.length + 1;
  }
};

// Perform a queue-based breadth-first traversal that groups child items under their parents based on level hierarchy.
export const renderNestedAnchors = (items: AnchorNavigationProps.Anchor[], context: RenderContext): React.ReactNode => {
  const rootList: React.ReactNode[] = [];
  const renderQueue: AnchorRenderQueueItem[] = [];

  renderQueue.push({ items, parentList: rootList, startIndex: 0 });

  while (renderQueue.length > 0) {
    const currentItem = renderQueue.shift()!;
    processQueueItem(currentItem.items, currentItem.startIndex, currentItem.parentList, renderQueue, context);
  }

  return rootList;
};
