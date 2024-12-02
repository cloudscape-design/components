// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getIsRtl, getScrollInlineStart, isMotionDisabled } from '@cloudscape-design/component-toolkit/internal';

const smoothScroll = (element: HTMLElement, to: number) => {
  if (isMotionDisabled(element) || !element.scrollTo) {
    element.scrollLeft = to;
    return;
  }
  // istanbul ignore next: unit tests always have motion disabled
  element.scrollTo({
    left: to,
    behavior: 'smooth',
  });
};

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
