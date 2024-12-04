// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { browserScrollbarSize } from '../../internal/utils/browser-scrollbar-size';
import { SPLIT_PANEL_MIN_WIDTH } from './constants';

/**
 * Even if the Split Panel is set to be displayed on the side, it will be forced to the bottom
 * if the available space is less than 280px.
 *
 * We also have to account for the fact that after the split panel changes its position
 * from bottom to side or vice versa, there is a chance that the content  a scrollbar appears or disappears from the page,
 * which changes the available space again. This could potentially lead to an infinite loop.
 * To prevent that, we give the split panel some "resistance" to change from bottom to side
 * (but not from side to bottom), requiring in this case some extra space on top of the "nominal" 280px.
 */

function checkBasedOnPreviousPosition() {
  let isForced = false; // Remember position for the next render
  return (availableWidthForSplitPanel: number) => {
    const minWidth = isForced ? SPLIT_PANEL_MIN_WIDTH + browserScrollbarSize().width : SPLIT_PANEL_MIN_WIDTH;
    isForced = availableWidthForSplitPanel < minWidth;
    return isForced;
  };
}

const checkForcedPosition = checkBasedOnPreviousPosition();

export function shouldSplitPanelBeForcedToBottom({
  isMobile,
  availableWidthForSplitPanel,
}: {
  isMobile: boolean;
  availableWidthForSplitPanel: number;
}) {
  if (isMobile) {
    return true;
  }

  return checkForcedPosition(availableWidthForSplitPanel);
}
