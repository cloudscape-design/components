// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

interface Coords {
  x?: number;
  y?: number;
}

export default function usePositionObserver(
  triggerRef: React.RefObject<Element> | undefined,
  trackKey: string | number | undefined,
  callback: () => void
) {
  const stableCallback = useStableCallback(callback);

  useEffect(() => {
    if (!triggerRef?.current) {
      return;
    }

    let lastTrackKey = trackKey;

    let lastPosition: Coords = {
      x: triggerRef.current.getBoundingClientRect().x,
      y: triggerRef.current.getBoundingClientRect().y,
    };

    const observer = new MutationObserver(() => {
      if (!triggerRef.current) {
        return;
      }

      const { x, y } = triggerRef.current.getBoundingClientRect();

      // Only trigger the callback when the position changes or the track key changes
      if (x !== lastPosition.x || y !== lastPosition.y || trackKey !== lastTrackKey) {
        lastTrackKey = trackKey;
        lastPosition = { x, y };
        stableCallback();
      }
    });

    // Observe the entire ownerDocument for DOM changes
    observer.observe(triggerRef.current.ownerDocument, {
      attributes: true,
      subtree: true,
      childList: true,
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRef, stableCallback]); // trackKey excluded to avoid the observer being recreated everytime the value changes, causing rendering issues for Tooltip
}
