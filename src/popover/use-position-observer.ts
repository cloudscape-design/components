// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* istanbul ignore file - Tested with integration tests */

import { useEffect } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

interface Coords {
  x?: number;
  y?: number;
}

export default function usePositionObserver(
  getTrack: () => null | Element,
  trackKey: string | number | undefined,
  callback: () => void
) {
  const stableCallback = useStableCallback(callback);

  useEffect(() => {
    const track = getTrack();
    if (!track) {
      return;
    }

    let lastTrackKey = trackKey;

    let lastPosition: Coords = {
      x: track.getBoundingClientRect().x,
      y: track.getBoundingClientRect().y,
    };

    const observer = new MutationObserver(() => {
      const track = getTrack();
      if (!track) {
        return;
      }

      const { x, y } = track.getBoundingClientRect();

      // Only trigger the callback when the position changes or the track key changes
      if (x !== lastPosition.x || y !== lastPosition.y || trackKey !== lastTrackKey) {
        lastTrackKey = trackKey;
        lastPosition = { x, y };
        stableCallback();
      }
    });

    // Observe the entire ownerDocument for DOM changes
    observer.observe(track.ownerDocument, {
      attributes: true,
      subtree: true,
      childList: true,
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTrack, stableCallback]); // trackKey excluded to avoid the observer being recreated everytime the value changes, causing rendering issues for Tooltip
}
