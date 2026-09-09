// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import {
  createAlertContext,
  createAppLayoutToolbarContext,
  createCompactTableContext,
  createFlashbarContext,
  createFlashbarWarningContext,
  createHeaderAlertContext,
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

// core-update is an override on top of visual-refresh. Each core-update category module
// is self-contained: it merges the core-update overrides onto the visual-refresh base
// and exports the complete category. Categories that core-update does not customize
// (color-charts, color-severity, motion, shadows) are taken from visual-refresh
// directly. color-palette comes first so the seeded primary reference tokens are
// registered before any token resolves against them.
const tokenCategories: Array<StyleDictionary.CategoryModule> = [
  await import('./color-palette.js'),
  await import('../visual-refresh/color-charts.js'),
  await import('../visual-refresh/color-severity.js'),
  await import('./colors.js'),
  await import('./typography.js'),
  await import('./borders.js'),
  await import('../visual-refresh/motion.js'),
  await import('../visual-refresh/shadows.js'),
  await import('./sizes.js'),
  await import('./spacing.js'),
];

const builder = new ThemeBuilder('core-update', 'body', modes);

tokenCategories.forEach(({ tokens, mode: modeId, referenceTokens }) => {
  const mode = modes.find(m => m.id === modeId);
  if (referenceTokens) {
    builder.addReferenceTokens(referenceTokens, mode);
  }
  builder.addTokens(tokens, mode);
});

// Contexts follow the same convention: core-update context modules merge their
// overrides onto the visual-refresh context base; the others come from visual-refresh.
builder.addContext(createCompactTableContext((await import('../visual-refresh/contexts/compact-table.js')).tokens));
builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
builder.addContext(createHeaderContext((await import('./contexts/header.js')).tokens));
builder.addContext(
  createAppLayoutToolbarContext((await import('../visual-refresh/contexts/app-layout-toolbar.js')).tokens)
);

const notificationContexts = [
  createFlashbarContext((await import('./contexts/flashbar.js')).tokens),
  createFlashbarWarningContext((await import('../visual-refresh/contexts/flashbar-warning.js')).tokens),
  createAlertContext((await import('./contexts/alert.js')).tokens),
  createHeaderAlertContext((await import('../visual-refresh/contexts/header-alert.js')).tokens),
];
notificationContexts.forEach(context => builder.addContext(context));

const theme = builder.build();

export default theme;
