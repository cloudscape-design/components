// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useCallback, useEffect } from 'react';
import { useStickyColumnsContext } from './use-sticky-columns-context';

export function useStickyState(isLastStickyLeft = false, isLastStickyRight = false) {
  const [isStuckToTheLeft, setIsStuckToTheLeft] = useState(false);
  const [isStuckToTheRight, setIsStuckToTheRight] = useState(false);

  const leftCallback = useCallback(
    ({ left }) => {
      setIsStuckToTheLeft(left);
    },
    [setIsStuckToTheLeft]
  );

  const rightCallback = useCallback(
    ({ right }) => {
      setIsStuckToTheRight(right);
    },
    [setIsStuckToTheRight]
  );

  const { registerChildCallback, unregisterChildCallback } = useStickyColumnsContext();
  useEffect(() => {
    if (isLastStickyLeft) {
      registerChildCallback?.(leftCallback);
    } else if (isLastStickyRight) {
      registerChildCallback?.(rightCallback);
    }
    return () => {
      unregisterChildCallback?.(leftCallback);
      unregisterChildCallback?.(rightCallback);
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
