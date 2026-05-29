// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

// Header context tokens are single values (applied in dark mode context)
const tokens: StyleDictionary.ColorsDictionary = {
  colorBorderButtonNormalDefault: '#f3f3f7',
  colorBorderButtonNormalHover: '#f9f9fb',
  colorBorderButtonNormalActive: '#f9f9fb',
  colorBackgroundButtonNormalHover: '#1b232d',
  colorBackgroundButtonNormalActive: '#131920',
  colorTextButtonNormalDefault: '#f3f3f7',
  colorTextButtonNormalHover: '#f9f9fb',
  colorTextButtonNormalActive: '#f9f9fb',
  colorBackgroundButtonPrimaryDefault: '#f9f9fb',
  colorBackgroundButtonPrimaryHover: '#ffffff',
  colorBackgroundButtonPrimaryActive: '#f9f9fb',
  colorTextButtonPrimaryDefault: '#131920',
  colorTextButtonPrimaryHover: '#131920',
  colorTextButtonPrimaryActive: '#131920',
  colorTextLinkDefault: '#ccccd1',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
