// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { neutralExtra } from '../color-palette.js';

// The header context is always rendered in dark mode (dark background),
// so all values here are single-mode (no light/dark split).
const tokens: StyleDictionary.ColorsDictionary = {
  colorBorderButtonNormalDefault: '{colorNeutral850}',
  colorBorderButtonNormalHover: neutralExtra.nearWhite2,
  colorBorderButtonNormalActive: neutralExtra.nearWhite2,
  colorBackgroundButtonNormalHover: '{colorNeutral200}',
  colorBackgroundButtonNormalActive: '{colorNeutral100}',
  colorTextButtonNormalDefault: '{colorNeutral850}',
  colorTextButtonNormalHover: neutralExtra.nearWhite2,
  colorTextButtonNormalActive: neutralExtra.nearWhite2,
  colorBackgroundButtonPrimaryDefault: neutralExtra.nearWhite2,
  colorBackgroundButtonPrimaryHover: '{colorNeutral1000}',
  colorBackgroundButtonPrimaryActive: neutralExtra.nearWhite2,
  colorTextButtonPrimaryDefault: '{colorNeutral100}',
  colorTextButtonPrimaryHover: '{colorNeutral100}',
  colorTextButtonPrimaryActive: '{colorNeutral100}',
  colorTextLinkDefault: '{colorNeutral800}',
};

const expandedTokens = expandColorDictionary(tokens);

export { expandedTokens as tokens };
