// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { ActiveDrawersContext } from '../../utils/visibility-context';
import { AppLayoutGlobalAiDrawerImplementation } from '../drawer/global-ai-drawer';
import { AppLayoutNavigationImplementation as AppLayoutNavigation } from '../navigation';
import { SkeletonPartProps } from '../skeleton/interfaces';
import { BeforeMainSlotSkeleton } from '../skeleton/skeleton-parts';
import { isWidgetReady } from '../state/invariants';
import { AppLayoutToolbarImplementation as AppLayoutToolbar } from '../toolbar';

import sharedStyles from '../../resize/styles.css.js';
import styles from '../skeleton/styles.css.js';

export const BeforeMainSlotImplementation = ({ toolbarProps, appLayoutState, appLayoutProps }: SkeletonPartProps) => {
  const wasAiDrawerOpenRef = useRef(false);
  if (!isWidgetReady(appLayoutState)) {
    return (
      <BeforeMainSlotSkeleton
        toolbarProps={toolbarProps}
        appLayoutProps={appLayoutProps}
        appLayoutState={appLayoutState}
      />
    );
  }
  const {
    activeDrawer,
    navigationOpen,
    navigation,
    expandedDrawerId,
    setExpandedDrawerId,
    navigationAnimationDisabled,
    activeAiDrawerId,
    aiDrawerExpandedMode,
    aiDrawer,
    activeAiDrawerSize,
    minAiDrawerSize,
    maxAiDrawerSize,
    onActiveAiDrawerResize,
    aiDrawerFocusControl,
    ariaLabels,
    isMobile,
    drawersOpenQueue,
    onActiveAiDrawerChange,
    activeAiDrawer,
  } = appLayoutState.widgetizedState;
  const drawerExpandedMode = !!expandedDrawerId;
  const toolsOpen = !!activeDrawer;
  // Must use `toolbarProps` because all layouts have to apply this mode, not just the one with toolbar
  const drawerExpandedModeInChildLayout = !!toolbarProps?.expandedDrawerId;
  const { __embeddedViewMode: embeddedViewMode } = appLayoutProps as any;
  return (
    <>
      {!!toolbarProps && !embeddedViewMode && !aiDrawerExpandedMode && (
        <AppLayoutToolbar appLayoutInternals={appLayoutState.appLayoutInternals} toolbarProps={toolbarProps} />
      )}
      {aiDrawer && (
        <div
          className={clsx(
            styles['ai-drawer'],
            (drawerExpandedMode || drawerExpandedModeInChildLayout) && !aiDrawerExpandedMode && styles.hidden
          )}
        >
          <ActiveDrawersContext.Provider value={activeAiDrawer ? [activeAiDrawer.id] : []}>
            {(!!activeAiDrawerId || (aiDrawer?.preserveInactiveContent && wasAiDrawerOpenRef.current)) && (
              <>
                {(wasAiDrawerOpenRef.current = true)}
                <AppLayoutGlobalAiDrawerImplementation
                  show={!!activeAiDrawerId}
                  activeAiDrawer={aiDrawer ?? null}
                  appLayoutInternals={appLayoutState.appLayoutInternals}
                  aiDrawerProps={{
                    activeAiDrawerSize: activeAiDrawerSize!,
                    minAiDrawerSize: minAiDrawerSize!,
                    maxAiDrawerSize: maxAiDrawerSize!,
                    aiDrawer: aiDrawer!,
                    ariaLabels,
                    aiDrawerFocusControl,
                    isMobile,
                    drawersOpenQueue,
                    onActiveAiDrawerChange,
                    onActiveDrawerResize: ({ size }) => onActiveAiDrawerResize(size),
                    expandedDrawerId,
                    setExpandedDrawerId,
                  }}
                />
              </>
            )}
          </ActiveDrawersContext.Provider>
        </div>
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
          <AppLayoutNavigation
            widgetizedState={appLayoutState.widgetizedState}
            appLayoutInternals={appLayoutState.appLayoutInternals}
          />
        </div>
      )}
    </>
  );
};

export const createWidgetizedAppLayoutBeforeMainSlot = createWidgetizedComponent(
  BeforeMainSlotImplementation,
  BeforeMainSlotSkeleton
);
