// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorTextNotificationYellow: { light: '{colorNeutral900}', dark: '{colorWhite}' },
  colorTextNotificationDefault: { light: '{colorNeutral900}', dark: '{colorWhite}' },
  colorTextInteractiveInvertedDefault: { light: '{colorNeutral900}', dark: '{colorWhite}' },
  colorBorderDividerDefault: '{colorNeutral900}',

  // Button
  colorBorderButtonNormalDefault: { light: '{colorNeutral800}', dark: '{colorWhite}' },
  colorBorderButtonNormalHover: { light: '{colorNeutral800}', dark: '{colorWhite}' },
  colorBorderButtonNormalActive: { light: '{colorNeutral800}', dark: '{colorWhite}' },

  colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
  colorBackgroundButtonNormalHover: { light: 'rgba(0, 7, 22, 0.08)', dark: 'rgba(255, 255, 255, 0.06)' },
  colorBackgroundButtonNormalActive: { light: 'rgba(0, 7, 22, 0.1)', dark: 'rgba(255, 255, 255, 0.1)' },

  colorTextButtonNormalDefault: { light: '{colorNeutral900}', dark: '{colorWhite}' },
  colorTextButtonNormalHover: { light: '{colorNeutral900}', dark: '{colorWhite}' },
  colorTextButtonNormalActive: { light: '{colorNeutral900}', dark: '{colorWhite}' },

  // Expandable section
  colorTextExpandableSectionDefault: { light: '{colorNeutral900}', dark: '{colorNeutral100}' },
  colorTextExpandableSectionHover: { light: '{colorNeutral1000}', dark: '{colorWhite}' },
  colorTextHeadingSecondary: { light: '{colorNeutral700}', dark: '{colorNeutral100}' },
  colorBorderExpandableSectionDefault: { light: '{colorNeutral900}', dark: '{colorWhite}' },
  colorTextBodyDefault: { light: '{colorNeutral700}', dark: '{colorNeutral100}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
