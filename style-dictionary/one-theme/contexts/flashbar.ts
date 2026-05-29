// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundNotificationGreen: { light: '#006b48', dark: '#006b48' },
  colorBackgroundNotificationBlue: { light: '#0033cc', dark: '#0033cc' },
  colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
