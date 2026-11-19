// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../../visual-refresh/contexts/flashbar.js';

// core-update flashbar context overrides; the full visual-refresh context (parentTokens) is the base.
const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundNotificationGreen: { light: '#008559', dark: '#008559' },
  colorBackgroundNotificationBlue: { light: '#0033cc', dark: '#0033cc' },
  colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);

export { expandedTokens as tokens };
