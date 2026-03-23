// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { ReferenceTokens } from '@cloudscape-design/theming-build';

import { expandReferenceTokens } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { referenceTokens as vrReferenceTokens, tokens as parentTokens } from '../visual-refresh/color-palette.js';

/**
 * @deprecated These color palette tokens are deprecated and may be removed in a future version.
 * Use semantic reference tokens instead:
 * - colorGrey* → colorNeutral*
 * - colorBlue* → colorPrimary* or colorInfo*
 * - colorRed* → colorError*
 * - colorGreen* → colorSuccess*
 * - colorYellow* → colorWarning*
 *
 * Reference tokens provide better semantic meaning and consistency across themes.
 */
const tokens: StyleDictionary.ColorPaletteDictionary = {
  colorBlue50: '#f1faff',
  colorBlue200: '#99cbe4',
  colorBlue300: '#44b9d6',
  colorBlue400: '#00a1c9',
  colorBlue600: '#0073bb',
  colorBlue700: '#0a4a74',
  colorBlue1000: '#12293b',
  colorGreen50: '#f2f8f0',
  colorGreen500: '#6aaf35',
  colorGreen600: '#1d8102',
  colorGreen1000: '#172211',
  colorGrey100: '#fafafa',
  colorGrey200: '#f2f3f3',
  colorGrey250: '#eaeded',
  colorGrey300: '#d5dbdb',
  colorGrey400: '#aab7b8',
  colorGrey450: '#95a5a6',
  colorGrey500: '#879596',
  colorGrey600: '#687078',
  colorGrey650: '#545b64',
  colorGrey700: '#414750',
  colorGrey750: '#2a2e33',
  colorGrey800: '#21252c',
  colorGrey850: '#1a2029',
  colorGrey950: '#16191f',
  colorRed50: '#fdf3f1',
  colorRed400: '#ff5d64',
  colorRed600: '#d13212',
  colorRed1000: '#270a11',
  colorYellow900: '#906806',
};

// Reference tokens for classic theme
const referenceTokens: ReferenceTokens = {
  color: {
    primary: {
      50: tokens.colorBlue50,
      200: tokens.colorBlue200,
      300: tokens.colorBlue300,
      400: tokens.colorBlue400,
      600: tokens.colorBlue600,
      700: tokens.colorBlue700,
      1000: tokens.colorBlue1000,
    },
    neutral: {
      100: tokens.colorGrey100,
      200: tokens.colorGrey200,
      250: tokens.colorGrey250,
      300: tokens.colorGrey300,
      400: tokens.colorGrey400,
      450: tokens.colorGrey450,
      500: tokens.colorGrey500,
      600: tokens.colorGrey600,
      650: tokens.colorGrey650,
      700: tokens.colorGrey700,
      750: tokens.colorGrey750,
      800: tokens.colorGrey800,
      850: tokens.colorGrey850,
      950: tokens.colorGrey950,
    },
    error: {
      50: tokens.colorRed50,
      400: tokens.colorRed400,
      600: tokens.colorRed600,
      1000: tokens.colorRed1000,
    },
    success: {
      50: tokens.colorGreen50,
      500: tokens.colorGreen500,
      600: tokens.colorGreen600,
      1000: tokens.colorGreen1000,
    },
    warning: {
      900: tokens.colorYellow900,
    },
    info: {
      50: tokens.colorBlue50,
      300: tokens.colorBlue300,
      400: tokens.colorBlue400,
      600: tokens.colorBlue600,
      1000: tokens.colorBlue1000,
    },
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge({}, parentTokens, tokens);
const expandedReferenceTokens: ReferenceTokens = expandReferenceTokens(merge({}, vrReferenceTokens, referenceTokens));

export { expandedTokens as tokens };
export { expandedReferenceTokens as referenceTokens };

export const mode: StyleDictionary.ModeIdentifier = 'color';
