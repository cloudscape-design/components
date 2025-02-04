// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

const tokens: StyleDictionary.ColorSeverityDictionary = {
  // note: these should not be used directly. Instead, use the semantic tokens defined below.
  colorSeverityDarkRed: { light: '#870303', dark: '#d63f38' },
  colorSeverityRed: { light: '#ce3311', dark: '#fe6e73' },
  colorSeverityOrange: { light: '#f89256', dark: '#f89256' },
  colorSeverityYellow: { light: '#f2cd54', dark: '#f2cd54' },
  colorSeverityGrey: '{colorGrey550}',

  colorBackgroundNotificationSeverityCritical: '{colorSeverityDarkRed}',
  colorBackgroundNotificationSeverityHigh: '{colorSeverityRed}',
  colorBackgroundNotificationSeverityMedium: '{colorSeverityOrange}',
  colorBackgroundNotificationSeverityLow: '{colorSeverityYellow}',
  colorBackgroundNotificationSeverityNeutral: '{colorSeverityGrey}',

  colorTextNotificationSeverityCritical: { light: '{colorGrey100}', dark: '{colorBlack}' },
  colorTextNotificationSeverityHigh: { light: '{colorGrey100}', dark: '{colorGrey900}' },
  colorTextNotificationSeverityMedium: '{colorGrey900}',
  colorTextNotificationSeverityLow: '{colorGrey900}',
  colorTextNotificationSeverityNeutral: '{colorGrey100}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
