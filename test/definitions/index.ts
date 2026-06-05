// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Each component has its own test definition file.
// Import them here manually to form the full test suite.
import { TestSuite } from './types';
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
import areaChart from './visual/area-chart';
import attributeEditor from './visual/attribute-editor';
import autosuggest from './visual/autosuggest';
import badge from './visual/badge';

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
  areaChart,
  attributeEditor,
  autosuggest,
  badge,
];
