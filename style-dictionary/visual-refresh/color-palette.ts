// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { tokens as brand } from '../core/color-palette.js';
import { StyleDictionary } from '../utils/interfaces.js';

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

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, tokens);

export { expandedTokens as tokens };
