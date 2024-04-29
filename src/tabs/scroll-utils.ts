// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import smoothScroll from './smooth-scroll';
import { getIsRtl, getScrollInlineStart } from '../internal/direction';

export const onPaginationClick = (
  headerBarRef: React.RefObject<HTMLUListElement>,
  direction: 'forward' | 'backward'
): void => {
  if (!headerBarRef?.current) {
    return;
  }
  const element = headerBarRef.current;
  const { scrollLeft, scrollWidth, offsetWidth } = element;

  // Scroll each paginated section by 75% of what is already visible
  const paginatedSectionSize = Math.ceil(element.clientWidth * 0.75);

  const scrollDistance =
    direction === 'forward'
      ? Math.min(Math.abs(scrollLeft) + paginatedSectionSize, scrollWidth - offsetWidth)
      : Math.max(Math.abs(scrollLeft) - paginatedSectionSize, 0);

  // scroll destination needs to be a negative number if the direction is RTL
  const scrollTo = getIsRtl(element) ? scrollDistance * -1 : scrollDistance;

  smoothScroll(element, scrollTo);
};

export const hasHorizontalOverflow = (
  headerBar: HTMLElement,
  inlineStartOverflowButton: React.RefObject<HTMLElement>
): boolean => {
  const { offsetWidth, scrollWidth } = headerBar;

  // Need to account for pagination button width when deciding if there would be overflow without them
  const paginationButtonsWidth = inlineStartOverflowButton.current && 2 * inlineStartOverflowButton.current.offsetWidth;
  return paginationButtonsWidth ? scrollWidth > offsetWidth + paginationButtonsWidth : scrollWidth > offsetWidth;
};

export const hasInlineStartOverflow = (headerBar: HTMLElement): boolean => {
  return getScrollInlineStart(headerBar) > 0;
};

export const hasInlineEndOverflow = (headerBar: HTMLElement): boolean => {
  return Math.ceil(getScrollInlineStart(headerBar)) < headerBar.scrollWidth - headerBar.offsetWidth;
};

export const scrollIntoView = (tabHeader: HTMLElement, headerBar: HTMLElement, smooth = true): void => {
  if (!tabHeader || !headerBar) {
    return;
  }
  // Extra left and right margin to always make the focus ring visible
  const margin = 2;
  let updatedLeftScroll = headerBar.scrollLeft;

  // Anchor tab to left of scroll parent
  updatedLeftScroll = Math.min(updatedLeftScroll, tabHeader.offsetLeft - margin);
  // Anchor tab to right of scroll parent
  updatedLeftScroll = Math.max(
    updatedLeftScroll,
    tabHeader.offsetLeft + tabHeader.offsetWidth - headerBar.offsetWidth + margin
  );
  if (smooth) {
    smoothScroll(headerBar, updatedLeftScroll);
  } else {
    headerBar.scrollLeft = updatedLeftScroll;
  }
};
