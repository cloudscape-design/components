// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { SplitPanelProvider, SplitPanelProviderProps } from '../../split-panel';
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
  const { splitPanelControlId, placement } = appLayoutInternals;
  return (
    <SplitPanelProvider {...splitPanelInternals}>
      <section
        id={splitPanelControlId}
        className={styles['split-panel-side']}
        style={{
          blockSize: `calc(100vh - ${placement.insetBlockStart}px - ${placement.insetBlockEnd}px)`,
          insetBlockStart: placement.insetBlockStart,
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
}

export function AppLayoutSplitPanelDrawerBottomImplementation({
  children,
  splitPanelInternals,
}: AppLayoutSplitPanelDrawerBottomImplementationProps) {
  return <SplitPanelProvider {...splitPanelInternals}>{children}</SplitPanelProvider>;
}

export const createWidgetizedAppLayoutSplitPanelDrawerSide = createWidgetizedComponent(
  AppLayoutSplitPanelDrawerSideImplementation
);

export const createWidgetizedAppLayoutSplitPanelDrawerBottom = createWidgetizedComponent(
  AppLayoutSplitPanelDrawerBottomImplementation
);
