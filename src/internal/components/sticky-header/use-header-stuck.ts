// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useEffect, useState } from 'react';

interface UseHeaderStuckResult {
  isStuck: boolean;
  isStuckAtBottom: boolean;
}

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
        setIsStuck(rootTop < headerTop);

        const rootBottom = Math.round(rootRef.current.getBoundingClientRect().bottom - rootTopBorderWidth);
        const headerBottom = Math.round(headerRef.current.getBoundingClientRect().bottom);
        setIsStuckAtBottom(rootBottom <= headerBottom);
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
