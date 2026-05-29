// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundStatusInfo: { light: '#5c7fff20', dark: '#161a2d' },
  colorBackgroundStatusWarning: { light: '#fbd33220', dark: '#fbd33210' },
  colorBackgroundStatusError: { light: '#ff7a7a10', dark: '#ff7a7a10' },
  colorBackgroundStatusSuccess: { light: '#7ae50020', dark: '#2bb53410' },
  colorTextStatusInfo: { light: '#0033cc', dark: '#7598ff' },
  colorBorderStatusInfo: { light: '#0033cc', dark: '#7598ff' },
  colorTextStatusSuccess: { light: '#00802f', dark: '#aeffa8' },
  colorBorderStatusSuccess: { light: '#00802f', dark: '#aeffa8' },
  colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
