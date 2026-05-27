// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReferenceTokens } from '@cloudscape-design/theming-build';

import { paletteTokens as corePalette } from '../core/color-palette.js';
import { expandReferenceTokens } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

/**
 * One Theme brand color primitives.
 *
 * These are plain hex values used to populate the referenceTokens palette.
 * They are not registered as design tokens themselves — they only feed into
 * the semantic color scales consumed by the ThemeBuilder.
 */

// ── Neutral ramp (warm near-black → near-white) ───────────────────────────
// Steps must align with PaletteStep: 50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800|850|900|950|1000
// Values outside this set (#080808, #f8f8f8, #f9f9f9, #fcfcfc) are used as
// hex literals directly in token files since they cannot be registered as palette steps.
const neutral = {
  50: '#151515',
  100: '#1A1A1A',
  150: '#1E1E1E',
  200: '#242424',
  300: '#2D2D2D',
  400: '#3B3B3B',
  500: '#494949',
  600: '#6B6B6B',
  650: '#909090',
  700: '#a9a9a9',
  750: '#b7b7b7',
  800: '#c9c9c9',
  850: '#e1e1e1',
  900: '#ededed',
  950: '#f5f5f5',
  1000: '#ffffff',
} as const;

// ── Extra neutral values outside the PaletteStep range ───────────────────
// These cannot be registered as referenceTokens palette steps, so they are
// exported as plain constants for direct use in token files.
export const neutralExtra = {
  nearBlack: '#080808', // darker than neutral[50], used in top-nav active states
  nearWhite1: '#f8f8f8', // between neutral[950] and neutral[1000], used in selected item backgrounds
  nearWhite2: '#f9f9f9', // used in header/top-nav active states
  nearWhite3: '#fcfcfc', // used in app-layout toolbar background
} as const;

// ── Status color values not in the base VR palette ────────────────────────
// These cannot be used as {colorSuccess*} / {colorWarning*} references since
// the steps don't exist in the visual-refresh base palette.
export const statusExtra = {
  successDark: corePalette.colorGreen200, // #aeffa8 — success text in dark mode
  successNotification: corePalette.colorMint700, // #006b48 — flashbar/notification green
  warningDark: corePalette.colorYellow300, // #ffed4d — warning text in dark mode
  warningLight: corePalette.colorYellow800, // #9e6900 — warning text in light mode
} as const;

// ── Primary (indigo) ramp ─────────────────────────────────────────────────
const primary = {
  300: '#94AFFF',
  400: '#7598FF',
  500: '#5C7FFF',
  600: '#295EFF',
  800: '#0033CC',
} as const;

// Reference tokens map the semantic scales to the one-theme primitives.
// The ThemeBuilder uses these to resolve {colorPrimary*} / {colorNeutral*} references.
const referenceTokens: ReferenceTokens = {
  color: {
    primary: {
      300: primary[300],
      400: primary[400],
      500: primary[500],
      600: primary[600],
      800: primary[800],
    },
    neutral: {
      50: neutral[50],
      100: neutral[100],
      150: neutral[150],
      200: neutral[200],
      300: neutral[300],
      400: neutral[400],
      500: neutral[500],
      600: neutral[600],
      650: neutral[650],
      700: neutral[700],
      750: neutral[750],
      800: neutral[800],
      850: neutral[850],
      900: neutral[900],
      950: neutral[950],
      1000: neutral[1000],
    },
    error: {
      400: corePalette.colorRed400, // #ff7a7a
      600: corePalette.colorRed600, // #db0000
    },
    success: {
      500: corePalette.colorGreen500, // #2bb534
      600: corePalette.colorGreen600, // #00802f
    },
    warning: {
      900: corePalette.colorYellow900, // #855900
    },
    info: {
      300: primary[300],
      400: primary[400],
      600: primary[600],
    },
  },
};

const expandedReferenceTokens: ReferenceTokens = expandReferenceTokens(referenceTokens);

export const mode = undefined;
// No palette tokens to export — this file only contributes referenceTokens.
export const tokens: StyleDictionary.ExpandedColorScopeDictionary = {};
export { expandedReferenceTokens as referenceTokens };
