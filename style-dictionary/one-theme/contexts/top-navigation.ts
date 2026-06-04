// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary, pickState } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as vrParentTokens } from '../../visual-refresh/colors.js';
import { tokens as oneThemeParentTokens } from '../colors.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundContainerContent: '{colorNeutralGrey950}',
  colorBorderDividerDefault: '{colorNeutralGrey750}',
  colorBackgroundPopover: '{colorNeutralGrey800}',

  colorTextButtonInlineIconDefault: '{colorIndigo400}',
  colorTextButtonInlineIconHover: '{colorIndigo300}',

  colorBackgroundDropdownItemDefault: '{colorNeutralGrey800}',
  colorBackgroundDropdownItemHover: '{colorNeutralGrey700}',
  colorBackgroundInputDefault: '{colorNeutralGrey950}',

  colorBorderItemFocused: '{colorIndigo500}',
  colorBorderInputFocused: '{colorIndigo500}',

  colorItemSelected: '{colorIndigo400}',
};

const vrDarkValues = pickState(vrParentTokens, 'dark');
const oneThemeDarkValues = pickState(oneThemeParentTokens, 'dark');

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, vrDarkValues, oneThemeDarkValues, tokens)
);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
