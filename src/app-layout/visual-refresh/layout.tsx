// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useAppLayoutInternals } from './context';
import { SkeletonLayout } from '../skeleton/layout';
import { Drawer } from './drawer';
import { Navigation } from './navigation';
import { Toolbar } from './toolbar';
import { SplitPanelSide } from './split-panel-side';
import { SplitPanelBottom } from './split-panel-bottom';

export function Layout() {
  const {
    contentHeader,
    content,
    navigationWidth,
    navigationOpen,
    activeDrawerId,
    drawerSize,
    contentType,
    notifications,
    disableContentPaddings,
    maxContentWidth,
    placement,
    splitPanelPosition,
  } = useAppLayoutInternals();

  return (
    <SkeletonLayout
      topBar={<Toolbar />} // TODO support scroll away
      notifications={notifications} // TODO support stickyNotifications
      contentHeader={contentHeader}
      content={content}
      navigation={<Navigation />}
      navigationWidth={navigationOpen ? navigationWidth : 0}
      tools={activeDrawerId && <Drawer />}
      toolsWidth={activeDrawerId ? drawerSize : 0}
      sideSplitPanel={splitPanelPosition === 'side' && <SplitPanelSide />}
      bottomSplitPanel={splitPanelPosition === 'bottom' && <SplitPanelBottom />}
      placement={placement}
      contentType={contentType}
      maxContentWidth={maxContentWidth}
      disableContentPaddings={disableContentPaddings}
    />
  );
}
