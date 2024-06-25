// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AppLayoutPropsWithDefaults } from '../interfaces';
import { SPLIT_PANEL_MIN_WIDTH } from '../split-panel';

interface HorizontalLayoutInput {
  navigationOpen: boolean;
  navigationWidth: number;
  placement: AppLayoutPropsWithDefaults['placement'];
  minContentWidth: number;
  activeDrawerSize: number;
  splitPanelOpen: boolean;
  splitPanelPosition: 'side' | 'bottom' | undefined;
  splitPanelSize: number;
}

export function computeHorizontalLayout({
  navigationOpen,
  navigationWidth,
  placement,
  minContentWidth,
  activeDrawerSize,
  splitPanelOpen,
  splitPanelPosition,
  splitPanelSize,
}: HorizontalLayoutInput) {
  const contentPadding = 2 * 24; // space-xl
  const activeNavigationWidth = navigationOpen ? navigationWidth : 0;

  const resizableSpaceAvailable = Math.max(
    0,
    placement.inlineSize - minContentWidth - contentPadding - activeNavigationWidth
  );

  const splitPanelForcedPosition = resizableSpaceAvailable - activeDrawerSize < SPLIT_PANEL_MIN_WIDTH;
  const resolvedSplitPanelPosition = splitPanelForcedPosition ? 'bottom' : splitPanelPosition ?? 'bottom';
  const sideSplitPanelSize = resolvedSplitPanelPosition === 'side' && splitPanelOpen ? splitPanelSize ?? 0 : 0;
  const maxSplitPanelSize = resizableSpaceAvailable - activeDrawerSize;
  const maxDrawerSize = resizableSpaceAvailable - sideSplitPanelSize;

  return {
    splitPanelPosition: resolvedSplitPanelPosition,
    splitPanelForcedPosition,
    sideSplitPanelSize,
    maxSplitPanelSize,
    maxDrawerSize,
  };
}

interface VerticalLayoutInput {
  topOffset: number;
  hasVisibleToolbar: boolean;
  toolbarHeight: number;
  stickyNotifications: boolean;
  notificationsHeight: number;
}

export interface VerticalLayoutOutput {
  toolbar: number;
  notifications: number;
  header: number;
}

export function computeVerticalLayout({
  topOffset,
  hasVisibleToolbar,
  toolbarHeight,
  stickyNotifications,
  notificationsHeight,
}: VerticalLayoutInput): VerticalLayoutOutput {
  const toolbar = topOffset;
  let notifications = topOffset;
  if (hasVisibleToolbar) {
    notifications += toolbarHeight;
  }
  let header = notifications;
  if (stickyNotifications) {
    header += notificationsHeight;
  }

  return { toolbar, notifications, header };
}
