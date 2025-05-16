// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { AppLayoutState as AppLayoutStateImplementation, createWidgetizedAppLayoutState } from './app-layout-state';
import { createWidgetizedAppLayoutDrawer, createWidgetizedAppLayoutGlobalDrawers } from './drawer';
import { createWidgetizedAppLayoutNavigation } from './navigation';
import { createWidgetizedAppLayoutNotifications } from './notifications';
import { createWidgetizedAppLayoutBottomPageContentSlot } from './skeleton/widget-slots/bottom-page-content-slot';
import { createWidgetizedAppLayoutSidePageSlot } from './skeleton/widget-slots/side-page-slot';
import { createWidgetizedAppLayoutTopPageContentSlot } from './skeleton/widget-slots/top-page-content-slot';
import { createWidgetizedAppLayoutTopPageSlot, TopPageSlot } from './skeleton/widget-slots/top-page-slot';
import {
  createWidgetizedAppLayoutSplitPanelDrawerBottom,
  createWidgetizedAppLayoutSplitPanelDrawerSide,
} from './split-panel';
import { createWidgetizedAppLayoutToolbar } from './toolbar';

export const AppLayoutNavigation = createWidgetizedAppLayoutNavigation();
export const AppLayoutDrawer = createWidgetizedAppLayoutDrawer();
export const AppLayoutGlobalDrawers = createWidgetizedAppLayoutGlobalDrawers();
export const AppLayoutNotifications = createWidgetizedAppLayoutNotifications();
export const AppLayoutToolbar = createWidgetizedAppLayoutToolbar();
export const AppLayoutSplitPanelBottom = createWidgetizedAppLayoutSplitPanelDrawerBottom();
export const AppLayoutSplitPanelSide = createWidgetizedAppLayoutSplitPanelDrawerSide();
export const AppLayoutSkeletonTopSlot = createWidgetizedAppLayoutTopPageSlot(
  createAppLayoutPart({ Component: TopPageSlot })
);
export const AppLayoutSkeletonSideSlot = createWidgetizedAppLayoutSidePageSlot();
export const AppLayoutSkeletonTopContentSlot = createWidgetizedAppLayoutTopPageContentSlot();
export const AppLayoutSkeletonBottomContentSlot = createWidgetizedAppLayoutBottomPageContentSlot();
export const AppLayoutWidgetizedState = createWidgetizedAppLayoutState(
  createAppLayoutPart({ Component: AppLayoutStateImplementation })
);

const enableDelayedComponents = true;
const enableSyncComponents = false;

export function createAppLayoutPart({ Component }: { Component: React.JSXElementConstructor<any> }) {
  const AppLayoutPartLoader = ({ Skeleton, ...props }: any) => {
    const [mount, setMount] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setTimeout(() => {
        setMount(true);
      }, 500);
    }, []);

    if (enableSyncComponents || (mount && enableDelayedComponents)) {
      return <Component {...props} />;
    }

    if (Skeleton) {
      return <Skeleton ref={ref} {...props} />;
    }
    return <div ref={ref} />;
  };
  return AppLayoutPartLoader;
}
