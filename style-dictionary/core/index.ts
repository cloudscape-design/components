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

const tokenCategories: Array<StyleDictionary.CategoryModule> = [
  await import('./color-palette.js'),
  await import('../visual-refresh/color-charts.js'),
  await import('../visual-refresh/color-severity.js'),
  await import('../visual-refresh/colors.js'),
  await import('../visual-refresh/typography.js'),
  await import('../visual-refresh/borders.js'),
  await import('../visual-refresh/motion.js'),
  await import('../visual-refresh/sizes.js'),
  await import('../visual-refresh/spacing.js'),
  await import('../visual-refresh/shadows.js'),
];

export async function buildCoreOpenSource(builder: ThemeBuilder) {
  tokenCategories.forEach(({ tokens, mode: modeId }) => {
    const mode = modes.find(mode => mode.id === modeId);
    builder.addTokens(tokens, mode);
  });

  builder.addContext(createCompactTableContext((await import('../visual-refresh/contexts/compact-table.js')).tokens));
  builder.addContext(createTopNavigationContext((await import('../visual-refresh/contexts/top-navigation.js')).tokens));
  builder.addContext(createHeaderContext((await import('../visual-refresh/contexts/header.js')).tokens));
  builder.addContext(createFlashbarContext((await import('../visual-refresh/contexts/flashbar.js')).tokens));
  builder.addContext(
    createFlashbarWarningContext((await import('../visual-refresh/contexts/flashbar-warning.js')).tokens)
  );
  builder.addContext(createAlertContext((await import('../visual-refresh/contexts/alert.js')).tokens));
  builder.addContext(createHeaderAlertContext((await import('../visual-refresh/contexts/header-alert.js')).tokens));
  builder.addContext(
    createAppLayoutToolbarContext((await import('../visual-refresh/contexts/app-layout-toolbar.js')).tokens)
  );

  return builder.build();
}

const builder = new ThemeBuilder('visual-refresh', ':root', modes);
const theme = await buildCoreOpenSource(builder);

export default theme;
