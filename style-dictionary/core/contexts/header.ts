// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { sharedTokens } from '../../visual-refresh/contexts/header.js';
import { tokens as parentTokens } from '../colors.js';

const newTokens: StyleDictionary.ColorsDictionary = {
  // Normal button
  colorBorderButtonNormalDefault: '#f3f3f7',
  colorBorderButtonNormalHover: '#7598ff',
  colorBorderButtonNormalActive: '#7598ff',

  colorBackgroundButtonNormalHover: '#1b232d',
  colorBackgroundButtonNormalActive: '#000833',

  colorTextButtonNormalDefault: '#f3f3f7',
  colorTextButtonNormalHover: '#7598ff',
  colorTextButtonNormalActive: '#7598ff',

  // Primary button
  colorBackgroundButtonPrimaryDefault: '#f9f9fb',
  colorBackgroundButtonPrimaryHover: '#c2d1ff',
  colorBackgroundButtonPrimaryActive: '#f9f9fb',

  colorTextButtonPrimaryDefault: '#131920',
  colorTextButtonPrimaryHover: '#131920',
  colorTextButtonPrimaryActive: '#131920',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, sharedTokens, newTokens)
);

export { expandedTokens as tokens };
