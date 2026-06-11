// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

// visual-refresh/color-palette and core/color-palette form an import cycle (core re-exports
// visual-refresh's reference tokens, while visual-refresh consumes core's `brand` palette).
// The cycle resolves correctly only when visual-refresh/color-palette is evaluated first.
// one-theme/color-palette.ts imports both modules, and import sorting forces the core import
// first, which would trigger a temporal-dead-zone error on `brand`. Evaluating
// visual-refresh/color-palette here first guarantees the safe order (the same ordering the
// previous buildVisualRefresh import used to provide).
import '../visual-refresh/color-palette.js';
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

const tokenCategories: Array<StyleDictionary.CategoryModule> = [
  await import('./color-palette.js'),
  await import('../visual-refresh/color-charts.js'),
  await import('../visual-refresh/color-severity.js'),
  await import('./colors.js'),
  await import('./typography.js'),
  await import('./borders.js'),
  await import('../visual-refresh/motion.js'),
  await import('./sizes.js'),
  await import('./spacing.js'),
  await import('../visual-refresh/shadows.js'),
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
builder.addContext(createHeaderAlertContext((await import('../visual-refresh/contexts/header-alert.js')).tokens));
builder.addContext(createAppLayoutToolbarContext((await import('./contexts/app-layout-toolbar.js')).tokens));
builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
builder.addContext(createHeaderContext((await import('./contexts/header.js')).tokens));
builder.addContext(createFlashbarContext((await import('./contexts/flashbar.js')).tokens));
builder.addContext(createFlashbarWarningContext((await import('./contexts/flashbar-warning.js')).tokens));
builder.addContext(createAlertContext((await import('./contexts/alert.js')).tokens));

const theme = builder.build();
export default theme;
