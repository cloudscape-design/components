// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AppLayoutProps } from '../interfaces';
import { SPLIT_PANEL_MIN_WIDTH } from './constants';

/**
 * Returns true if split panel position is forced to the bottom due to the lack of available space.
 */
export function isSplitPanelPositionForced({
  isMobile,
  currentPosition,
  availableSpace,
}: {
  isMobile: boolean;
  currentPosition: AppLayoutProps.SplitPanelPosition;
  availableSpace: number;
}): boolean {
  if (isMobile) {
    return true;
  }

  // When preferred position is "side" the split panel automatically renders to the side when enough space, and is forced
  // to the bottom when not enough space. However, the space computation can be affected by the vertical scrollbar in case
  // it appears when split panel is on the side and disappears when it is on the bottom, which causes an infinite bouncing.
  // To avoid bouncing, a static margin is added but only for side -> bottom transition. This way, if the panel is rendered
  // to the side, and there is slightly less space than expected due to the scrollbar appearance - that is tolerated.
  const splitPanelPositionScrollbarMargin = currentPosition === 'bottom' ? 0 : 20;

  return availableSpace + splitPanelPositionScrollbarMargin < SPLIT_PANEL_MIN_WIDTH;
}
