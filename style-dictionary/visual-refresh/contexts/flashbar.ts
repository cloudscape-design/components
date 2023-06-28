// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../colors';
import merge from 'lodash/merge';
import { expandColorDictionary } from '../../utils';

const tokens: StyleDictionary.ColorsDictionary = {
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
  colorTextExpandableSectionHover: '{colorBlue500}',
  colorTextExpandableSectionNavigationIconDefault: '{colorGrey300}',
  colorTextBodyDefault: '{colorGrey100}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, tokens)
);

export { expandedTokens as tokens };
