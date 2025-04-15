// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createWidgetizedAppLayoutDrawer, createWidgetizedAppLayoutGlobalDrawers } from './drawer';
import { createWidgetizedAppLayoutNavigation } from './navigation';
import { createWidgetizedAppLayoutNotifications } from './notifications';
import { createWidgetizedSkeletonLayout } from './skeleton';
import { createWidgetizedUseSkeletonSlotsAttrributes } from './skeleton/widget-slots';
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
export const AppLayoutSkeletonLayout = createWidgetizedSkeletonLayout();

export const useSkeletonSlotsAttributes = createWidgetizedUseSkeletonSlotsAttrributes();
