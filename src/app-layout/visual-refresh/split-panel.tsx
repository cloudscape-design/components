// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useAppLayoutInternals } from './context';
import { SplitPanelProvider, SplitPanelProviderProps } from '../split-panel';
import { AppLayoutProps } from '../interfaces';

export function SplitPanelProviderVR({ children }: React.PropsWithChildren<unknown>) {
  const {
    footerHeight,
    handleSplitPanelClick,
    handleSplitPanelPreferencesChange,
    handleSplitPanelResize,
    headerHeight,
    isSplitPanelForcedPosition,
    isSplitPanelOpen,
    setSplitPanelReportedSize,
    setSplitPanelReportedHeaderHeight,
    setSplitPanelToggle,
    splitPanelPosition,
    splitPanelRefs,
    splitPanelSize,
  } = useAppLayoutInternals();

  const props: SplitPanelProviderProps = {
    bottomOffset: 0,
    getMaxHeight: () => {
      const availableHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
      // If the page is likely zoomed in at 200%, allow the split panel to fill the content area.
      return availableHeight < 400 ? availableHeight - 40 : availableHeight - 250;
    },
    maxWidth: typeof document !== 'undefined' ? document.documentElement.clientWidth : Number.POSITIVE_INFINITY,
    isForcedPosition: isSplitPanelForcedPosition,
    isOpen: isSplitPanelOpen,
    leftOffset: 0,
    onPreferencesChange: handleSplitPanelPreferencesChange,
    onResize: handleSplitPanelResize,
    onToggle: handleSplitPanelClick,
    position: splitPanelPosition,
    reportSize: setSplitPanelReportedSize,
    reportHeaderHeight: setSplitPanelReportedHeaderHeight,
    rightOffset: 0,
    size: splitPanelSize || 0,
    topOffset: 0,
    setSplitPanelToggle,
    refs: splitPanelRefs,
  };

  return <SplitPanelProvider {...props}>{children}</SplitPanelProvider>;
}

export function getSplitPanelPosition(
  isSplitPanelForcedPosition: boolean,
  splitPanelPreferences: AppLayoutProps.SplitPanelPreferences | undefined
) {
  let splitPanelPosition: AppLayoutProps.SplitPanelPosition = 'bottom';

  if (!isSplitPanelForcedPosition && splitPanelPreferences?.position === 'side') {
    splitPanelPosition = 'side';
  }

  return splitPanelPosition;
}
