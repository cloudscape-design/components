// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { tokens as brand } from '../core/color-palette.js';
import { StyleDictionary } from '../utils/interfaces.js';

const tokens: StyleDictionary.ColorPaletteDictionary = {
  colorGrey50: brand.colorGrey50,
  colorGrey100: brand.colorGrey100,
  colorGrey125: brand.colorGrey150,
  colorGrey150: brand.colorGrey200,
  colorGrey200: brand.colorGrey250,
  colorGrey300: brand.colorGrey300,
  colorGrey350: brand.colorGrey350,
  colorGrey400: brand.colorGrey400,
  colorGrey450: brand.colorGrey450,
  colorGrey500: brand.colorGrey500,
  colorGrey550: brand.colorGrey600,
  colorGrey600: brand.colorGrey650,
  colorGrey650: brand.colorGrey700,
  colorGrey700: brand.colorGrey750,
  colorGrey750: brand.colorGrey800,
  colorGrey800: brand.colorGrey850,
  colorGrey850: brand.colorGrey900,
  colorGrey900: brand.colorGrey950,
  colorGrey950: brand.colorGrey1000,

  colorBlue100: brand.colorBlue50,
  colorBlue200: brand.colorBlue100,
  colorBlue300: brand.colorBlue200,
  colorBlue400: brand.colorBlue300,
  colorBlue500: brand.colorBlue400,
  colorBlue600: brand.colorBlue600,
  colorBlue700: brand.colorBlue700,
  colorBlue800: brand.colorBlue900,
  colorBlue900: brand.colorBlue1000,

  colorGreen100: brand.colorGreen50,
  colorGreen500: brand.colorGreen500,
  colorGreen600: brand.colorGreen600,
  colorGreen700: brand.colorGreen900,
  colorGreen900: brand.colorGreen1000,

  colorRed100: brand.colorRed50,
  colorRed500: brand.colorRed400,
  colorRed600: brand.colorRed600,
  colorRed700: brand.colorRed900,
  colorRed900: brand.colorRed1000,

  colorYellow100: brand.colorYellow50,
  colorYellow600: brand.colorYellow400,
  colorYellow700: brand.colorYellow500,
  colorYellow800: brand.colorYellow900,
  colorYellow900: brand.colorYellow1000,

  colorPurple400: brand.colorPurple400,
  colorPurple600: brand.colorPurple700,

  colorOrange500: '#ec7211',
  colorOrange600: '#eb5f07',

  colorAmazonOrange: brand.colorAmber400,
  colorAwsSquidInk: '#232f3e',
  colorTransparent: 'transparent',
  colorBlack: '#000000',
  colorWhite: '#ffffff',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, tokens);

export { expandedTokens as tokens };
