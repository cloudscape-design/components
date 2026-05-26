// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import { StyleDictionary } from '../utils/interfaces.js';
import { createColorMode, createDensityMode, createMotionMode } from '../utils/modes.js';
import { buildVisualRefresh } from '../visual-refresh/index.js';

const modes = [
  createColorMode('.awsui-dark-mode'),
  createDensityMode('.awsui-compact-mode'),
  createMotionMode('.awsui-motion-disabled'),
];

// One Theme starts from the full visual-refresh token set and layers overrides on top.
const overrides: Array<StyleDictionary.CategoryModule> = [await import('./colors.js')];

const builder = new ThemeBuilder('one-theme', '.awsui-one-theme', modes);

// Layer 1: visual refresh baseline (full token set + contexts).
await buildVisualRefresh(builder);

// Layer 2: One Theme overrides.
overrides.forEach(({ tokens, mode: modeId, referenceTokens }) => {
  const mode = modes.find(m => m.id === modeId);
  if (referenceTokens) {
    builder.addReferenceTokens(referenceTokens, mode);
  }
  builder.addTokens(tokens, mode);
});

const theme = builder.build();
export default theme;
