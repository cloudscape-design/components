// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { getFirstFocusable } from '../focus-lock/utils.js';
import styles from './styles.css.js';

const tokenSelector = `.${styles['list-item']}`;
const toggleButtonSelector = `.${styles.toggle}`;

export function useTokenFocusController({ removedItemIndex }: { removedItemIndex?: null | number }) {
  const tokenListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (removedItemIndex === undefined || removedItemIndex === null || tokenListRef.current === null) {
      return;
    }

    const tokenElements = tokenListRef.current.querySelectorAll(tokenSelector);
    const toggleButton = tokenListRef.current.querySelector(toggleButtonSelector);

    const activeItemIndices: number[] = [];
    for (let i = 0; i < tokenElements.length; i++) {
      if (tokenElements[i].getAttribute('aria-disabled') !== 'true') {
        activeItemIndices.push(i);
      }
    }

    let closestPrevIndex = Number.NEGATIVE_INFINITY;
    let closestNextIndex = Number.POSITIVE_INFINITY;

    for (const activeIndex of activeItemIndices) {
      if (activeIndex < removedItemIndex) {
        closestPrevIndex =
          removedItemIndex - activeIndex < removedItemIndex - closestPrevIndex ? activeIndex : closestPrevIndex;
      } else {
        closestNextIndex =
          activeIndex - removedItemIndex < closestNextIndex - removedItemIndex ? activeIndex : closestNextIndex;
      }
    }

    const nextElement = tokenElements[closestNextIndex];
    const prevElement = tokenElements[closestPrevIndex];

    if (nextElement instanceof HTMLElement) {
      getFirstFocusable(nextElement)?.focus();
    } else if (prevElement instanceof HTMLElement) {
      getFirstFocusable(prevElement)?.focus();
    } else if (toggleButton instanceof HTMLElement) {
      toggleButton.focus();
    }
  }, [removedItemIndex]);

  return tokenListRef;
}
