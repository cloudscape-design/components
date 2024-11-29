// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';

import { SPLIT_PANEL_MIN_WIDTH } from './constants';

// Magnitude which should be equal or larger than the browser scrollbar thickness
const scrollbarThreshold = 20;

/**
 * The Split Panel will be in forced (bottom) position if the defined minimum width is
 * greater than the maximum width. In other words, the maximum width is the currently
 * available horizontal space based on all other components that are rendered. If the
 * minimum width exceeds this value then there is not enough horizontal space and we must
 * force it to the bottom position.
 */
export function useSplitPanelForcedPosition({
  isMobile,
  availableWidthForSplitPanel,
}: {
  isMobile: boolean;
  availableWidthForSplitPanel: number;
}) {
  const isForcedRef = useRef<boolean>(false);
  if (isMobile) {
    return true;
  }
  // After the split panel changes its position from bottom to side or vice versa,
  // there is a chance that a scrollbar appears or disappears from the page,
  // which changes the available space again, potentially causing an infinite loop.
  // To prevent that, we give the split panel some "resistance" to change from bottom to side,
  // requiring some extra space on top of the "nominal" 280px.
  const isAtBottom = isForcedRef.current;
  const minWidth = isAtBottom ? SPLIT_PANEL_MIN_WIDTH + scrollbarThreshold : SPLIT_PANEL_MIN_WIDTH;
  const forceToBottom = availableWidthForSplitPanel < minWidth;
  isForcedRef.current = forceToBottom;
  return forceToBottom;
}
