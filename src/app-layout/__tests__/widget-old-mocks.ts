// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const renderedProps = new Map();
function createMockComponent(componentName: string) {
  return function Mock(props: any) {
    renderedProps.set(componentName, props);
    return null;
  };
}

// Mock previous widgetized components
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/navigation', () => ({
  createWidgetizedAppLayoutNavigation: () => {},
  AppLayoutNavigationImplementation: createMockComponent('AppLayoutNavigationImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/drawer', () => ({
  createWidgetizedAppLayoutDrawer: () => {},
  AppLayoutDrawerImplementation: createMockComponent('AppLayoutDrawerImplementation'),
  createWidgetizedAppLayoutGlobalDrawers: () => {},
  AppLayoutGlobalDrawersImplementation: createMockComponent('AppLayoutGlobalDrawersImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/notifications', () => ({
  createWidgetizedAppLayoutNotifications: () => {},
  AppLayoutNotificationsImplementation: createMockComponent('AppLayoutNotificationsImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/toolbar', () => ({
  createWidgetizedAppLayoutToolbar: () => {},
  AppLayoutToolbarImplementation: createMockComponent('AppLayoutToolbarImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/split-panel', () => ({
  createWidgetizedAppLayoutSplitPanelDrawerBottom: () => {},
  AppLayoutSplitPanelDrawerBottomImplementation: createMockComponent('AppLayoutSplitPanelDrawerBottomImplementation'),
  createWidgetizedAppLayoutSplitPanelDrawerSide: () => {},
  AppLayoutSplitPanelDrawerSideImplementation: createMockComponent('AppLayoutSplitPanelDrawerSideImplementation'),
}));
