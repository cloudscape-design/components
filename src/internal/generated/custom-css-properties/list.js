// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
 * This file is only needed to generate the proper js ans scss files at build step generateCustomCssPropertiesMap
 */

const customCssPropertiesList = [
  // App layout
  'offsetTop',
  'offsetTopWithNotifications',
  'contentGapLeft',
  'contentGapRight',
  'contentHeight',
  'defaultMaxContentWidth',
  'defaultMinContentWidth',
  'footerHeight',
  'headerHeight',
  'layoutWidth',
  'mainOffsetLeft',
  'maxContentWidth',
  'minContentWidth',
  'notificationsHeight',
  'overlapHeight',
  'navigationWidth',
  'splitPanelReportedHeaderSize',
  'splitPanelReportedSize',
  'splitPanelMinWidth',
  'splitPanelMaxWidth',
  'toolsMaxWidth',
  'toolsWidth',
  'toolsAnimationStartingOpacity',
  'contentScrollMargin',

  // Grid
  'gridGutterGap',
  'gridColumnSpan',
];
module.exports = customCssPropertiesList;
