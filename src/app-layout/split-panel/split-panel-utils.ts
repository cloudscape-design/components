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
  // If a scrollbar is present on the body, allow the split panel to stay on the side even if there is a bit less space than there should be,
  // but only if already on the side, not if it is currently at the bottom.
  const minWidth = isForcedRef.current ? SPLIT_PANEL_MIN_WIDTH : getSplitPanelMinWidth();
  const isForced = splitPanelMaxWidth < minWidth;
  isForcedRef.current = isForced;
  return isForced;
}

// Returns split panel min width with a margin for document scrollbar.
// The margin prevents a possible infinite bouncing between bottom and side positions
// caused by the presence of page's vertical scrollbar when on side position only.
function getSplitPanelMinWidth() {
  if (typeof document === 'undefined') {
    return SPLIT_PANEL_MIN_WIDTH;
  }
  const margin = SPLIT_PANEL_SCROLLBAR_MARGIN / 2;
  const hasScrollbar = window.document.documentElement.scrollHeight > window.document.documentElement.clientHeight;
  return hasScrollbar ? SPLIT_PANEL_MIN_WIDTH - margin : SPLIT_PANEL_MIN_WIDTH + margin;
}
