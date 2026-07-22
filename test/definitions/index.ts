// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Each component has its own test definition file.
// Import them here manually to form the full test suite.
import { TestSuite } from './types';
export { TestSuite, TestDefinition, ScreenshotType, ScreenshotTestConfiguration } from './types';

import actionCardSuite from './visual/action-card';
import alertSuite from './visual/alert';
import appLayoutGeneral from './visual/app-layout';
import appLayoutContentPaddings from './visual/app-layout-content-paddings';
import appLayoutDrawers from './visual/app-layout-drawers';
import appLayoutFlashbar from './visual/app-layout-flashbar';
import appLayoutHeader from './visual/app-layout-header';
import appLayoutMulti from './visual/app-layout-multi';
import appLayoutResponsive from './visual/app-layout-responsive';
import appLayoutStickyTableHeaderSplitPanel from './visual/app-layout-sticky-table-header-split-panel';
import appLayoutToolbar from './visual/app-layout-toolbar';
import appLayoutZIndex from './visual/app-layout-z-index';
import areaChartSuite from './visual/area-chart';
import attributeEditorSuite from './visual/attribute-editor';
import autosuggestSuite from './visual/autosuggest';
import badgeSuite from './visual/badge';
import barChartSuite from './visual/bar-chart';
import boxSuite from './visual/box';
import breadcrumbGroupSuite from './visual/breadcrumb-group';
import buttonSuite from './visual/button';
import buttonDropdownSuite from './visual/button-dropdown';
import buttonGroupSuite from './visual/button-group';

// Per-component exports (grouped by component)
export const actionCard: TestSuite[] = [actionCardSuite];
export const alert: TestSuite[] = [alertSuite];
export const appLayout: TestSuite[] = [
  appLayoutGeneral,
  appLayoutContentPaddings,
  appLayoutDrawers,
  appLayoutFlashbar,
  appLayoutHeader,
  appLayoutMulti,
  appLayoutResponsive,
  appLayoutStickyTableHeaderSplitPanel,
  appLayoutToolbar,
  appLayoutZIndex,
];
export const areaChart: TestSuite[] = [areaChartSuite];
export const attributeEditor: TestSuite[] = [attributeEditorSuite];
export const autosuggest: TestSuite[] = [autosuggestSuite];
export const badge: TestSuite[] = [badgeSuite];
export const barChart: TestSuite[] = [barChartSuite];
export const box: TestSuite[] = [boxSuite];
export const breadcrumbGroup: TestSuite[] = [breadcrumbGroupSuite];
export const button: TestSuite[] = [buttonSuite];
export const buttonDropdown: TestSuite[] = [buttonDropdownSuite];
export const buttonGroup: TestSuite[] = [buttonGroupSuite];

export const allSuites: TestSuite[] = [
  ...actionCard,
  ...alert,
  ...appLayout,
  ...areaChart,
  ...attributeEditor,
  ...autosuggest,
  ...badge,
  ...barChart,
  ...box,
  ...breadcrumbGroup,
  ...button,
  ...buttonDropdown,
  ...buttonGroup,
];
