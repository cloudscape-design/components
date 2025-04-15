// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../../../../internal/widgets';
import { AppLayoutSplitPanelDrawerBottomImplementation as AppLayoutSplitPanelBottom } from '../../split-panel';
import { SkeletonLayoutProps } from '../index';

import styles from '../styles.css.js';

const BottomPageContentSlot = (props: SkeletonLayoutProps) => {
  const {
    appLayoutState: { splitPanelPosition, appLayoutInternals, splitPanelInternals },
    appLayoutProps: { placement, splitPanel },
  } = props;
  return (
    <>
      {splitPanelPosition === 'bottom' && (
        <div className={styles['split-panel-bottom']} style={{ insetBlockEnd: placement.insetBlockEnd }}>
          <AppLayoutSplitPanelBottom appLayoutInternals={appLayoutInternals} splitPanelInternals={splitPanelInternals}>
            {splitPanel}
          </AppLayoutSplitPanelBottom>
        </div>
      )}
    </>
  );
};

export const createWidgetizedAppLayoutBottomPageContentSlot = createWidgetizedComponent(BottomPageContentSlot);
