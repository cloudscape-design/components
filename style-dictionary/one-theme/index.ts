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
  createNavigationBarContext,
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
  await import('./color-charts.js'),
  await import('./color-severity.js'),
  await import('./colors.js'),
  await import('./typography.js'),
  await import('./borders.js'),
  await import('./motion.js'),
  await import('./sizes.js'),
  await import('./spacing.js'),
  await import('./shadows.js'),
];

export async function buildOneTheme(builder: ThemeBuilder) {
  tokenCategories.forEach(({ tokens, mode: modeId, referenceTokens }) => {
    const mode = modes.find(mode => mode.id === modeId);
    if (referenceTokens) {
      builder.addReferenceTokens(referenceTokens, mode);
    }
    builder.addTokens(tokens, mode);
  });

  // Add contexts for component-specific overrides
  builder.addContext(createCompactTableContext((await import('./contexts/compact-table.js')).tokens));
  builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
  builder.addContext(createHeaderContext((await import('./contexts/header.js')).tokens));
  builder.addContext(createFlashbarContext((await import('./contexts/flashbar.js')).tokens));
  builder.addContext(createFlashbarWarningContext((await import('./contexts/flashbar-warning.js')).tokens));
  builder.addContext(createAlertContext((await import('./contexts/alert.js')).tokens));
  builder.addContext(createHeaderAlertContext((await import('./contexts/header-alert.js')).tokens));
  builder.addContext(createAppLayoutToolbarContext((await import('./contexts/app-layout-toolbar.js')).tokens));
  builder.addContext(createNavigationBarContext((await import('./contexts/navigation-bar.js')).tokens));

  return builder.build();
}

const builder = new ThemeBuilder('one-theme', '.awsui-one-theme', modes);
const theme = await buildOneTheme(builder);

export default theme;
