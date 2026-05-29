// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundNotificationGreen: { light: '#008559', dark: '#008559' },
  colorBackgroundNotificationBlue: { light: '#0033cc', dark: '#0033cc' },
  colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
