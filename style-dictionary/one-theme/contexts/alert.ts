// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  // Status backgrounds
  colorBackgroundStatusError: { light: '#fceded', dark: '#460303' },
  colorBackgroundStatusInfo: { light: '#eaeffc', dark: '#08144f' },
  colorBackgroundStatusSuccess: { light: '#e9fce7', dark: '#03220d' },
  colorBackgroundStatusWarning: { light: '#fcfadb', dark: '#372603' },

  // Status text and borders
  colorTextStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo400}' },
  colorBorderStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo400}' },
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
  colorTextLinkDefault: { light: '{colorNeutral900}', dark: '{colorNeutral50}' },
  colorTextLinkHover: { light: '{colorNeutral950}', dark: '{colorWhite}' },

  // Dividers
  colorBorderDividerDefault: { light: '{colorNeutral350}', dark: '{colorNeutral600}' },

  // Alert text
  colorTextBodyDefault: { light: '{colorNeutral800}', dark: '{colorNeutral100}' },

  // Expandable section
  colorTextExpandableSectionHover: { light: '{colorNeutral950}', dark: '{colorWhite}' },
  colorBorderExpandableSectionDefault: { light: '{colorNeutral600}', dark: '{colorNeutral500}' },

  // Focus ring
  colorBorderItemFocused: { light: '{colorNeutral800}', dark: '{colorWhite}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
