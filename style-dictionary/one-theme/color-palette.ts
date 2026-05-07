// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import pick from 'lodash/pick.js';

import { ReferenceTokens } from '@cloudscape-design/theming-build';

import { paletteTokens as brand } from '../core/color-palette.js';
import { expandColorDictionary, expandReferenceTokens } from '../utils/index.js';
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
  ...pick(brand, [
    'colorGrey50',
    'colorGrey100',
    'colorGrey150',
    'colorGrey200',
    'colorGrey250',
    'colorGrey300',
    'colorGrey350',
    'colorGrey400',
    'colorGrey450',
    'colorGrey500',
    'colorGrey600',
    'colorGrey650',
    'colorGrey700',
    'colorGrey750',
    'colorGrey800',
    'colorGrey850',
    'colorGrey900',
    'colorGrey950',
    'colorGrey1000',
    'colorBlue50',
    'colorBlue100',
    'colorBlue200',
    'colorBlue300',
    'colorBlue400',
    'colorBlue600',
    'colorBlue700',
    'colorBlue900',
    'colorBlue1000',
    'colorGreen50',
    'colorGreen500',
    'colorGreen600',
    'colorGreen900',
    'colorGreen1000',
    'colorRed50',
    'colorRed400',
    'colorRed600',
    'colorRed900',
    'colorRed1000',
    'colorYellow50',
    'colorYellow400',
    'colorYellow500',
    'colorYellow900',
    'colorYellow1000',
    'colorPurple400',
    'colorPurple700',
    'colorAmber400',
    'colorAmber500',
    'colorAwsSquidInk',
    'colorTransparent',
    'colorBlack',
    'colorWhite',
  ]),
};

// Reference tokens for visual-refresh theme
const referenceTokens: ReferenceTokens = {
  color: {
    primary: {
      50: brand.colorBlue50,
      100: brand.colorBlue100,
      200: brand.colorBlue200,
      300: brand.colorBlue300,
      400: brand.colorBlue400,
      500: brand.colorBlue500,
      600: brand.colorBlue600, // a11y
      700: brand.colorBlue700,
      800: brand.colorBlue800,
      900: brand.colorBlue900,
      1000: brand.colorBlue1000,
    },
    neutral: {
      50: brand.colorGrey50,
      100: brand.colorGrey100,
      150: brand.colorGrey150,
      200: brand.colorGrey200,
      250: brand.colorGrey250,
      300: brand.colorGrey300,
      350: brand.colorGrey350,
      400: brand.colorGrey400,
      450: brand.colorGrey450,
      500: brand.colorGrey500, // a11y
      550: brand.colorGrey550,
      600: brand.colorGrey600,
      650: brand.colorGrey650,
      700: brand.colorGrey700,
      750: brand.colorGrey750,
      800: brand.colorGrey800,
      850: brand.colorGrey850,
      900: brand.colorGrey900,
      950: brand.colorGrey950,
      1000: brand.colorGrey1000,
    },
    error: {
      50: brand.colorRed50,
      400: brand.colorRed400,
      600: brand.colorRed600,
      900: brand.colorRed900,
      1000: brand.colorRed1000,
    },
    success: {
      50: brand.colorGreen50,
      500: brand.colorGreen500,
      600: brand.colorGreen600,
      1000: brand.colorGreen1000,
    },
    warning: {
      50: brand.colorYellow50,
      400: brand.colorYellow400,
      500: brand.colorYellow500,
      900: brand.colorYellow900,
      1000: brand.colorYellow1000,
    },
    info: {
      50: brand.colorBlue50,
      300: brand.colorBlue300,
      400: brand.colorBlue400,
      600: brand.colorBlue600,
      1000: brand.colorBlue1000,
    },
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);
const expandedReferenceTokens: ReferenceTokens = expandReferenceTokens(referenceTokens);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
export { expandedReferenceTokens as referenceTokens };
