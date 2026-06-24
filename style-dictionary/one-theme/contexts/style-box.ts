// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

// Content color tokens overridden by each StyleBox variant context.
// The context selector (.awsui-context-style-box-{variant}) is registered in
// style-dictionary/utils/contexts.ts and activated by StyleBox/index.tsx via
// getVisualContextClassname(). The token build pipeline scopes these overrides
// under the selector automatically — no CSS custom property hash strings needed.
//
// Affected tokens (same set for every variant):
//   colorTextBodyDefault, colorTextHeadingDefault, colorTextBodySecondary,
//   colorTextHeadingSecondary, colorTextIconSubtle, colorTextSmall
//
// Palette tokens (colorRedNNN etc.) are ColorPaletteTokenName (global scope) and
// cannot be used as references inside ColorsDictionary values. Literal hex values
// from style-dictionary/core/color-palette.ts are used instead.
//
// Light: 600-level palette value  |  Dark: 200-level palette value
// Exception — grey uses colorNeutralGrey:
//   Light: colorNeutralGrey800 (#242424)  |  Dark: colorNeutralGrey100 (#f9f9f9)

function makeTokens(light: string, dark: string): StyleDictionary.ExpandedColorScopeDictionary {
  const tokens: StyleDictionary.ColorsDictionary = {
    colorTextBodyDefault: { light, dark },
    colorTextHeadingDefault: { light, dark },
    colorTextBodySecondary: { light, dark },
    colorTextHeadingSecondary: { light, dark },
    colorTextIconSubtle: { light, dark },
    colorTextSmall: { light, dark },
  };
  return expandColorDictionary(merge({}, tokens));
}

// Values sourced from style-dictionary/core/color-palette.ts
export const redTokens = makeTokens('#db0000', '#ffc2c2');
export const yellowTokens = makeTokens('#f2b100', '#fef571');
export const indigoTokens = makeTokens('#295eff', '#c2d1ff');
export const greenTokens = makeTokens('#00802f', '#aeffa8');
export const orangeTokens = makeTokens('#db3300', '#ffc0ad');
export const purpleTokens = makeTokens('#962eff', '#e8d1ff');
export const mintTokens = makeTokens('#008559', '#8fffce');
export const limeTokens = makeTokens('#008a00', '#d1ff8a');
export const greyTokens = makeTokens('#242424', '#f9f9f9');
