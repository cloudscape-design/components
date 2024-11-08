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
  animationDisabled?: boolean;
}

export function AppLayoutSplitPanelDrawerSideImplementation({
  children,
  appLayoutInternals,
  splitPanelInternals,
  animationDisabled,
}: AppLayoutSplitPanelDrawerSideImplementationProps) {
  const { splitPanelControlId, placement, verticalOffsets, isMobile } = appLayoutInternals;
  const { drawerTopOffset, drawerHeight } = getDrawerStyles(verticalOffsets, isMobile, placement);

  return (
    <SplitPanelProvider {...splitPanelInternals} animationDisabled={animationDisabled}>
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

export interface AppLayoutSplitPanelDrawerBottomImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  splitPanelInternals: SplitPanelProviderProps;
  children: React.ReactNode;
  animationDisabled?: boolean;
}

export function AppLayoutSplitPanelDrawerBottomImplementation({
  children,
  splitPanelInternals,
  animationDisabled,
}: AppLayoutSplitPanelDrawerBottomImplementationProps) {
  return (
    <SplitPanelProvider {...splitPanelInternals} animationDisabled={animationDisabled}>
      {children}
    </SplitPanelProvider>
  );
}

export const createWidgetizedAppLayoutSplitPanelDrawerSide = createWidgetizedComponent(
  AppLayoutSplitPanelDrawerSideImplementation
);

export const createWidgetizedAppLayoutSplitPanelDrawerBottom = createWidgetizedComponent(
  AppLayoutSplitPanelDrawerBottomImplementation
);
