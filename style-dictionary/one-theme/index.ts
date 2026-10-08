// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import {
  createAlertContext,
  createAppLayoutToolbarContext,
  createCompactTableContext,
  createFlashbarContext,
  createFlashbarWarningContext,
  createHeaderContext,
  createTopNavigationContext,
} from '../utils/contexts.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { createColorMode, createDensityMode, createMotionMode } from '../utils/modes.js';

const modes = [
  createColorMode('.awsui-dark-mode'),
  createDensityMode('.awsui-compact-mode'),
  createMotionMode('.awsui-motion-disabled'),
];

const tokenCategories: Array<StyleDictionary.CategoryModule> = [
  await import('./color-palette.js'),
  await import('../visual-refresh/color-charts.js'),
  await import('../visual-refresh/color-severity.js'),
  await import('./colors.js'),
  await import('./typography.js'),
  await import('./borders.js'),
  await import('./motion.js'),
  await import('./shadows.js'),
  await import('./sizes.js'),
  await import('./spacing.js'),
];

const builder = new ThemeBuilder('one-theme', '.awsui-one-theme', modes);

tokenCategories.forEach(({ tokens, mode: modeId, referenceTokens }) => {
  const mode = modes.find(m => m.id === modeId);
  if (referenceTokens) {
    builder.addReferenceTokens(referenceTokens, mode);
  }
  builder.addTokens(tokens, mode);
});

builder.addContext(createCompactTableContext((await import('../visual-refresh/contexts/compact-table.js')).tokens));
builder.addContext(createAppLayoutToolbarContext((await import('./contexts/app-layout-toolbar.js')).tokens));
builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
builder.addContext(createHeaderContext((await import('./contexts/header.js')).tokens));

// Notification design lives in base tokens; these contexts only carry references
// so interactive controls inside notifications follow the notification treatment.
const notificationControlTokens = (await import('./contexts/notification-controls.js')).tokens;
builder.addContext(createFlashbarContext(notificationControlTokens));
builder.addContext(createFlashbarWarningContext(notificationControlTokens));
builder.addContext(createAlertContext(notificationControlTokens));

const theme = builder.build();
export default theme;
