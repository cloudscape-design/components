// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

// The header context always renders on a dark background regardless of color mode.
// All values are mode-invariant (single string = same in light and dark).
const tokens: StyleDictionary.ColorsDictionary = {
  colorBorderButtonNormalDefault: '#e1e1e1',
  colorBorderButtonNormalHover: '#f9f9f9',
  colorBorderButtonNormalActive: '#f9f9f9',
  colorBackgroundButtonNormalHover: '#242424',
  colorBackgroundButtonNormalActive: '#1a1a1a',
  colorTextButtonNormalDefault: '#e1e1e1',
  colorTextButtonNormalHover: '#f9f9f9',
  colorTextButtonNormalActive: '#f9f9f9',
  colorBackgroundButtonPrimaryDefault: '#f9f9f9',
  colorBackgroundButtonPrimaryHover: '#ffffff',
  colorBackgroundButtonPrimaryActive: '#f9f9f9',
  colorTextButtonPrimaryDefault: '#1a1a1a',
  colorTextButtonPrimaryHover: '#1a1a1a',
  colorTextButtonPrimaryActive: '#1a1a1a',
  colorTextLinkDefault: '#c9c9c9',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
