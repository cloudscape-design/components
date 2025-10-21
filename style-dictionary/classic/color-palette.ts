// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/color-palette.js';

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

const referenceTokens: StyleDictionary.ReferenceDictionary = {
  colorPrimary50: tokens.colorBlue50,
  colorPrimary200: tokens.colorBlue200,
  colorPrimary300: tokens.colorBlue300,
  colorPrimary400: tokens.colorBlue400,
  colorPrimary600: tokens.colorBlue600,
  colorPrimary700: tokens.colorBlue700,
  colorPrimary1000: tokens.colorBlue1000,
  colorNeutral100: tokens.colorGrey100,
  colorNeutral200: tokens.colorGrey200,
  colorNeutral250: tokens.colorGrey250,
  colorNeutral300: tokens.colorGrey300,
  colorNeutral400: tokens.colorGrey400,
  colorNeutral450: tokens.colorGrey450,
  colorNeutral500: tokens.colorGrey500,
  colorNeutral600: tokens.colorGrey600,
  colorNeutral650: tokens.colorGrey650,
  colorNeutral700: tokens.colorGrey700,
  colorNeutral750: tokens.colorGrey750,
  colorNeutral800: tokens.colorGrey800,
  colorNeutral850: tokens.colorGrey850,
  colorNeutral950: tokens.colorGrey950,
  colorError50: tokens.colorRed50,
  colorError400: tokens.colorRed400,
  colorError600: tokens.colorRed600,
  colorError1000: tokens.colorRed1000,
  colorInfo50: tokens.colorBlue50,
  colorInfo300: tokens.colorBlue300,
  colorInfo400: tokens.colorBlue400,
  colorInfo600: tokens.colorBlue600,
  colorInfo1000: tokens.colorBlue1000,
  colorSuccess50: tokens.colorGreen50,
  colorSuccess500: tokens.colorGreen500,
  colorSuccess600: tokens.colorGreen600,
  colorSuccess1000: tokens.colorGreen1000,
  colorWarning900: tokens.colorYellow900,
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  tokens,
  expandColorDictionary(referenceTokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
