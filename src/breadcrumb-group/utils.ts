// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BreadcrumbGroupProps } from './interfaces';

export const getEventDetail = <T extends BreadcrumbGroupProps.Item>(item: T) => ({
  item,
  text: item.text,
  href: item.href,
});

const defaultMinBreadcrumbWidth = 150;
const ellipsisWidth = 50;

export const getItemsDisplayProperties = (itemsWidths: Array<number>, navWidth: number | null) => {
  const minBreadcrumbWidth = optimizeMinWidth(itemsWidths, navWidth);
  const shrinkFactors = itemsWidths.map(width => (width <= minBreadcrumbWidth ? 0 : Math.round(width)));
  const minWidths = itemsWidths.map(width => (width <= minBreadcrumbWidth ? 0 : minBreadcrumbWidth));
  const collapsedWidths = itemsWidths.map(width => Math.min(width, minBreadcrumbWidth));

  return {
    shrinkFactors,
    minWidths,
    collapsed: computeNumberOfCollapsedItems(collapsedWidths, navWidth),
  };
};

const computeNumberOfCollapsedItems = (collapsedWidths: Array<number>, navWidth: number | null): number => {
  if (!navWidth) {
    return 0;
  }
  let collapsed = 0;
  const itemsCount = collapsedWidths.length;
  if (itemsCount > 2) {
    collapsed = itemsCount - 2;
    let remainingWidth = navWidth - collapsedWidths[0] - collapsedWidths[itemsCount - 1] - ellipsisWidth;
    let j = 1;
    while (remainingWidth > 0 && j < itemsCount - 1) {
      remainingWidth -= collapsedWidths[itemsCount - 1 - j];
      j++;
      if (remainingWidth >= 0) {
        collapsed--;
      }
    }
  }
  return collapsed;
};

const optimizeMinWidth = (itemsWidths: Array<number>, navWidth: number | null): number => {
  const collapsedWidths = itemsWidths.map(width => Math.min(width, defaultMinBreadcrumbWidth));
  if (!navWidth) {
    return defaultMinBreadcrumbWidth;
  }
  const itemsCount = collapsedWidths.length;
  if (itemsCount > 2) {
    const minCollapsedWidth = collapsedWidths[0] + ellipsisWidth + collapsedWidths[collapsedWidths.length - 1];
    if (minCollapsedWidth > navWidth) {
      return (navWidth - ellipsisWidth) / 2;
    }
  }
  if (itemsCount === 2) {
    const minCollapsedWidth = collapsedWidths[0] + collapsedWidths[1];
    if (minCollapsedWidth > navWidth) {
      return navWidth / 2;
    }
  }
  if (itemsCount === 1) {
    return Math.min(navWidth, collapsedWidths[0]);
  }
  return defaultMinBreadcrumbWidth;
};
