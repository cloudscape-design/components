// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export { PACKAGE_VERSION } from './environment';

// Legacy widgetized parts
export {
  AppLayoutDrawerImplementation as AppLayoutDrawer,
  AppLayoutGlobalDrawersImplementation as AppLayoutGlobalDrawers,
} from '../app-layout/visual-refresh-toolbar/drawer';
export { AppLayoutNavigationImplementation as AppLayoutNavigation } from '../app-layout/visual-refresh-toolbar/navigation';
export { AppLayoutNotificationsImplementation as AppLayoutNotifications } from '../app-layout/visual-refresh-toolbar/notifications';
export {
  AppLayoutSplitPanelDrawerBottomImplementation as AppLayoutSplitPanelBottom,
  AppLayoutSplitPanelDrawerSideImplementation as AppLayoutSplitPanelSide,
} from '../app-layout/visual-refresh-toolbar/split-panel';
export { AppLayoutToolbarImplementation as AppLayoutToolbar } from '../app-layout/visual-refresh-toolbar/toolbar';

// Refactored widgetized parts
export { BeforeMainSlotImplementation as AppLayoutBeforeMainSlot } from '../app-layout/visual-refresh-toolbar/widget-areas/before-main-slot';
export { AfterMainSlotImplementation as AppLayoutAfterMainSlot } from '../app-layout/visual-refresh-toolbar/widget-areas/after-main-slot';
export { TopContentSlotImplementation as AppLayoutTopContentSlot } from '../app-layout/visual-refresh-toolbar/widget-areas/top-content-slot';
export { BottomContentSlotImplementation as AppLayoutBottomContentSlot } from '../app-layout/visual-refresh-toolbar/widget-areas/bottom-content-slot';
export { AppLayoutStateProvider as AppLayoutWidgetizedState } from '../app-layout/visual-refresh-toolbar/state';

export { SplitPanelImplementation as SplitPanel } from '../split-panel/implementation';
export { BreadcrumbGroupImplementation as BreadcrumbGroup } from '../breadcrumb-group/implementation';
export { DrawerImplementation as Drawer } from '../drawer/implementation';
export { SideNavigationImplementation as SideNavigation } from '../side-navigation/implementation';
export { HelpPanelImplementation as HelpPanel } from '../help-panel/implementation';
