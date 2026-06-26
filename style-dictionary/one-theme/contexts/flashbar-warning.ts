// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

// Warning flashes render in their own context. Mirror the alert treatment so a
// warning flash matches an alert: light warning background (set via
// colorBackgroundFlashbarWarning in colors.ts) with dark body text and a
// transparent normal button.
const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundStatusInfo: { light: '{colorInfo100}', dark: '{colorInfo950}' },
  colorBackgroundStatusWarning: { light: '{colorWarning100}', dark: '{colorWarning950}' },
  colorBackgroundStatusError: { light: '{colorError100}', dark: '{colorError950}' },
  colorBackgroundStatusSuccess: { light: '{colorSuccess100}', dark: '{colorSuccess950}' },

  colorTextStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo500}' },
  colorBorderStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo500}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess500}' },
  colorBorderStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess500}' },
  colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
  colorBackgroundButtonNormalHover: 'rgba(0, 0, 0, 0.1)',
  colorBackgroundButtonNormalActive: 'rgba(0, 0, 0, 0.2)',
  colorBorderDividerDefault: { light: '{colorNeutral350}', dark: '{colorNeutral600}' },

  colorTextNotificationYellow: { light: '{colorNeutral850}', dark: '{colorNeutral350}' },
  colorTextNotificationDefault: { light: '{colorNeutral850}', dark: '{colorNeutral350}' },
  colorTextHeadingSecondary: { light: '{colorNeutral650}', dark: '{colorNeutral400}' },
  colorBorderExpandableSectionDefault: { light: '{colorNeutral600}', dark: '{colorNeutral500}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
