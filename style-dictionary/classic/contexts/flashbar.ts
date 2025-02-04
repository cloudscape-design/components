// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../colors.js';

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
