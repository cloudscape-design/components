// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { tokens as brand } from '../core/color-palette.js';
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

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
  colorGrey50: brand.colorGrey50,
  colorGrey100: brand.colorGrey100,
  colorGrey150: brand.colorGrey150,
  colorGrey200: brand.colorGrey200,
  colorGrey250: brand.colorGrey250,
  colorGrey300: brand.colorGrey300,
  colorGrey350: brand.colorGrey350,
  colorGrey400: brand.colorGrey400,
  colorGrey450: brand.colorGrey450,
  colorGrey500: brand.colorGrey500,
  colorGrey600: brand.colorGrey600,
  colorGrey650: brand.colorGrey650,
  colorGrey700: brand.colorGrey700,
  colorGrey750: brand.colorGrey750,
  colorGrey800: brand.colorGrey800,
  colorGrey850: brand.colorGrey850,
  colorGrey900: brand.colorGrey900,
  colorGrey950: brand.colorGrey950,
  colorGrey1000: brand.colorGrey1000,

  colorBlue50: brand.colorBlue50,
  colorBlue100: brand.colorBlue100,
  colorBlue200: brand.colorBlue200,
  colorBlue300: brand.colorBlue300,
  colorBlue400: brand.colorBlue400,
  colorBlue600: brand.colorBlue600,
  colorBlue700: brand.colorBlue700,
  colorBlue900: brand.colorBlue900,
  colorBlue1000: brand.colorBlue1000,

  colorGreen50: brand.colorGreen50,
  colorGreen500: brand.colorGreen500,
  colorGreen600: brand.colorGreen600,
  colorGreen900: brand.colorGreen900,
  colorGreen1000: brand.colorGreen1000,

  colorRed50: brand.colorRed50,
  colorRed400: brand.colorRed400,
  colorRed600: brand.colorRed600,
  colorRed900: brand.colorRed900,
  colorRed1000: brand.colorRed1000,

  colorYellow50: brand.colorYellow50,
  colorYellow400: brand.colorYellow400,
  colorYellow500: brand.colorYellow500,
  colorYellow900: brand.colorYellow900,
  colorYellow1000: brand.colorYellow1000,

  colorPurple400: brand.colorPurple400,
  colorPurple700: brand.colorPurple700,

  colorAmber400: brand.colorAmber400,
  colorAmber500: brand.colorAmber500,

  colorAwsSquidInk: '#232f3e',
  colorTransparent: 'transparent',
  colorBlack: '#000000',
  colorWhite: '#ffffff',
};

const referenceTokens: StyleDictionary.ReferenceDictionary = {
  colorPrimary50: brand.colorBlue50,
  colorPrimary100: brand.colorBlue100,
  colorPrimary200: brand.colorBlue200,
  colorPrimary300: brand.colorBlue300,
  colorPrimary400: brand.colorBlue400,
  colorPrimary500: brand.colorBlue500,
  colorPrimary600: brand.colorBlue600,
  colorPrimary700: brand.colorBlue700,
  colorPrimary800: brand.colorBlue800,
  colorPrimary900: brand.colorBlue900,
  colorPrimary1000: brand.colorBlue1000,
  colorNeutral50: brand.colorGrey50,
  colorNeutral100: brand.colorGrey100,
  colorNeutral150: brand.colorGrey150,
  colorNeutral200: brand.colorGrey200,
  colorNeutral250: brand.colorGrey250,
  colorNeutral300: brand.colorGrey300,
  colorNeutral350: brand.colorGrey350,
  colorNeutral400: brand.colorGrey400,
  colorNeutral450: brand.colorGrey450,
  colorNeutral500: brand.colorGrey500,
  colorNeutral550: brand.colorGrey550,
  colorNeutral600: brand.colorGrey600,
  colorNeutral650: brand.colorGrey650,
  colorNeutral700: brand.colorGrey700,
  colorNeutral750: brand.colorGrey750,
  colorNeutral800: brand.colorGrey800,
  colorNeutral850: brand.colorGrey850,
  colorNeutral900: brand.colorGrey900,
  colorNeutral950: brand.colorGrey950,
  colorNeutral1000: brand.colorGrey1000,
  colorError50: brand.colorRed50,
  colorError100: brand.colorRed100,
  colorError200: brand.colorRed200,
  colorError300: brand.colorRed300,
  colorError400: brand.colorRed400,
  colorError500: brand.colorRed500,
  colorError600: brand.colorRed600,
  colorError700: brand.colorRed700,
  colorError800: brand.colorRed800,
  colorError900: brand.colorRed900,
  colorError1000: brand.colorRed1000,
  colorInfo50: brand.colorBlue50,
  colorInfo100: brand.colorBlue100,
  colorInfo200: brand.colorBlue200,
  colorInfo300: brand.colorBlue300,
  colorInfo400: brand.colorBlue400,
  colorInfo500: brand.colorBlue500,
  colorInfo600: brand.colorBlue600,
  colorInfo700: brand.colorBlue700,
  colorInfo800: brand.colorBlue800,
  colorInfo900: brand.colorBlue900,
  colorInfo1000: brand.colorBlue1000,
  colorSuccess50: brand.colorGreen50,
  colorSuccess100: brand.colorGreen100,
  colorSuccess200: brand.colorGreen200,
  colorSuccess300: brand.colorGreen300,
  colorSuccess400: brand.colorGreen400,
  colorSuccess500: brand.colorGreen500,
  colorSuccess600: brand.colorGreen600,
  colorSuccess700: brand.colorGreen700,
  colorSuccess800: brand.colorGreen800,
  colorSuccess900: brand.colorGreen900,
  colorSuccess1000: brand.colorGreen1000,
  colorWarning50: brand.colorYellow50,
  colorWarning100: brand.colorYellow100,
  colorWarning200: brand.colorYellow200,
  colorWarning300: brand.colorYellow300,
  colorWarning400: brand.colorYellow400,
  colorWarning500: brand.colorYellow500,
  colorWarning600: brand.colorYellow600,
  colorWarning700: brand.colorYellow700,
  colorWarning800: brand.colorYellow800,
  colorWarning900: brand.colorYellow900,
  colorWarning1000: brand.colorYellow1000,
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  tokens,
  expandColorDictionary(referenceTokens)
);

export const mode: StyleDictionary.ModeIdentifier = 'color';

export { expandedTokens as tokens };
