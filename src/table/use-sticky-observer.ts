// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useCallback, useEffect } from 'react';
import { useIntersectionObserver } from './use-intersection-observer';

export const LEFT_SENTINEL_ID = 'left_sentinel';
export const RIGHT_SENTINEL_ID = 'right_sentinel';

export function useStickyObserver(isLastStickyLeft = false, isLastStickyRight = false) {
  const [isStuckToTheLeft, setIsStuckToTheLeft] = useState(false);
  const [isStuckToTheRight, setIsStuckToTheRight] = useState(false);

  const leftCallback = useCallback(
    entry => {
      setIsStuckToTheLeft(!entry.isIntersecting);
    },
    [setIsStuckToTheLeft]
  );

  const rightCallback = useCallback(
    entry => {
      setIsStuckToTheRight(!entry.isIntersecting);
    },
    [setIsStuckToTheRight]
  );

  const { registerChildCallback, unregisterChildCallback } = useIntersectionObserver();
  useEffect(() => {
    if (isLastStickyLeft) {
      registerChildCallback?.(LEFT_SENTINEL_ID, leftCallback);
    } else if (isLastStickyRight) {
      registerChildCallback?.(RIGHT_SENTINEL_ID, rightCallback);
    }
    return () => {
      unregisterChildCallback?.(LEFT_SENTINEL_ID, leftCallback);
      unregisterChildCallback?.(RIGHT_SENTINEL_ID, rightCallback);
    };
  }, [
    isLastStickyLeft,
    isLastStickyRight,
    registerChildCallback,
    leftCallback,
    rightCallback,
    unregisterChildCallback,
  ]);

  return { isStuckToTheLeft, isStuckToTheRight };
}
