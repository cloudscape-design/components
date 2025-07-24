// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { FunctionComponent } from '../../internal/widgets';
import { isAppLayoutDelayedWidget } from '../utils/feature-flags';
import { AppLayoutState as AppLayoutStateImplementation, createWidgetizedAppLayoutState } from './app-layout-state';
import { createWidgetizedAppLayoutDrawer, createWidgetizedAppLayoutGlobalDrawers } from './drawer';
import { createWidgetizedAppLayoutNavigation } from './navigation';
import { createWidgetizedAppLayoutNotifications } from './notifications';
import {
  AfterMainSlotImplementation,
  createWidgetizedAppLayoutAfterMainSlot,
} from './skeleton/widget-slots/after-main-slot';
import {
  BeforeMainSlotImplementation,
  createWidgetizedAppLayoutBeforeMainSlot,
} from './skeleton/widget-slots/before-main-slot';
import {
  BottomContentSlotImplementation,
  createWidgetizedAppLayoutBottomContentSlot,
} from './skeleton/widget-slots/bottom-content-slot';
import {
  createWidgetizedAppLayoutTopContentSlot,
  TopContentSlotImplementation,
} from './skeleton/widget-slots/top-content-slot';
import {
  createWidgetizedAppLayoutSplitPanelDrawerBottom,
  createWidgetizedAppLayoutSplitPanelDrawerSide,
} from './split-panel';
import { createWidgetizedAppLayoutToolbar } from './toolbar';

const enableDelayedComponents = isAppLayoutDelayedWidget();

// Legacy widgetized parts
export const AppLayoutNavigation = createWidgetizedAppLayoutNavigation();
export const AppLayoutDrawer = createWidgetizedAppLayoutDrawer();
export const AppLayoutGlobalDrawers = createWidgetizedAppLayoutGlobalDrawers();
export const AppLayoutNotifications = createWidgetizedAppLayoutNotifications();
export const AppLayoutToolbar = createWidgetizedAppLayoutToolbar();
export const AppLayoutSplitPanelBottom = createWidgetizedAppLayoutSplitPanelDrawerBottom();
export const AppLayoutSplitPanelSide = createWidgetizedAppLayoutSplitPanelDrawerSide();

// Refactored widgetized parts
export const AppLayoutBeforeMainSlot = createWidgetizedAppLayoutBeforeMainSlot(
  createLoadableComponent(BeforeMainSlotImplementation)
);
export const AppLayoutAfterMainSlot = createWidgetizedAppLayoutAfterMainSlot(
  createLoadableComponent(AfterMainSlotImplementation)
);
export const AppLayoutTopContentSlot = createWidgetizedAppLayoutTopContentSlot(
  createLoadableComponent(TopContentSlotImplementation)
);
export const AppLayoutBottomContentSlot = createWidgetizedAppLayoutBottomContentSlot(
  createLoadableComponent(BottomContentSlotImplementation)
);
export const AppLayoutWidgetizedState = createWidgetizedAppLayoutState(
  createLoadableComponent(AppLayoutStateImplementation)
);

export function createLoadableComponent<Props extends Record<string, any>>(Component: FunctionComponent<Props>) {
  if (!enableDelayedComponents) {
    return;
  }
  return (props: Props) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      const timeoutId = setTimeout(() => setMounted(true), 1000);
      return () => clearTimeout(timeoutId);
    }, []);

    if (mounted) {
      return <Component {...props} />;
    }
    // this prop is injected in `createWidgetizedComponent` and is not a part of the component signature
    const { Skeleton } = props as any;

    return Skeleton ? <Skeleton {...props} /> : <div />;
  };
}
