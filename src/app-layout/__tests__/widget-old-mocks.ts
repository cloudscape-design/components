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
  AppLayoutNavigationImplementation: createMockComponent('AppLayoutNavigationImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/drawer', () => ({
  AppLayoutDrawerImplementation: createMockComponent('AppLayoutDrawerImplementation'),
  AppLayoutGlobalDrawersImplementation: createMockComponent('AppLayoutGlobalDrawersImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/notifications', () => ({
  AppLayoutNotificationsImplementation: createMockComponent('AppLayoutNotificationsImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/toolbar', () => ({
  AppLayoutToolbarImplementation: createMockComponent('AppLayoutToolbarImplementation'),
}));
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/split-panel', () => ({
  AppLayoutSplitPanelDrawerBottomImplementation: createMockComponent('AppLayoutSplitPanelDrawerBottomImplementation'),
  AppLayoutSplitPanelDrawerSideImplementation: createMockComponent('AppLayoutSplitPanelDrawerSideImplementation'),
}));
