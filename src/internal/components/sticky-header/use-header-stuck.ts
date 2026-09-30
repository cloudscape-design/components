// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useEffect, useState } from 'react';

interface UseHeaderStuckResult {
  isStuck: boolean;
  isStuckAtBottom: boolean;
}

// Detects the "stuck" state: whether the header has moved from its original position (top)
// or reached the bottom of its root. Compared on capture-phase window scroll/resize so it
// reflects the header's position relative to its root regardless of which scroll container moved.
export function useHeaderStuck(
  rootRef: RefObject<HTMLElement>,
  headerRef: RefObject<HTMLElement>,
  isSticky: boolean
): UseHeaderStuckResult {
  const [isStuck, setIsStuck] = useState(false);
  const [isStuckAtBottom, setIsStuckAtBottom] = useState(false);

  const checkIfStuck = useCallback(
    ({ isTrusted, target, type }) => {
      if (type === 'resize' && target === window && !isTrusted) {
        // The window size didn't actually change, it was a synthetic event
        return;
      }
      if (rootRef.current && headerRef.current) {
        const rootTopBorderWidth = parseFloat(getComputedStyle(rootRef.current).borderTopWidth) || 0;

        // Using Math.round to adjust for rounding errors in floating-point arithmetic and timing issues
        const rootTop = Math.round(rootRef.current.getBoundingClientRect().top + rootTopBorderWidth);
        const headerTop = Math.round(headerRef.current.getBoundingClientRect().top);
        if (rootTop < headerTop) {
          setIsStuck(true);
        } else {
          setIsStuck(false);
        }

        const rootBottom = Math.round(rootRef.current.getBoundingClientRect().bottom - rootTopBorderWidth);
        const headerBottom = Math.round(headerRef.current.getBoundingClientRect().bottom);
        if (rootBottom <= headerBottom) {
          setIsStuckAtBottom(true);
        } else {
          setIsStuckAtBottom(false);
        }
      }
    },
    [rootRef, headerRef]
  );

  useEffect(() => {
    if (isSticky) {
      const controller = new AbortController();
      window.addEventListener('scroll', checkIfStuck, { capture: true, signal: controller.signal });
      window.addEventListener('resize', checkIfStuck, { signal: controller.signal });
      return () => {
        controller.abort();
      };
    }
  }, [isSticky, checkIfStuck]);

  return { isStuck, isStuckAtBottom };
}
