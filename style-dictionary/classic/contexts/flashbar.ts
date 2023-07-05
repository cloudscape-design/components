// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../colors';
import merge from 'lodash/merge';
import { expandColorDictionary } from '../../utils';

const tokens = {
  colorBorderItemFocused: '{colorGrey100}',
  colorTextExpandableSectionDefault: '{colorGrey100}',
  colorTextExpandableSectionHover: '{colorGrey100}',
  colorTextBodyDefault: '{colorGrey100}',
  colorTextHeadingSecondary: '{colorGrey100}',
  colorBorderDividerDefault: '{colorGrey100}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, tokens)
);

export { expandedTokens as tokens };
