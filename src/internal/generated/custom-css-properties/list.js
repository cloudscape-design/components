// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
 * This file is only needed to generate the proper js ans scss files at build step generateCustomCssPropertiesMap
 */
const customCssPropertiesList = [
  // AppLayout Custom Properties
  'breadcrumbsGap',
  'contentGapLeft',
  'contentGapRight',
  'contentHeight',
  'defaultMaxContentWidth',
  'defaultMinContentWidth',
  'drawerSize',
  'footerHeight',
  'headerGap',
  'headerHeight',
  'layoutWidth',
  'mainGap',
  'mainOffsetLeft',
  'mainTemplateRows',
  'maxContentWidth',
  'minContentWidth',
  'mobileBarHeight',
  'notificationsGap',
  'notificationsHeight',
  'offsetTop',
  'overlapHeight',
  'navigationWidth',
  'splitPanelReportedHeaderSize',
  'splitPanelReportedSize',
  'splitPanelHeight',
  'splitPanelMinWidth',
  'splitPanelMaxWidth',
  'toolsMaxWidth',
  'toolsWidth',
  'toolsAnimationStartingOpacity',
  // Annotation Context Custom Properties
  'contentScrollMargin',
  // Flashbar Custom Properties
  'flashbarStackDepth',
  'flashbarStackIndex',
  'flashbarStickyBottomMargin',
  'stackedNotificationsBottomMargin',
  'stackedNotificationsDefaultBottomMargin',
  // Dropdown Custom Properties
  'dropdownDefaultMaxWidth',
  // Spinner Custom Properties
  'spinnerRotatorFrom',
  'spinnerRotatorTo',
  'spinnerLineLeftFrom',
  'spinnerLineLeftTo',
  'spinnerLineRightFrom',
  'spinnerLineRightTo',
];
module.exports = customCssPropertiesList;
