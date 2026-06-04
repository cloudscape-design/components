// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundLayoutMain: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey1000}' },
  colorGapGlobalDrawer: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey1000}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
