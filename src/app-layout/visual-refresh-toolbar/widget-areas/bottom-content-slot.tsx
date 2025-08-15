// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { SkeletonPartProps } from '../skeleton/interfaces';
import { AppLayoutSplitPanelDrawerBottomImplementation as AppLayoutSplitPanelBottom } from '../split-panel';
import { isWidgetReady } from '../state/invariants';

import styles from '../skeleton/styles.css.js';

export const BottomContentSlotImplementation = ({ appLayoutState, appLayoutProps }: SkeletonPartProps) => {
  if (!isWidgetReady(appLayoutState)) {
    return null;
  }
  const { splitPanelPosition, placement } = appLayoutState.widgetizedState;
  return (
    <>
      {splitPanelPosition === 'bottom' && (
        <div className={styles['split-panel-bottom']} style={{ insetBlockEnd: placement.insetBlockEnd }}>
          <AppLayoutSplitPanelBottom
            appLayoutInternals={appLayoutState.appLayoutInternals}
            splitPanelInternals={appLayoutState.splitPanelInternals}
          >
            {appLayoutProps.splitPanel}
          </AppLayoutSplitPanelBottom>
        </div>
      )}
    </>
  );
};

export const createWidgetizedAppLayoutBottomContentSlot = createWidgetizedComponent(BottomContentSlotImplementation);
