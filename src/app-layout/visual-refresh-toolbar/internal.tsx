// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createLoadableComponent } from '../../internal/widgets/loader-mock';
import { createWidgetizedAppLayoutDrawer, createWidgetizedAppLayoutGlobalDrawers } from './drawer';
import { createWidgetizedAppLayoutNavigation } from './navigation';
import { createWidgetizedAppLayoutNotifications } from './notifications';
import {
  createWidgetizedAppLayoutSplitPanelDrawerBottom,
  createWidgetizedAppLayoutSplitPanelDrawerSide,
} from './split-panel';
import { AppLayoutStateProvider as AppLayoutStateImplementation, createWidgetizedAppLayoutState } from './state';
import { createWidgetizedAppLayoutToolbar } from './toolbar';
import { AfterMainSlotImplementation, createWidgetizedAppLayoutAfterMainSlot } from './widget-areas/after-main-slot';
import { BeforeMainSlotImplementation, createWidgetizedAppLayoutBeforeMainSlot } from './widget-areas/before-main-slot';
import {
  BottomContentSlotImplementation,
  createWidgetizedAppLayoutBottomContentSlot,
} from './widget-areas/bottom-content-slot';
import { createWidgetizedAppLayoutTopContentSlot, TopContentSlotImplementation } from './widget-areas/top-content-slot';

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
