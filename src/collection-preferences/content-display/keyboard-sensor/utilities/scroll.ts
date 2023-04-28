// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { canUseDOM, Coordinates, subtract as getCoordinatesDelta } from '@dnd-kit/utilities';
import { KeyboardCode } from '@dnd-kit/core';

function isDocumentScrollingElement(element: Element | null) {
  if (!canUseDOM || !element) {
    return false;
  }

  return element === document.scrollingElement;
}

export function getScrollPosition(scrollingContainer: Element) {
  const minScroll = {
    x: 0,
    y: 0,
  };
  const dimensions = isDocumentScrollingElement(scrollingContainer)
    ? {
        height: window.innerHeight,
        width: window.innerWidth,
      }
    : {
        height: scrollingContainer.clientHeight,
        width: scrollingContainer.clientWidth,
      };
  const maxScroll = {
    x: scrollingContainer.scrollWidth - dimensions.width,
    y: scrollingContainer.scrollHeight - dimensions.height,
  };

  const isTop = scrollingContainer.scrollTop <= minScroll.y;
  const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
  const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
  const isRight = scrollingContainer.scrollLeft >= maxScroll.x;

  return {
    isTop,
    isLeft,
    isBottom,
    isRight,
    maxScroll,
    minScroll,
  };
}

export function getScrollElementRect(element: Element) {
  if (element === document.scrollingElement) {
    const { innerWidth, innerHeight } = window;

    return {
      top: 0,
      left: 0,
      right: innerWidth,
      bottom: innerHeight,
      width: innerWidth,
      height: innerHeight,
    };
  }

  const { top, left, right, bottom } = element.getBoundingClientRect();

  return {
    top,
    left,
    right,
    bottom,
    width: element.clientWidth,
    height: element.clientHeight,
  };
}

export function applyScroll({
  currentCoordinates,
  direction,
  newCoordinates,
  scrollableAncestors,
}: {
  currentCoordinates: Coordinates;
  direction: string;
  newCoordinates: Coordinates;
  scrollableAncestors: Element[];
}) {
  for (const scrollContainer of scrollableAncestors) {
    const coordinatesDelta = getCoordinatesDelta(newCoordinates, currentCoordinates);
    const { isTop, isBottom, maxScroll, minScroll } = getScrollPosition(scrollContainer);
    const scrollElementRect = getScrollElementRect(scrollContainer);

    const clampedCoordinates = {
      y: Math.min(
        direction === KeyboardCode.Down
          ? scrollElementRect.bottom - scrollElementRect.height / 2
          : scrollElementRect.bottom,
        Math.max(
          direction === KeyboardCode.Down
            ? scrollElementRect.top
            : scrollElementRect.top + scrollElementRect.height / 2,
          newCoordinates.y
        )
      ),
    };

    const canScrollY = (direction === KeyboardCode.Down && !isBottom) || (direction === KeyboardCode.Up && !isTop);

    if (canScrollY && clampedCoordinates.y !== newCoordinates.y) {
      const newScrollCoordinates = scrollContainer.scrollTop + coordinatesDelta.y;
      const canScrollToNewCoordinates =
        (direction === KeyboardCode.Down && newScrollCoordinates <= maxScroll.y) ||
        (direction === KeyboardCode.Up && newScrollCoordinates >= minScroll.y);

      if (canScrollToNewCoordinates) {
        // We don't need to update coordinates, the scroll adjustment alone will trigger
        // logic to auto-detect the new container we are over
        scrollContainer.scrollTo({
          top: newScrollCoordinates,
          behavior: 'smooth',
        });
        return true;
      }

      break;
    }
  }
  return false;
}
