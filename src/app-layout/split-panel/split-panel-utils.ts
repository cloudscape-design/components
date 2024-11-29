// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';

import { SPLIT_PANEL_MIN_WIDTH, SPLIT_PANEL_SCROLLBAR_MARGIN } from './constants';

/**
 * The Split Panel will be in forced (bottom) position if the defined minimum width is
 * greater than the maximum width. In other words, the maximum width is the currently
 * available horizontal space based on all other components that are rendered. If the
 * minimum width exceeds this value then there is not enough horizontal space and we must
 * force it to the bottom position.
 */
export function useSplitPanelForcedPosition({
  isMobile,
  splitPanelMaxWidth,
}: {
  isMobile: boolean;
  splitPanelMaxWidth: number;
}) {
  const isForcedRef = useRef<boolean>(false);
  if (isMobile) {
    return true;
  }
  // After the split panel changes its position from bottom to side or vice versa,
  // there is a chance that a scrollbar appears or disappears from the page,
  //  which changes the available space again and potentially causing an infinite loop.
  // To prevent that, we give the split panel some "resistance" to change its position:
  // - if it is on the bottom, require the nominal space plus som extra threshold;
  // - if it is at the side, tolerate having the nominal space minus that same threshold before jumping to the bottom.
  const margin = SPLIT_PANEL_SCROLLBAR_MARGIN / 2;
  const isAtBottom = isForcedRef.current;
  const minWidth = isAtBottom ? SPLIT_PANEL_MIN_WIDTH + margin : SPLIT_PANEL_MIN_WIDTH - margin;
  const isForced = splitPanelMaxWidth < minWidth;
  isForcedRef.current = isForced;
  return isForced;
}
