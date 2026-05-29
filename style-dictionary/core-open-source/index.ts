// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ThemeBuilder } from '@cloudscape-design/theming-build';

import { buildCoreOpenSource } from '../core/index.js';
import {
  createAlertContext,
  createFlashbarContext,
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

const overrides: Array<StyleDictionary.CategoryModule> = [
  await import('./colors.js'),
  await import('./typography.js'),
  await import('./borders.js'),
  await import('./spacing.js'),
  await import('./sizes.js'),
];

const builder = new ThemeBuilder('core-open-source', 'body', modes);

// Layer 1: core baseline (full token set + contexts).
await buildCoreOpenSource(builder);

// Layer 2: core-open-source overrides.
overrides.forEach(({ tokens, mode: modeId, referenceTokens }) => {
  const mode = modes.find(m => m.id === modeId);
  if (referenceTokens) {
    builder.addReferenceTokens(referenceTokens, mode);
  }
  builder.addTokens(tokens, mode);
});

// Layer 3: context overrides.
builder.addContext(createTopNavigationContext((await import('./contexts/top-navigation.js')).tokens));
builder.addContext(createHeaderContext((await import('./contexts/header.js')).tokens));
builder.addContext(createFlashbarContext((await import('./contexts/flashbar.js')).tokens));
builder.addContext(createAlertContext((await import('./contexts/alert.js')).tokens));

const theme = builder.build();
export default theme;
