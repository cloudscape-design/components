// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';
import pick from 'lodash/pick.js';

import { expandedReferenceTokens, paletteTokens as brand } from '../core/color-palette.js';
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

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge({}, tokens, expandedReferenceTokens);

export const mode: StyleDictionary.ModeIdentifier = 'color';

export { expandedTokens as tokens };
