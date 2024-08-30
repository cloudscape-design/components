// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

import { getFirstFocusable, isFocusable } from '../components/focus-lock/utils.js';

interface UseListFocusControllerOptions {
  nextFocusIndex: null | number;
  onFocusMoved?: (target: HTMLElement) => void;
  listItemSelector: string;
  outsideSelector?: string;
  showMoreSelector?: string;
}

export function useListFocusController({
  nextFocusIndex,
  onFocusMoved,
  listItemSelector,
  outsideSelector,
  showMoreSelector,
}: UseListFocusControllerOptions) {
  const tokenListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nextFocusIndex === undefined || nextFocusIndex === null || tokenListRef.current === null) {
      return;
    }

    const tokenElements = tokenListRef.current.querySelectorAll(listItemSelector);
    const outsideElement = outsideSelector ? selectElement(tokenListRef.current, outsideSelector) : null;
    const toggleButton = showMoreSelector ? selectElement(tokenListRef.current, showMoreSelector) : null;

    let closestPrevIndex = Number.NEGATIVE_INFINITY;
    let closestNextIndex = Number.POSITIVE_INFINITY;

    for (let activeIndex = 0; activeIndex < tokenElements.length; activeIndex++) {
      if (activeIndex < nextFocusIndex) {
        closestPrevIndex =
          nextFocusIndex - activeIndex < nextFocusIndex - closestPrevIndex ? activeIndex : closestPrevIndex;
      } else {
        closestNextIndex =
          activeIndex - nextFocusIndex < closestNextIndex - nextFocusIndex ? activeIndex : closestNextIndex;
      }
    }

    const nextElement = tokenElements[closestNextIndex];
    const prevElement = tokenElements[closestPrevIndex];
    const focusTarget = getFirstEligible(nextElement, prevElement, toggleButton, outsideElement);

    if (focusTarget) {
      focusTarget.focus();
      onFocusMoved?.(focusTarget);
    }

    // Expecting onFocusMoved to be pure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextFocusIndex, listItemSelector, outsideSelector, showMoreSelector]);

  return tokenListRef;
}

function getFirstEligible(...elements: Array<null | Element>): null | HTMLElement {
  for (const element of elements) {
    const focusable = element ? getFocusableElement(element) : null;
    if (focusable) {
      return focusable;
    }
  }
  return null;
}

function getFocusableElement(element: Element): null | HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return null;
  }
  if (isFocusable(element)) {
    return element;
  }
  return getFirstFocusable(element);
}

function selectElement(container: HTMLElement, selector: string): null | Element {
  if (container.matches(selector)) {
    return container;
  }
  return container.querySelector(selector);
}
