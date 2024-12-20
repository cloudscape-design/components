// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { SplitPanelProvider, SplitPanelProviderProps } from '../../split-panel';
import { getDrawerStyles } from '../compute-layout';
import { AppLayoutInternals } from '../interfaces';

import styles from './styles.css.js';

interface AppLayoutSplitPanelDrawerSideImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  splitPanelInternals: SplitPanelProviderProps;
  children: React.ReactNode;
}

export function AppLayoutSplitPanelDrawerSideImplementation({
  children,
  appLayoutInternals,
  splitPanelInternals,
}: AppLayoutSplitPanelDrawerSideImplementationProps) {
  const { splitPanelControlId, placement, verticalOffsets, isMobile, splitPanelAnimationDisabled } = appLayoutInternals;
  const { drawerTopOffset, drawerHeight } = getDrawerStyles(verticalOffsets, isMobile, placement);

  return (
    <SplitPanelProvider {...splitPanelInternals} animationDisabled={splitPanelAnimationDisabled}>
      <section
        id={splitPanelControlId}
        className={styles['split-panel-side']}
        style={{
          blockSize: drawerHeight,
          insetBlockStart: drawerTopOffset,
        }}
      >
        {children}
      </section>
    </SplitPanelProvider>
  );
}

interface AppLayoutSplitPanelDrawerBottomImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  splitPanelInternals: SplitPanelProviderProps;
  children: React.ReactNode;
}

export function AppLayoutSplitPanelDrawerBottomImplementation({
  children,
  splitPanelInternals,
  appLayoutInternals,
}: AppLayoutSplitPanelDrawerBottomImplementationProps) {
  const { splitPanelControlId, splitPanelAnimationDisabled } = appLayoutInternals;
  return (
    <SplitPanelProvider {...splitPanelInternals} animationDisabled={splitPanelAnimationDisabled}>
      <section id={splitPanelControlId}>{children}</section>
    </SplitPanelProvider>
  );
}

export const createWidgetizedAppLayoutSplitPanelDrawerSide = createWidgetizedComponent(
  AppLayoutSplitPanelDrawerSideImplementation
);

export const createWidgetizedAppLayoutSplitPanelDrawerBottom = createWidgetizedComponent(
  AppLayoutSplitPanelDrawerBottomImplementation
);
