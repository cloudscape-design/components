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
 * - colorNeutralGrey* → colorNeutral*
 * - colorIndigo* → colorPrimary* or colorInfo*
 * - colorRed* → colorError*
 * - colorGreen* → colorSuccess*
 * - colorYellow* → colorWarning*
 *
 * Reference tokens provide better semantic meaning and consistency across themes.
 */
const tokens: StyleDictionary.ColorPaletteDictionary = {
  ...pick(brand, [
    'colorNeutralGrey50',
    'colorNeutralGrey100',
    'colorNeutralGrey150',
    'colorNeutralGrey200',
    'colorNeutralGrey250',
    'colorNeutralGrey300',
    'colorNeutralGrey350',
    'colorNeutralGrey400',
    'colorNeutralGrey450',
    'colorNeutralGrey500',
    'colorNeutralGrey600',
    'colorNeutralGrey650',
    'colorNeutralGrey700',
    'colorNeutralGrey750',
    'colorNeutralGrey800',
    'colorNeutralGrey850',
    'colorNeutralGrey900',
    'colorNeutralGrey950',
    'colorNeutralGrey1000',
    'colorIndigo50',
    'colorIndigo100',
    'colorIndigo200',
    'colorIndigo300',
    'colorIndigo400',
    'colorIndigo500',
    'colorIndigo600',
    'colorIndigo700',
    'colorIndigo800',
    'colorIndigo900',
    'colorIndigo1000',
    'colorGreen50',
    'colorGreen200',
    'colorGreen500',
    'colorGreen600',
    'colorGreen700',
    'colorGreen900',
    'colorGreen1000',
    'colorRed50',
    'colorRed400',
    'colorRed600',
    'colorRed900',
    'colorRed1000',
    'colorYellow50',
    'colorYellow300',
    'colorYellow400',
    'colorYellow500',
    'colorYellow800',
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
      50: brand.colorIndigo50,
      100: brand.colorIndigo100,
      200: brand.colorIndigo200,
      300: brand.colorIndigo300,
      400: brand.colorIndigo400,
      500: brand.colorIndigo500,
      600: brand.colorIndigo600, // a11y
      700: brand.colorIndigo700,
      800: brand.colorIndigo800,
      900: brand.colorIndigo900,
      1000: brand.colorIndigo1000,
    },
    neutral: {
      50: brand.colorNeutralGrey50,
      100: brand.colorNeutralGrey100,
      150: brand.colorNeutralGrey150,
      200: brand.colorNeutralGrey200,
      250: brand.colorNeutralGrey250,
      300: brand.colorNeutralGrey300,
      350: brand.colorNeutralGrey350,
      400: brand.colorNeutralGrey400,
      450: brand.colorNeutralGrey450,
      500: brand.colorNeutralGrey500, // a11y
      600: brand.colorNeutralGrey600,
      650: brand.colorNeutralGrey650,
      700: brand.colorNeutralGrey700,
      750: brand.colorNeutralGrey750,
      800: brand.colorNeutralGrey800,
      850: brand.colorNeutralGrey850,
      900: brand.colorNeutralGrey900,
      950: brand.colorNeutralGrey950,
      1000: brand.colorNeutralGrey1000,
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
      200: brand.colorGreen200,
      500: brand.colorGreen500,
      600: brand.colorGreen600,
      700: brand.colorGreen700,
      1000: brand.colorGreen1000,
    },
    warning: {
      50: brand.colorYellow50,
      300: brand.colorYellow300,
      400: brand.colorYellow400,
      500: brand.colorYellow500,
      800: brand.colorYellow800,
      900: brand.colorYellow900,
      1000: brand.colorYellow1000,
    },
    info: {
      50: brand.colorIndigo50,
      300: brand.colorIndigo300,
      400: brand.colorIndigo400,
      600: brand.colorIndigo600,
      1000: brand.colorIndigo1000,
    },
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);
const expandedReferenceTokens: ReferenceTokens = expandReferenceTokens(referenceTokens);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
export { expandedReferenceTokens as referenceTokens };
