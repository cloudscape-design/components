// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/color-palette.js';

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
  colorRed100: '#fdf3f1',
  colorRed500: '#ff5d64',
  colorRed600: '#d13212',
  colorRed900: '#270a11',
  colorYellow800: '#906806',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
