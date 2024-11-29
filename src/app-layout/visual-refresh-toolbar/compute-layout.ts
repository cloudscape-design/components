// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AppLayoutPropsWithDefaults } from '../interfaces';
import { useSplitPanelForcedPosition } from '../split-panel/use-split-panel-forced-position';

interface HorizontalLayoutInput {
  navigationOpen: boolean;
  navigationWidth: number;
  placement: AppLayoutPropsWithDefaults['placement'];
  minContentWidth: number;
  activeDrawerSize: number;
  splitPanelOpen: boolean;
  splitPanelPosition: 'side' | 'bottom' | undefined;
  splitPanelSize: number;
  isMobile: boolean;
  activeGlobalDrawersSizes: Record<string, number>;
}

export const CONTENT_PADDING = 2 * 24; // space-xl

export function useHorizontalLayout({
  navigationOpen,
  navigationWidth,
  placement,
  minContentWidth,
  activeDrawerSize,
  splitPanelOpen,
  splitPanelPosition,
  splitPanelSize,
  isMobile,
  activeGlobalDrawersSizes,
}: HorizontalLayoutInput) {
  const activeNavigationWidth = navigationOpen ? navigationWidth : 0;

  let resizableSpaceAvailable = Math.max(
    0,
    placement.inlineSize - minContentWidth - CONTENT_PADDING - activeNavigationWidth
  );
  const totalActiveGlobalDrawersSize = Object.values(activeGlobalDrawersSizes).reduce((acc, size) => acc + size, 0);

  const availableWidthForSplitPanel = resizableSpaceAvailable - activeDrawerSize;
  const splitPanelForcedPosition = useSplitPanelForcedPosition({
    isMobile,
    availableWidthForSplitPanel,
  });
  const resolvedSplitPanelPosition = splitPanelForcedPosition ? 'bottom' : splitPanelPosition ?? 'bottom';
  const sideSplitPanelSize = resolvedSplitPanelPosition === 'side' && splitPanelOpen ? splitPanelSize ?? 0 : 0;
  const maxSplitPanelSize = Math.max(resizableSpaceAvailable - totalActiveGlobalDrawersSize - activeDrawerSize, 0);
  resizableSpaceAvailable -= sideSplitPanelSize;
  const maxDrawerSize = resizableSpaceAvailable - totalActiveGlobalDrawersSize;
  const maxGlobalDrawersSizes: Record<string, number> = Object.keys(activeGlobalDrawersSizes).reduce(
    (acc, drawerId) => {
      return {
        ...acc,
        [drawerId]:
          resizableSpaceAvailable -
          activeDrawerSize -
          totalActiveGlobalDrawersSize +
          activeGlobalDrawersSizes[drawerId],
      };
    },
    {}
  );

  return {
    splitPanelPosition: resolvedSplitPanelPosition,
    splitPanelForcedPosition,
    sideSplitPanelSize,
    maxSplitPanelSize,
    maxDrawerSize,
    maxGlobalDrawersSizes,
    totalActiveGlobalDrawersSize,
    resizableSpaceAvailable,
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
  drawers: number;
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
  let drawers = topOffset;

  if (hasVisibleToolbar) {
    notifications += toolbarHeight;
    drawers += toolbarHeight;
  }
  let header = notifications;
  if (stickyNotifications) {
    header += notificationsHeight;
  }

  return { toolbar, notifications, header, drawers };
}

export function getDrawerStyles(
  verticalOffsets: VerticalLayoutOutput,
  isMobile: boolean,
  placement: AppLayoutPropsWithDefaults['placement']
): {
  drawerTopOffset: number;
  drawerHeight: string;
} {
  const drawerTopOffset = isMobile ? verticalOffsets.toolbar : verticalOffsets.drawers ?? placement.insetBlockStart;
  const drawerHeight = `calc(100vh - ${drawerTopOffset}px - ${placement.insetBlockEnd}px)`;
  return { drawerTopOffset, drawerHeight };
}
