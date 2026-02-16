// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/colors.js';

const tokens: StyleDictionary.ColorsDictionary = {
  // Normal Buttons
  colorBorderButtonNormalDefault: { light: '#1b232d', dark: '#f3f3f7' },
  colorBorderButtonNormalHover: { light: '#295eff', dark: '#7598ff' },
  colorBorderButtonNormalActive: { light: '#1b232d', dark: '#7598ff' },

  colorBackgroundButtonNormalHover: { light: '#ffffff', dark: '#1b232d' },
  colorBackgroundButtonNormalActive: { light: '#dbe4ff', dark: '#000833' },

  colorTextButtonNormalDefault: { light: '#1b232d', dark: '#f3f3f7' },
  colorTextButtonNormalHover: { light: '#295eff', dark: '#7598ff' },
  colorTextButtonNormalActive: { light: '#1b232d', dark: '#7598ff' },

  // Primary Buttons
  colorBackgroundButtonPrimaryDefault: { light: '#1b232d', dark: '#f9f9fb' },
  colorBackgroundButtonPrimaryHover: { light: '#295eff', dark: '#c2d1ff' },
  colorBackgroundButtonPrimaryActive: { light: '#1b232d', dark: '#f9f9fb' },

  colorTextButtonPrimaryDefault: { light: '#ffffff', dark: '#131920' },
  colorTextButtonPrimaryHover: { light: '#ffffff', dark: '#131920' },
  colorTextButtonPrimaryActive: { light: '#ffffff', dark: '#131920' },

  // Segmented control
  colorBackgroundSegmentActive: { light: '#1b232d', dark: '#f9f9fb' },

  // Specific text colors
  colorTextLinkDefault: { light: '#295eff', dark: '#7598ff' },
  colorTextLinkHover: { light: '#0033cc', dark: '#94afff' },
  colorTextAccent: { light: '#295eff', dark: '#7598ff' },

  colorTextStatusInfo: { light: '#0033cc', dark: '#5c7fff' },
  colorTextStatusWarning: { light: '#855900', dark: '#ffe347' },
  colorTextStatusError: { light: '#db0000', dark: '#ff7a7a' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
