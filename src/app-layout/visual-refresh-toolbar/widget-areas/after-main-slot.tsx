// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { ActiveDrawersContext } from '../../utils/visibility-context';
import {
  AppLayoutDrawerImplementation as AppLayoutDrawer,
  AppLayoutGlobalDrawersImplementation as AppLayoutGlobalDrawers,
} from '../drawer';
import { SkeletonPartProps } from '../skeleton/interfaces';
import { AppLayoutSplitPanelDrawerSideImplementation as AppLayoutSplitPanelSide } from '../split-panel';
import { isWidgetReady } from '../state/invariants';

import sharedStyles from '../../resize/styles.css.js';
import styles from '../skeleton/styles.css.js';

export const AfterMainSlotImplementation = ({ appLayoutState, appLayoutProps }: SkeletonPartProps) => {
  if (!isWidgetReady(appLayoutState)) {
    return null;
  }
  const {
    navigationOpen,
    activeGlobalDrawersIds,
    expandedDrawerId,
    activeDrawer,
    splitPanelOpen,
    drawers,
    splitPanelPosition,
  } = appLayoutState.widgetizedState;
  const drawerExpandedMode = !!expandedDrawerId;
  const toolsOpen = !!activeDrawer;
  const globalToolsOpen = !!activeGlobalDrawersIds?.length;
  return (
    <>
      {splitPanelPosition === 'side' && (
        <div
          className={clsx(
            styles['split-panel-side'],
            !splitPanelOpen && styles['panel-hidden'],
            drawerExpandedMode && styles.hidden
          )}
        >
          <AppLayoutSplitPanelSide
            appLayoutInternals={appLayoutState.appLayoutInternals}
            splitPanelInternals={appLayoutState.splitPanelInternals}
          >
            {appLayoutProps.splitPanel}
          </AppLayoutSplitPanelSide>
        </div>
      )}
      <div
        className={clsx(
          styles.tools,
          !toolsOpen && styles['panel-hidden'],
          sharedStyles['with-motion-horizontal'],
          navigationOpen && !toolsOpen && styles['unfocusable-mobile'],
          toolsOpen && styles['tools-open'],
          drawerExpandedMode && styles.hidden
        )}
      >
        {drawers && drawers.length > 0 && <AppLayoutDrawer appLayoutInternals={appLayoutState.appLayoutInternals} />}
      </div>
      <div className={clsx(styles['global-tools'], !globalToolsOpen && styles['panel-hidden'])}>
        <ActiveDrawersContext.Provider value={activeGlobalDrawersIds ?? []}>
          <AppLayoutGlobalDrawers appLayoutInternals={appLayoutState.appLayoutInternals} />
        </ActiveDrawersContext.Provider>
      </div>
    </>
  );
};

export const createWidgetizedAppLayoutAfterMainSlot = createWidgetizedComponent(AfterMainSlotImplementation);
