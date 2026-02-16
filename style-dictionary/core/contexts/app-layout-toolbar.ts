// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../colors.js';

const newTokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundLayoutMain: { light: '#ffffff', dark: '#161d26' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, newTokens)
);

export { expandedTokens as tokens };
