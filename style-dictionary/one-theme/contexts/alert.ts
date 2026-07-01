// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundStatusInfo: { light: '{colorInfo50}', dark: '#161a2d' },
  colorBackgroundStatusWarning: { light: '{colorWarning50}', dark: '#191100' },
  colorBackgroundStatusError: { light: '{colorError50}', dark: '#1f0000' },
  colorBackgroundStatusSuccess: { light: '{colorSuccess50}', dark: '#001401' },
  colorTextStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo500}' },
  colorBorderStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo500}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess500}' },
  colorBorderStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess500}' },
  colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
  colorBorderDividerDefault: { light: '{colorNeutral350}', dark: '{colorNeutral600}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
