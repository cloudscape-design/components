// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorTextButtonNormalDefault: '{colorNeutralGrey100}',
  colorBorderButtonNormalDefault: '{colorNeutralGrey100}',
  colorBackgroundButtonNormalDefault: 'transparent',
  colorTextButtonNormalHover: '{colorWhite}',
  colorBorderButtonNormalHover: '{colorWhite}',
  colorBackgroundButtonNormalHover: 'rgba(0, 7, 22, 0.15)',
  colorTextButtonNormalActive: '{colorWhite}',
  colorBorderButtonNormalActive: '{colorWhite}',
  colorBackgroundButtonNormalActive: 'rgba(0, 7, 22, 0.2)',
  colorBorderItemFocused: '{colorNeutralGrey100}',
  colorTextExpandableSectionDefault: '{colorNeutralGrey100}',
  colorTextExpandableSectionHover: '{colorWhite}',
  colorTextBodyDefault: '{colorNeutralGrey100}',
  colorTextBodySecondary: '{colorNeutralGrey100}',
  colorTextHeadingSecondary: '{colorNeutralGrey100}',
  colorBorderDividerDefault: '{colorNeutralGrey100}',
  colorTextTutorialHotspotDefault: '{colorNeutralGrey300}',
  colorTextTutorialHotspotHover: '{colorNeutralGrey100}',
  colorBackgroundInlineCode: 'rgba(0, 0, 0, 0.2)',
  // Key-value pairs
  colorTextLabel: '{colorNeutralGrey100}',

  // Info links
  colorTextLinkDefault: '{colorNeutralGrey100}',
  colorTextLinkHover: '{colorWhite}',

  // Progress Bar
  colorBackgroundProgressBarValueDefault: '{colorWhite}',
  colorBackgroundProgressBarDefault: '{colorGreyOpaque25}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
