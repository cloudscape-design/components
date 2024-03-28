// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import smoothScroll from './smooth-scroll';
import { isRtl } from '../internal/direction';

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

  console.log(`scrollLeft: ${scrollLeft}`);
  console.log(`scrollWidth: ${scrollWidth}`);
  console.log(`offsetWidth: ${offsetWidth}`);
  console.log(`paginatedSectionSize: ${paginatedSectionSize}`);

  // scrollLeft will be a negative number if the direction is RTL
  const scrollInlineStart = isRtl(element) ? scrollLeft * -1 : scrollLeft;

  const scrollDistance =
    direction === 'forward'
      ? Math.min(scrollInlineStart + paginatedSectionSize, scrollWidth - offsetWidth)
      : Math.max(scrollInlineStart - paginatedSectionSize, 0);

  const scrollTo = isRtl(element) ? scrollDistance * -1 : scrollDistance;

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
  // scrollLeft will be a negative number if the direction is RTL
  const scrollInlineStart = isRtl(headerBar) ? headerBar.scrollLeft * -1 : headerBar.scrollLeft;
  return scrollInlineStart > 0;
};

export const hasInlineEndOverflow = (headerBar: HTMLElement): boolean => {
  const { offsetWidth, scrollLeft, scrollWidth } = headerBar;

  // scrollLeft can be a decimal value on systems using display scaling
  // scrollLeft will be a negative number if the direction is RTL
  const scrollInlineStart = isRtl(headerBar) ? Math.floor(scrollLeft) * -1 : Math.ceil(scrollLeft);

  return Math.ceil(scrollInlineStart) < scrollWidth - offsetWidth;
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
