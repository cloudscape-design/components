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
