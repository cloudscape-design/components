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
  const collapsedWidths = itemsWidths.map((width, index) =>
    index === itemsWidths.length - 1 ? Math.min(width, MIN_BREADCRUMB_WIDTH) : width
  );

  return {
    collapsed: computeNumberOfCollapsedItems(collapsedWidths, navWidth),
  };
};

const computeNumberOfCollapsedItems = (collapsedWidths: Array<number>, navWidth: number | null): number => {
  if (!navWidth) {
    return 0;
  }
  let collapsed = 0;
  const itemsCount = collapsedWidths.length;
  if (itemsCount > 1) {
    collapsed = itemsCount - 1;
    let remainingWidth = navWidth - collapsedWidths[0] - collapsedWidths[itemsCount - 1] - ELLIPSIS_WIDTH;
    let j = 1;
    while (remainingWidth > 0 && j <= itemsCount - 1) {
      remainingWidth -= collapsedWidths[itemsCount - 1 - j];
      j++;
      if (remainingWidth >= 0) {
        collapsed--;
      }
    }
  }
  return collapsed;
};
