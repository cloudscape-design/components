// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createWidgetizedAppLayoutDrawer, createWidgetizedAppLayoutGlobalDrawers } from './drawer';
import { createWidgetizedAppLayoutNavigation } from './navigation';
import { createWidgetizedAppLayoutNotifications } from './notifications';
import { createWidgetizedUseSkeletonSlotsAttrributes } from './skeleton/widget-slots';
import { createWidgetizedAppLayoutBottomPageContentSlot } from './skeleton/widget-slots/bottom-page-content-slot';
import { createWidgetizedAppLayoutSidePageSlot } from './skeleton/widget-slots/side-page-slot';
import { createWidgetizedAppLayoutTopPageContentSlot } from './skeleton/widget-slots/top-page-content-slot';
import { createWidgetizedAppLayoutTopPageSlot } from './skeleton/widget-slots/top-page-slot';
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
export const AppLayoutSkeletonTopSlot = createWidgetizedAppLayoutTopPageSlot();
export const AppLayoutSkeletonSideSlot = createWidgetizedAppLayoutSidePageSlot();
export const AppLayoutSkeletonTopContentSlot = createWidgetizedAppLayoutTopPageContentSlot();
export const AppLayoutSkeletonBottomContentSlot = createWidgetizedAppLayoutBottomPageContentSlot();

export const useSkeletonSlotsAttributes = createWidgetizedUseSkeletonSlotsAttrributes();
