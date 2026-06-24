// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

// visual-refresh/color-palette and core/color-palette form an import cycle; evaluating
// visual-refresh first ensures core's `brand` is initialized before one-theme/color-palette.ts.
import '../visual-refresh/color-palette.js';
import {
  createAlertContext,
  createAppLayoutToolbarContext,
  createCompactTableContext,
  createFlashbarContext,
  createFlashbarWarningContext,
  createHeaderAlertContext,
  createHeaderContext,
  createStyleBoxGreenContext,
  createStyleBoxGreyContext,
  createStyleBoxIndigoContext,
  createStyleBoxLimeContext,
  createStyleBoxMintContext,
  createStyleBoxOrangeContext,
  createStyleBoxPurpleContext,
  createStyleBoxRedContext,
  createStyleBoxYellowContext,
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
builder.addContext(createHeaderAlertContext((await import('../visual-refresh/contexts/header-alert.js')).tokens));
builder.addContext(createAppLayoutToolbarContext((await import('./contexts/app-layout-toolbar.js')).tokens));
builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
builder.addContext(createHeaderContext((await import('./contexts/header.js')).tokens));
builder.addContext(createFlashbarContext((await import('./contexts/flashbar.js')).tokens));
builder.addContext(createFlashbarWarningContext((await import('./contexts/flashbar-warning.js')).tokens));
builder.addContext(createAlertContext((await import('./contexts/alert.js')).tokens));

const styleBoxContexts = await import('./contexts/style-box.js');
builder.addContext(createStyleBoxRedContext(styleBoxContexts.redTokens));
builder.addContext(createStyleBoxYellowContext(styleBoxContexts.yellowTokens));
builder.addContext(createStyleBoxIndigoContext(styleBoxContexts.indigoTokens));
builder.addContext(createStyleBoxGreenContext(styleBoxContexts.greenTokens));
builder.addContext(createStyleBoxOrangeContext(styleBoxContexts.orangeTokens));
builder.addContext(createStyleBoxPurpleContext(styleBoxContexts.purpleTokens));
builder.addContext(createStyleBoxMintContext(styleBoxContexts.mintTokens));
builder.addContext(createStyleBoxLimeContext(styleBoxContexts.limeTokens));
builder.addContext(createStyleBoxGreyContext(styleBoxContexts.greyTokens));

const theme = builder.build();
export default theme;
