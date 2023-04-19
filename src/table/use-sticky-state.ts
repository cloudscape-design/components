// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useCallback, useEffect } from 'react';
import { useStickyColumnsContext } from './sticky-columns-context';

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

  const { subscribe, unsubscribe } = useStickyColumnsContext();
  useEffect(() => {
    if (isLastStickyLeft) {
      subscribe(leftCallback);
    } else if (isLastStickyRight) {
      subscribe(rightCallback);
    }
    return () => {
      unsubscribe(leftCallback);
      unsubscribe(rightCallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLastStickyLeft, isLastStickyRight]);

  return { isStuckToTheLeft, isStuckToTheRight };
}
