// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import {
  createAlertContext,
  createAppLayoutToolsDrawerTriggerContext,
  createCompactTableContext,
  createFlashbarContext,
  createFlashbarWarningContext,
  createTopNavigationContext,
  excludeOneTheme,
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

export async function buildClassicOpenSource(builder: ThemeBuilder) {
  tokenCategories.forEach(({ tokens, mode: modeId, referenceTokens }) => {
    const mode = modes.find(mode => mode.id === modeId);
    if (referenceTokens) {
      builder.addReferenceTokens(referenceTokens, mode);
    }
    builder.addTokens(tokens, mode);
  });

  builder.addContext(createCompactTableContext((await import('./contexts/compact-table.js')).tokens));
  builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
  builder.addContext(
    createAppLayoutToolsDrawerTriggerContext((await import('./contexts/tools-drawer-trigger.js')).tokens)
  );

  // One theme styles notifications through base tokens and defines no flashbar
  // or alert contexts. For packages bundling both themes, we scope out one
  // theme so contexts don't override one theme colors.
  const notificationContexts = [
    createFlashbarContext((await import('./contexts/flashbar.js')).tokens),
    createFlashbarWarningContext((await import('./contexts/flashbar-warning.js')).tokens),
    createAlertContext((await import('./contexts/alert.js')).tokens),
  ];
  notificationContexts.forEach(context => builder.addContext(excludeOneTheme(context)));

  return builder.build();
}

const builder = new ThemeBuilder('classic', 'body', modes);
const theme = await buildClassicOpenSource(builder);

export default theme;
