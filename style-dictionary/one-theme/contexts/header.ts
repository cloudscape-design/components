// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary, pickState } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentColorTokens } from '../colors.js';
import { tokens as parentShadowsTokens } from '../shadows.js';

// The header context always renders on a dark background regardless of color mode.

const colorTokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundLayoutMain: '{colorNeutralGrey800}',
};

const darkColorValues = pickState(parentColorTokens, 'dark');
const darkShadowsValues = pickState(parentShadowsTokens, 'dark');

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, darkShadowsValues, darkColorValues, colorTokens)
);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
