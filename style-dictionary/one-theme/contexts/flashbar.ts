// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  // Status backgrounds
  colorBackgroundStatusInfo: { light: '{colorInfo100}', dark: '{colorInfo950}' },
  colorBackgroundStatusWarning: { light: '{colorWarning100}', dark: '{colorWarning950}' },
  colorBackgroundStatusError: { light: '{colorError100}', dark: '{colorError950}' },
  colorBackgroundStatusSuccess: { light: '{colorSuccess100}', dark: '{colorSuccess950}' },

  // Status text and borders
  colorTextStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo500}' },
  colorBorderStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo500}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess500}' },
  colorBorderStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess500}' },

  // Buttons
  colorTextButtonNormalDefault: { light: '{colorNeutral800}', dark: '{colorNeutral100}' },
  colorTextButtonNormalHover: { light: '{colorNeutral950}', dark: '{colorWhite}' },
  colorTextButtonNormalActive: { light: '{colorNeutral800}', dark: '{colorNeutral100}' },
  colorBorderButtonNormalDefault: { light: '{colorNeutral800}', dark: '{colorNeutral100}' },
  colorBorderButtonNormalHover: { light: '{colorNeutral950}', dark: '{colorWhite}' },
  colorBorderButtonNormalActive: { light: '{colorNeutral800}', dark: '{colorNeutral100}' },
  colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
  colorBackgroundButtonNormalHover: 'rgba(0, 0, 0, 0.05)',
  colorBackgroundButtonNormalActive: 'rgba(0, 0, 0, 0.1)',

  // Link
  colorTextLinkInvertedHover: { light: '{colorNeutral950}', dark: '{colorWhite}' },

  // Dismiss button
  colorTextInteractiveDefault: { light: '{colorNeutral800}', dark: '{colorNeutral100}' },
  colorTextInteractiveHover: { light: '{colorNeutral950}', dark: '{colorWhite}' },

  // Dividers
  colorBorderDividerDefault: { light: '{colorNeutral350}', dark: '{colorNeutral600}' },

  // Notification text
  colorTextNotificationDefault: { light: '{colorNeutral800}', dark: '{colorNeutral100}' },
  colorTextHeadingSecondary: { light: '{colorNeutral750}', dark: '{colorNeutral300}' },

  // Expandable section
  colorTextExpandableSectionHover: { light: '{colorNeutral950}', dark: '{colorWhite}' },
  colorBorderExpandableSectionDefault: { light: '{colorNeutral600}', dark: '{colorNeutral500}' },

  // Progress bar
  colorBackgroundProgressBarValueDefault: { light: '{colorNeutral800}', dark: '{colorWhite}' },
  colorBackgroundProgressBarDefault: { light: '{colorGreyOpaque10}', dark: '{colorGreyOpaque25}' },

  // Focus ring
  colorBorderItemFocused: { light: '{colorNeutral800}', dark: '{colorWhite}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
