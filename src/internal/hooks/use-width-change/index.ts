// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

/**
 * Observes an element for inline-size (width) changes and calls `onWidthChange`
 * when the width changes. Height-only changes are ignored to prevent infinite
 * loops when the callback adjusts the element's height.
 *
 * Unlike useResizeObserver from the component-toolkit package, it does not cause
 * re-renders when the width changes.
 *
 * @param elementRef - A ref object pointing to the element to observe.
 * @param onWidthChange - Callback fired when the element's width changes.
 */
export function useWidthChange(elementRef: React.RefObject<HTMLElement>, onWidthChange: () => void): void {
  const lastWidthRef = useRef(-1);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const newWidth = node.getBoundingClientRect().width;
      if (newWidth !== lastWidthRef.current) {
        lastWidthRef.current = newWidth;
        onWidthChange();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef, onWidthChange]);
}
