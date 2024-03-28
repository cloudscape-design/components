// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import smoothScroll from './smooth-scroll';
import { isRtl } from '../internal/direction';

export const onPaginationClick = (headerBarRef: React.RefObject<HTMLUListElement>, direction: number): void => {
  if (!headerBarRef?.current) {
    return;
  }
  const element = headerBarRef.current;

  // Scroll each paginated section by 75% of what is already visible
  const paginatedSectionSize = Math.ceil(element.clientWidth * 0.75);

  if (direction === 1) {
    smoothScroll(
      element,
      Math.min(element.scrollLeft + paginatedSectionSize, element.scrollWidth - element.offsetWidth)
    );
  }
  if (direction === -1) {
    smoothScroll(element, Math.max(element.scrollLeft - paginatedSectionSize, 0));
  }
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
  return isRtl(headerBar) ? headerBar.scrollLeft < 0 : headerBar.scrollLeft > 0;
};

export const hasInlineEndOverflow = (headerBar: HTMLElement): boolean => {
  const { offsetWidth, scrollLeft, scrollWidth } = headerBar;

  // scrollLeft can be a decimal value on systems using display scaling
  // scrollLeft will be a negative number if the direction is RTL
  const computedScrollLeft = isRtl(headerBar) ? Math.floor(scrollLeft) * -1 : Math.ceil(scrollLeft);

  return Math.ceil(computedScrollLeft) < scrollWidth - offsetWidth;
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
