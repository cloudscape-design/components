// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Each component has its own test definition file.
// Import them here manually to form the full test suite.
import { TestSuite } from './types';
export { TestSuite, TestDefinition, ScreenshotType, ScreenshotTestConfiguration } from './types';
export { default as actionCard } from './visual/action-card';
export { default as alert } from './visual/alert';
export { default as appLayout } from './visual/app-layout';
export { default as appLayoutContentPaddings } from './visual/app-layout-content-paddings';
export { default as appLayoutDrawers } from './visual/app-layout-drawers';
export { default as appLayoutFlashbar } from './visual/app-layout-flashbar';
export { default as appLayoutHeader } from './visual/app-layout-header';
export { default as appLayoutMulti } from './visual/app-layout-multi';
export { default as appLayoutResponsive600 } from './visual/app-layout-responsive-600';
export { default as appLayoutResponsive1280 } from './visual/app-layout-responsive-1280';
export { default as appLayoutResponsive1400 } from './visual/app-layout-responsive-1400';
export { default as appLayoutResponsive1920 } from './visual/app-layout-responsive-1920';
export { default as appLayoutResponsive2540 } from './visual/app-layout-responsive-2540';
export { default as appLayoutStickyTableHeaderSplitPanel } from './visual/app-layout-sticky-table-header-split-panel';
export { default as appLayoutToolbar } from './visual/app-layout-toolbar';
export { default as appLayoutZIndex } from './visual/app-layout-z-index';

import actionCard from './visual/action-card';
import alert from './visual/alert';
import appLayout from './visual/app-layout';
import appLayoutContentPaddings from './visual/app-layout-content-paddings';
import appLayoutDrawers from './visual/app-layout-drawers';
import appLayoutFlashbar from './visual/app-layout-flashbar';
import appLayoutHeader from './visual/app-layout-header';
import appLayoutMulti from './visual/app-layout-multi';
import appLayoutResponsive600 from './visual/app-layout-responsive-600';
import appLayoutResponsive1280 from './visual/app-layout-responsive-1280';
import appLayoutResponsive1400 from './visual/app-layout-responsive-1400';
import appLayoutResponsive1920 from './visual/app-layout-responsive-1920';
import appLayoutResponsive2540 from './visual/app-layout-responsive-2540';
import appLayoutStickyTableHeaderSplitPanel from './visual/app-layout-sticky-table-header-split-panel';
import appLayoutToolbar from './visual/app-layout-toolbar';
import appLayoutZIndex from './visual/app-layout-z-index';

export const allSuites: TestSuite[] = [
  actionCard,
  alert,
  appLayout,
  appLayoutContentPaddings,
  appLayoutDrawers,
  appLayoutFlashbar,
  appLayoutHeader,
  appLayoutMulti,
  appLayoutResponsive600,
  appLayoutResponsive1280,
  appLayoutResponsive1400,
  appLayoutResponsive1920,
  appLayoutResponsive2540,
  appLayoutStickyTableHeaderSplitPanel,
  appLayoutToolbar,
  appLayoutZIndex,
];
