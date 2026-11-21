// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BreadcrumbGroupProps } from './interfaces';

export const getEventDetail = <T extends BreadcrumbGroupProps.Item>(item: T) => ({
  item,
  text: item.text,
  href: item.href,
});

const MIN_BREADCRUMB_WIDTH = 70;
const ELLIPSIS_WIDTH = 50;

export const getItemsDisplayProperties = (itemsWidths: Array<number>, navWidth: number | null) => {
  const widthsWithFinalCollapsed = [...itemsWidths];
  widthsWithFinalCollapsed[itemsWidths.length - 1] = Math.min(
    itemsWidths[itemsWidths.length - 1],
    MIN_BREADCRUMB_WIDTH
  );

  return {
    collapsed: computeNumberOfCollapsedItems(widthsWithFinalCollapsed, navWidth),
  };
};

const computeNumberOfCollapsedItems = (itemWidths: Array<number>, navWidth: number | null): number => {
  if (typeof navWidth !== 'number') {
    return 0;
  }
  let usedWidth = itemWidths.reduce((acc, width) => acc + width, 0);
  let collapsedItems = 0;
  while (collapsedItems < itemWidths.length - 1) {
    if (usedWidth <= navWidth) {
      break;
    }
    collapsedItems += 1;
    usedWidth = usedWidth - itemWidths[collapsedItems];
    if (collapsedItems === 1) {
      usedWidth += ELLIPSIS_WIDTH;
    }
  }
  return collapsedItems;
};

/**
 * Compute the number of middle items to hide when `maxItems` is set.
 *
 * Rules:
 * - The first item (index 0) is always visible.
 * - The last item (index n-1) is always visible.
 * - When `totalItems <= maxItems` nothing is hidden.
 * - Otherwise `totalItems - maxItems` middle items (starting from index 1) are collapsed.
 *
 * Returns 0 when `maxItems` is undefined, not a finite number, or less than 2.
 */
export const getMaxItemsCollapsed = (totalItems: number, maxItems: number | undefined): number => {
  if (maxItems === undefined || !Number.isFinite(maxItems) || maxItems < 2) {
    return 0;
  }
  const cap = Math.floor(maxItems);
  if (totalItems <= cap) {
    return 0;
  }
  // We always keep the first and last item visible, so we can collapse at most totalItems - 2
  // middle items.  The number of items to collapse is the excess beyond the cap.
  return Math.min(totalItems - cap, totalItems - 2);
};
