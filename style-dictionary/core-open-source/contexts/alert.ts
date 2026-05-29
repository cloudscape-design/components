// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundStatusInfo: { light: '#f6f6f9', dark: '#232b37' },
  colorBackgroundStatusWarning: { light: '#f6f6f9', dark: '#232b37' },
  colorBackgroundStatusError: { light: '#f6f6f9', dark: '#232b37' },
  colorBackgroundStatusSuccess: { light: '#f6f6f9', dark: '#232b37' },
  colorTextStatusInfo: { light: '#0033cc', dark: '#7598ff' },
  colorBorderStatusInfo: { light: '#0033cc', dark: '#7598ff' },
  colorTextStatusSuccess: { light: '#008559', dark: '#00bd6b' },
  colorBorderStatusSuccess: { light: '#008559', dark: '#00bd6b' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
