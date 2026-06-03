// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorTextNotificationYellow: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
  colorTextNotificationDefault: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
  colorTextInteractiveInvertedDefault: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
  colorBorderDividerDefault: '{colorNeutralGrey900}',

  // Button
  colorBorderButtonNormalDefault: { light: '{colorNeutralGrey800}', dark: '{colorWhite}' },
  colorBorderButtonNormalHover: { light: '{colorNeutralGrey800}', dark: '{colorWhite}' },
  colorBorderButtonNormalActive: { light: '{colorNeutralGrey800}', dark: '{colorWhite}' },

  colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
  colorBackgroundButtonNormalHover: { light: 'rgba(0, 7, 22, 0.08)', dark: 'rgba(255, 255, 255, 0.06)' },
  colorBackgroundButtonNormalActive: { light: 'rgba(0, 7, 22, 0.1)', dark: 'rgba(255, 255, 255, 0.1)' },

  colorTextButtonNormalDefault: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
  colorTextButtonNormalHover: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
  colorTextButtonNormalActive: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
