// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReferenceTokens } from '@cloudscape-design/theming-build';

import { expandColorDictionary, expandReferenceTokens } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorTextBodyDefault: { light: '#0f141a', dark: '#ccccd1' },

  colorBorderButtonNormalDefault: { light: '#1b232d', dark: '#f3f3f7' },
  colorBorderButtonNormalHover: { light: '#1b232d', dark: '#f9f9fb' },
  colorBorderButtonNormalActive: { light: '#1b232d', dark: '#f9f9fb' },
  colorBackgroundButtonNormalDefault: { light: '#ffffff', dark: '#161d26' },
  colorBackgroundButtonNormalHover: { light: '#f6f6f9', dark: '#424650' },
  colorBackgroundButtonNormalActive: { light: '#ebebf0', dark: '#131920' },
  colorTextButtonNormalDefault: { light: '#1b232d', dark: '#f3f3f7' },
  colorTextButtonNormalHover: { light: '#1b232d', dark: '#f9f9fb' },
  colorTextButtonNormalActive: { light: '#1b232d', dark: '#f9f9fb' },

  colorBackgroundButtonPrimaryDefault: { light: '#1b232d', dark: '#f9f9fb' },
  colorBackgroundButtonPrimaryHover: { light: '#06080a', dark: '#ffffff' },
  colorBackgroundButtonPrimaryActive: { light: '#1b232d', dark: '#f9f9fb' },
  colorTextButtonPrimaryDefault: { light: '#ffffff', dark: '#131920' },
  colorTextButtonPrimaryHover: { light: '#ffffff', dark: '#131920' },
  colorTextButtonPrimaryActive: { light: '#ffffff', dark: '#131920' },

  colorBackgroundButtonLinkDefault: { light: '#f6f6f9', dark: '#232b37' },
  colorBackgroundButtonLinkHover: { light: '#ebebf0', dark: '#424650' },
  colorBackgroundButtonLinkActive: { light: '#ebebf0', dark: '#131920' },
  colorTextLinkButtonNormalDefault: { light: '#1b232d', dark: '#f9f9fb' },

  colorBackgroundToggleButtonNormalPressed: { light: '#ebebf0', dark: '#131920' },
  colorBorderToggleButtonNormalPressed: { light: '#1b232d', dark: '#f9f9fb' },
  colorTextToggleButtonNormalPressed: { light: '#1b232d', dark: '#f9f9fb' },

  colorBackgroundControlChecked: { light: '#1b232d', dark: '#f9f9fb' },

  colorTextLinkDefault: { light: '#0f141a', dark: '#ccccd1' },
  colorTextLinkHover: { light: '#424650', dark: '#ffffff' },
  colorTextLinkSecondaryDefault: { light: '#295eff', dark: '#7598ff' },
  colorTextLinkSecondaryHover: { light: '#0033cc', dark: '#94afff' },
  colorTextLinkInfoDefault: { light: '#295eff', dark: '#7598ff' },
  colorTextLinkInfoHover: { light: '#0033cc', dark: '#94afff' },
  colorTextAccent: { light: '#1b232d', dark: '#f9f9fb' },

  colorBorderItemFocused: { light: '#1b232d', dark: '#f9f9fb' },
  colorBorderItemSelected: { light: '#1b232d', dark: '#f9f9fb' },
  colorBackgroundItemSelected: { light: '#f6f6f9', dark: '#0f141a' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '#1b232d', dark: '#f9f9fb' },

  colorBackgroundSegmentActive: { light: '#1b232d', dark: '#f9f9fb' },

  colorBackgroundSliderRangeDefault: { light: '#1b232d', dark: '#f9f9fb' },
  colorBackgroundSliderHandleDefault: { light: '#1b232d', dark: '#f9f9fb' },

  colorBackgroundProgressBarValueDefault: { light: '#1b232d', dark: '#f9f9fb' },

  colorBackgroundNotificationGreen: { light: '#008559', dark: '#008559' },
  colorBackgroundNotificationBlue: { light: '#0033cc', dark: '#0033cc' },
  colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },

  colorTextStatusInfo: { light: '#0033cc', dark: '#7598ff' },
  colorTextStatusSuccess: { light: '#008559', dark: '#00bd6b' },
  colorTextDropdownItemFilterMatch: { light: '#1b232d', dark: '#f9f9fb' },
  colorBackgroundDropdownItemFilterMatch: { light: '#f3f3f7', dark: '#06080a' },

  colorTextBreadcrumbCurrent: { light: '#656871', dark: '#8c8c94' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export const referenceTokens: ReferenceTokens = expandReferenceTokens({
  color: {
    primary: {
      seed: '#1b232d',
    },
  },
});

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
