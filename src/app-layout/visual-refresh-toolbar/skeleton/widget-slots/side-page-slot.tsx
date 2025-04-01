// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../../internal/widgets';
import { ActiveDrawersContext } from '../../../utils/visibility-context';
import {
  AppLayoutDrawerImplementation as AppLayoutDrawer,
  AppLayoutGlobalDrawersImplementation as AppLayoutGlobalDrawers,
} from '../../drawer';
import { AppLayoutInternals } from '../../interfaces';
import { AppLayoutSplitPanelDrawerSideImplementation as AppLayoutSplitPanelSide } from '../../split-panel';
import { SkeletonLayoutProps } from '../index';

import sharedStyles from '../../../resize/styles.css.js';
import styles from '../styles.css.js';

const SidePageSlot = (props: SkeletonLayoutProps) => {
  const {
    appLayoutProps: { splitPanel },
    appLayoutState,
  } = props;
  const {
    resolvedNavigationOpen,
    activeGlobalDrawersIds,
    activeDrawer,
    splitPanelOpen,
    drawers,
    appLayoutInternals,
    splitPanelInternals,
    splitPanelPosition,
    drawerExpandedMode,
  } = appLayoutState ?? {};
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
          <AppLayoutSplitPanelSide appLayoutInternals={appLayoutInternals!} splitPanelInternals={splitPanelInternals!}>
            {splitPanel}
          </AppLayoutSplitPanelSide>
        </div>
      )}
      <div
        className={clsx(
          styles.tools,
          !toolsOpen && styles['panel-hidden'],
          sharedStyles['with-motion-horizontal'],
          resolvedNavigationOpen && !toolsOpen && styles['unfocusable-mobile'],
          toolsOpen && styles['tools-open'],
          drawerExpandedMode && styles.hidden
        )}
      >
        {drawers && drawers.length > 0 && (
          // type casting is safe here since 'drawers' only exists at runtime after appLayoutInternals
          // has been initialized
          <AppLayoutDrawer appLayoutInternals={appLayoutInternals as AppLayoutInternals} />
        )}
      </div>
      <div className={clsx(styles['global-tools'], !globalToolsOpen && styles['panel-hidden'])}>
        <ActiveDrawersContext.Provider value={activeGlobalDrawersIds ?? []}>
          <AppLayoutGlobalDrawers appLayoutInternals={appLayoutInternals as AppLayoutInternals} />
        </ActiveDrawersContext.Provider>
      </div>
    </>
  );
};

export const createWidgetizedAppLayoutSidePageSlot = createWidgetizedComponent(SidePageSlot);
