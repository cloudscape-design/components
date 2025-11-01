// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReferenceTokens, ThemeBuilder } from '@cloudscape-design/theming-build';

import { paletteTokens } from '../core/color-palette.js';
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
  await import('./color-palette.js'), // Still needed for now for non-deprecated palette tokens like colorWhite, colorBlack
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

// Reference tokens for visual-refresh theme using new structured format
// This will eventually replace the flat referenceTokens in core/color-palette.ts
const referenceTokens: ReferenceTokens = {
  color: {
    primary: {
      50: paletteTokens.colorBlue50,
      100: paletteTokens.colorBlue100,
      200: paletteTokens.colorBlue200,
      300: paletteTokens.colorBlue300,
      400: paletteTokens.colorBlue400,
      500: paletteTokens.colorBlue500,
      600: paletteTokens.colorBlue600, // a11y
      700: paletteTokens.colorBlue700,
      800: paletteTokens.colorBlue800,
      900: paletteTokens.colorBlue900,
      1000: paletteTokens.colorBlue1000,
    },
    neutral: {
      50: paletteTokens.colorGrey50,
      100: paletteTokens.colorGrey100,
      150: paletteTokens.colorGrey150,
      200: paletteTokens.colorGrey200,
      250: paletteTokens.colorGrey250,
      300: paletteTokens.colorGrey300,
      350: paletteTokens.colorGrey350,
      400: paletteTokens.colorGrey400,
      450: paletteTokens.colorGrey450,
      500: paletteTokens.colorGrey500, // a11y
      550: paletteTokens.colorGrey550,
      600: paletteTokens.colorGrey600,
      650: paletteTokens.colorGrey650,
      700: paletteTokens.colorGrey700,
      750: paletteTokens.colorGrey750,
      800: paletteTokens.colorGrey800,
      850: paletteTokens.colorGrey850,
      900: paletteTokens.colorGrey900,
      950: paletteTokens.colorGrey950,
      1000: paletteTokens.colorGrey1000,
    },
    error: {
      50: paletteTokens.colorRed50,
      300: paletteTokens.colorRed300,
      400: paletteTokens.colorRed400,
      500: paletteTokens.colorRed500,
      600: paletteTokens.colorRed600,
      900: paletteTokens.colorRed900,
      1000: paletteTokens.colorRed1000,
    },
    success: {
      50: paletteTokens.colorGreen50,
      300: paletteTokens.colorGreen300,
      400: paletteTokens.colorGreen400,
      500: paletteTokens.colorGreen500,
      600: paletteTokens.colorGreen600,
      900: paletteTokens.colorGreen900,
      1000: paletteTokens.colorGreen1000,
    },
    warning: {
      50: paletteTokens.colorYellow50,
      300: paletteTokens.colorYellow300,
      400: paletteTokens.colorYellow400,
      500: paletteTokens.colorYellow500,
      600: paletteTokens.colorYellow600,
      900: paletteTokens.colorYellow900,
      1000: paletteTokens.colorYellow1000,
    },
    info: {
      50: paletteTokens.colorBlue50,
      300: paletteTokens.colorBlue300,
      400: paletteTokens.colorBlue400,
      500: paletteTokens.colorBlue500,
      600: paletteTokens.colorBlue600,
      900: paletteTokens.colorBlue900,
      1000: paletteTokens.colorBlue1000,
    },
  },
};

export async function buildVisualRefresh(builder: ThemeBuilder) {
  // Add reference tokens first to generate palette tokens
  builder.addReferenceTokens(referenceTokens);

  // Add existing token categories
  tokenCategories.forEach(({ tokens, mode: modeId }) => {
    const mode = modes.find(mode => mode.id === modeId);
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

  return builder.build();
}

const builder = new ThemeBuilder('visual-refresh', 'body', modes);
const theme = await buildVisualRefresh(builder);

export default theme;
