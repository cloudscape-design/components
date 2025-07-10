// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

interface Coords {
  x?: number;
  y?: number;
}

export default function usePopoverObserver(triggerRef: React.RefObject<Element> | undefined, callback: () => void) {
  const stableCallback = useStableCallback(callback);

  useEffect(() => {
    if (!triggerRef?.current) {
      return;
    }

    let lastPosition: Coords = {};

    const observer = new MutationObserver(() => {
      if (!triggerRef.current) {
        return;
      }

      const { x, y } = triggerRef.current.getBoundingClientRect();

      // Only trigger the callback when the position changes
      if (x !== lastPosition?.x || y !== lastPosition?.y) {
        lastPosition = { x, y };
        stableCallback();
      }
    });

    // Observe the entire ownerDocument for DOM changes
    observer.observe(triggerRef.current.ownerDocument, { attributes: true, subtree: true, childList: true });

    return () => observer.disconnect();
  }, [triggerRef, stableCallback]);
}
