// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';

// Sets scroll padding to the scrolling element (`html` or `body`).
// This prevents the focused element to be hidden under the sticky headers.
export function useGlobalScrollPadding(headerHeight: number) {
  useEffect(() => {
    const scrollingElement = document.scrollingElement;
    if (scrollingElement instanceof HTMLElement) {
      scrollingElement.style.scrollPaddingBlockStart = `${headerHeight}px`;
    }
  }, [headerHeight]);
}
