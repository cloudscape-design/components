// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { sharedTokens } from '../../visual-refresh/contexts/flashbar.js';
import { tokens as parentTokens } from '../colors.js';

const newTokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundNotificationGreen: { light: '#008559', dark: '#008559' },
  colorBackgroundNotificationBlue: { light: '#0033cc', dark: '#0033cc' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, sharedTokens, newTokens)
);

export { expandedTokens as tokens };
