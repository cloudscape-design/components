// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutNavigationImplementation as AppLayoutNavigation } from '../navigation';
import { SkeletonPartProps } from '../skeleton/interfaces';
import { BeforeMainSlotSkeleton } from '../skeleton/skeleton-parts';
import { AppLayoutToolbarImplementation as AppLayoutToolbar } from '../toolbar';

import styles from '../skeleton/styles.css.js';

export const BeforeMainSlotImplementation = ({ toolbarProps, appLayoutState }: SkeletonPartProps) => {
  if (!appLayoutState.widgetizedState || !appLayoutState.appLayoutInternals) {
    return null;
  }
  const { activeDrawer, navigationOpen, navigation, expandedDrawerId } = appLayoutState.widgetizedState;
  const drawerExpandedMode = !!expandedDrawerId;
  const toolsOpen = !!activeDrawer;
  // Must use `widgetizedProps` because all layouts have to apply this mode, not just the one with toolbar
  const drawerExpandedModeInChildLayout =
    toolbarProps?.widgetizedProps?.expandedDrawerId ?? !!toolbarProps?.expandedDrawerId;
  return (
    <>
      {!!toolbarProps && (
        <AppLayoutToolbar appLayoutInternals={appLayoutState.appLayoutInternals} toolbarProps={toolbarProps} />
      )}
      {navigation && (
        <div
          className={clsx(
            styles.navigation,
            !navigationOpen && styles['panel-hidden'],
            toolsOpen && styles['unfocusable-mobile'],
            // TODO recover
            // !navigationAnimationDisabled && sharedStyles['with-motion-horizontal'],
            (drawerExpandedMode || drawerExpandedModeInChildLayout) && styles.hidden
          )}
        >
          {navigation && <AppLayoutNavigation appLayoutInternals={appLayoutState.appLayoutInternals} />}
        </div>
      )}
    </>
  );
};

export const createWidgetizedAppLayoutBeforeMainSlot = createWidgetizedComponent(
  BeforeMainSlotImplementation,
  BeforeMainSlotSkeleton
);
