// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../colors.js';

export const baseTokens: StyleDictionary.ColorsDictionary = {
  colorTextButtonNormalDefault: '{colorGrey100}',
  colorBorderButtonNormalDefault: '{colorGrey100}',
  colorBackgroundButtonNormalDefault: 'transparent',
  colorTextButtonNormalHover: '{colorWhite}',
  colorBorderButtonNormalHover: '{colorWhite}',
  colorBackgroundButtonNormalHover: 'rgba(0, 7, 22, 0.15)',
  colorTextButtonNormalActive: '{colorWhite}',
  colorBorderButtonNormalActive: '{colorWhite}',
  colorBackgroundButtonNormalActive: 'rgba(0, 7, 22, 0.2)',
  colorBorderItemFocused: '{colorGrey100}',
  colorTextExpandableSectionDefault: '{colorGrey100}',
  colorTextExpandableSectionHover: '{colorWhite}',
  colorTextBodyDefault: '{colorGrey100}',
  colorTextHeadingSecondary: '{colorGrey100}',
  colorBorderDividerDefault: '{colorGrey100}',
  colorTextTutorialHotspotDefault: '{colorGrey300}',
  colorTextTutorialHotspotHover: '{colorGrey100}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, baseTokens)
);

export { expandedTokens as tokens };
