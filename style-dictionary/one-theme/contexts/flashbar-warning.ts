// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorTextNotificationYellow: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
  colorTextNotificationDefault: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
  colorTextInteractiveInvertedDefault: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export { expandedTokens as tokens };
