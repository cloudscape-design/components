// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createWidgetizedAppLayoutDrawer, createWidgetizedAppLayoutGlobalDrawers } from './drawer/index.js';
import { createWidgetizedAppLayoutNavigation } from './navigation/index.js';
import { createWidgetizedAppLayoutNotifications } from './notifications/index.js';
import {
  createWidgetizedAppLayoutSplitPanelDrawerBottom,
  createWidgetizedAppLayoutSplitPanelDrawerSide,
} from './split-panel/index.js';
import { createWidgetizedAppLayoutToolbar } from './toolbar/index.js';

export const AppLayoutNavigation = createWidgetizedAppLayoutNavigation();
export const AppLayoutDrawer = createWidgetizedAppLayoutDrawer();
export const AppLayoutGlobalDrawers = createWidgetizedAppLayoutGlobalDrawers();
export const AppLayoutNotifications = createWidgetizedAppLayoutNotifications();
export const AppLayoutToolbar = createWidgetizedAppLayoutToolbar();
export const AppLayoutSplitPanelBottom = createWidgetizedAppLayoutSplitPanelDrawerBottom();
export const AppLayoutSplitPanelSide = createWidgetizedAppLayoutSplitPanelDrawerSide();
