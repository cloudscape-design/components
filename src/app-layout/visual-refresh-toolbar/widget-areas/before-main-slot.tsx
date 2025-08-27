// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutNavigationImplementation as AppLayoutNavigation } from '../navigation';
import { SkeletonPartProps } from '../skeleton/interfaces';
import { BeforeMainSlotSkeleton } from '../skeleton/skeleton-parts';
import { isWidgetReady } from '../state/invariants';
import { AppLayoutToolbarImplementation as AppLayoutToolbar } from '../toolbar';

import sharedStyles from '../../resize/styles.css.js';
import styles from '../skeleton/styles.css.js';

export const BeforeMainSlotImplementation = ({ toolbarProps, appLayoutState, appLayoutProps }: SkeletonPartProps) => {
  if (!isWidgetReady(appLayoutState)) {
    return (
      <BeforeMainSlotSkeleton
        toolbarProps={toolbarProps}
        appLayoutProps={appLayoutProps}
        appLayoutState={appLayoutState}
      />
    );
  }
  const { activeDrawer, navigationOpen, navigation, expandedDrawerId, navigationAnimationDisabled } =
    appLayoutState.widgetizedState;
  const drawerExpandedMode = !!expandedDrawerId;
  const toolsOpen = !!activeDrawer;
  // Must use `toolbarProps` because all layouts have to apply this mode, not just the one with toolbar
  const drawerExpandedModeInChildLayout = !!toolbarProps?.expandedDrawerId;
  const { __embeddedViewMode: embeddedViewMode } = appLayoutProps as any;
  return (
    <>
      {!!toolbarProps && !embeddedViewMode && (
        <AppLayoutToolbar appLayoutInternals={appLayoutState.appLayoutInternals} toolbarProps={toolbarProps} />
      )}
      {navigation && (
        <div
          className={clsx(
            styles.navigation,
            !navigationOpen && styles['panel-hidden'],
            toolsOpen && styles['unfocusable-mobile'],
            !navigationAnimationDisabled && sharedStyles['with-motion-horizontal'],
            (drawerExpandedMode || drawerExpandedModeInChildLayout) && styles.hidden
          )}
        >
          <AppLayoutNavigation appLayoutInternals={appLayoutState.appLayoutInternals} />
        </div>
      )}
    </>
  );
};

export const createWidgetizedAppLayoutBeforeMainSlot = createWidgetizedComponent(
  BeforeMainSlotImplementation,
  BeforeMainSlotSkeleton
);
