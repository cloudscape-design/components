// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import {
  createAlertContext,
  createAppLayoutToolbarContext,
  createFlashbarContext,
  createHeaderContext,
  createTopNavigationContext,
} from '../utils/contexts.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { createColorMode, createDensityMode, createMotionMode } from '../utils/modes.js';
import { buildVisualRefresh } from '../visual-refresh/index.js';

const modes = [
  createColorMode('.awsui-dark-mode'),
  createDensityMode('.awsui-compact-mode'),
  createMotionMode('.awsui-motion-disabled'),
];

// One Theme starts from the full visual-refresh token set and layers overrides on top.
const overrides = [
  await import('./colors.js'),
  await import('./typography.js'),
  await import('./borders.js'),
  await import('./spacing.js'),
  await import('./sizes.js'),
] as Array<StyleDictionary.CategoryModule>;

const builder = new ThemeBuilder('one-theme', '.awsui-one-theme', modes);

// Layer 1: visual refresh baseline (full token set + contexts).
await buildVisualRefresh(builder);

// Layer 2: One Theme token overrides.
overrides.forEach(({ tokens, mode: modeId, referenceTokens }) => {
  const mode = modes.find(m => m.id === modeId);
  if (referenceTokens) {
    builder.addReferenceTokens(referenceTokens, mode);
  }
  builder.addTokens(tokens, mode);
});

// Layer 3: One Theme context overrides (replace the VR contexts added in layer 1).
builder.addContext(createAppLayoutToolbarContext((await import('./contexts/app-layout-toolbar.js')).tokens));
builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
builder.addContext(createHeaderContext((await import('./contexts/header.js')).tokens));
builder.addContext(createFlashbarContext((await import('./contexts/flashbar.js')).tokens));
builder.addContext(createAlertContext((await import('./contexts/alert.js')).tokens));

const theme = builder.build();
export default theme;
