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
import areaChart from './visual/area-chart';
import attributeEditor from './visual/attribute-editor';
import autosuggest from './visual/autosuggest';
import badgeSuite from './visual/badge';
import barChart from './visual/bar-chart';
import boxSuite from './visual/box';
import breadcrumbGroup from './visual/breadcrumb-group';
import buttonSuite from './visual/button';
import buttonGroup from './visual/button-group';

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
export const areaChartSuites: TestSuite[] = [areaChart];
export const attributeEditorSuites: TestSuite[] = [attributeEditor];
export const autosuggestSuites: TestSuite[] = [autosuggest];
export const badge: TestSuite[] = [badgeSuite];
export const barChartSuites: TestSuite[] = [barChart];
export const box: TestSuite[] = [boxSuite];
export const breadcrumbGroupSuites: TestSuite[] = [breadcrumbGroup];
export const button: TestSuite[] = [buttonSuite];
export const buttonGroupSuites: TestSuite[] = [buttonGroup];

export const allSuites: TestSuite[] = [
  ...actionCard,
  ...alert,
  ...appLayout,
  ...areaChartSuites,
  ...attributeEditorSuites,
  ...autosuggestSuites,
  ...badge,
  ...barChartSuites,
  ...box,
  ...breadcrumbGroupSuites,
  ...button,
  ...buttonGroupSuites,
];
