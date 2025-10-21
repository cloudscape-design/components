// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../colors.js';

export const baseTokens: StyleDictionary.ColorsDictionary = {
  colorTextButtonNormalDefault: '{colorNeutral100}',
  colorBorderButtonNormalDefault: '{colorNeutral100}',
  colorBackgroundButtonNormalDefault: 'transparent',
  colorTextButtonNormalHover: '{colorWhite}',
  colorBorderButtonNormalHover: '{colorWhite}',
  colorBackgroundButtonNormalHover: 'rgba(0, 7, 22, 0.15)',
  colorTextButtonNormalActive: '{colorWhite}',
  colorBorderButtonNormalActive: '{colorWhite}',
  colorBackgroundButtonNormalActive: 'rgba(0, 7, 22, 0.2)',
  colorBorderItemFocused: '{colorNeutral100}',
  colorTextExpandableSectionDefault: '{colorNeutral100}',
  colorTextExpandableSectionHover: '{colorWhite}',
  colorTextBodyDefault: '{colorNeutral100}',
  colorTextHeadingSecondary: '{colorNeutral100}',
  colorBorderDividerDefault: '{colorNeutral100}',
  colorTextTutorialHotspotDefault: '{colorNeutral300}',
  colorTextTutorialHotspotHover: '{colorNeutral100}',
  colorBackgroundInlineCode: 'rgba(0, 0, 0, 0.2)',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, baseTokens)
);

export { expandedTokens as tokens };
