// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/color-palette';
import merge from 'lodash/merge';

const tokens: StyleDictionary.ColorPaletteDictionary = {
  colorBlue100: '#f1faff',
  colorBlue300: '#99cbe4',
  colorBlue400: '#44b9d6',
  colorBlue500: '#00a1c9',
  colorBlue600: '#0073bb',
  colorBlue700: '#0a4a74',
  colorBlue900: '#12293b',
  colorGreen100: '#f2f8f0',
  colorGreen500: '#6aaf35',
  colorGreen600: '#1d8102',
  colorGreen900: '#172211',
  colorGrey100: '#fafafa',
  colorGrey150: '#f2f3f3',
  colorGrey200: '#eaeded',
  colorGrey300: '#d5dbdb',
  colorGrey400: '#aab7b8',
  colorGrey450: '#95a5a6',
  colorGrey500: '#879596',
  colorGrey550: '#687078',
  colorGrey600: '#545b64',
  colorGrey650: '#414750',
  colorGrey700: '#2a2e33',
  colorGrey750: '#21252c',
  colorGrey800: '#1a2029',
  colorGrey900: '#16191f',
  colorRed100: '#fdf3f1',
  colorRed500: '#ff5d64',
  colorRed600: '#d13212',
  colorRed900: '#270a11',
  colorYellow800: '#906806',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
