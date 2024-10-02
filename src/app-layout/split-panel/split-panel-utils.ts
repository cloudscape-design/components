// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { SPLIT_PANEL_MIN_WIDTH, SPLIT_PANEL_SCROLLBAR_MARGIN } from './constants';

/**
 * The Split Panel will be in forced (bottom) position if the defined minimum width is
 * greater than the maximum width. In other words, the maximum width is the currently
 * available horizontal space based on all other components that are rendered. If the
 * minimum width exceeds this value then there is not enough horizontal space and we must
 * force it to the bottom position.
 */
export function checkSplitPanelForcedPosition({
  isMobile,
  splitPanelMaxWidth,
}: {
  isMobile: boolean;
  splitPanelMaxWidth: number;
}) {
  if (isMobile) {
    return true;
  }
  return splitPanelMaxWidth < getSplitPanelMinWidth();
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
