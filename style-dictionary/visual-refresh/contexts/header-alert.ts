// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary, pickState } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { expandedColorTokens as alertTokens } from './alert.js';

const darkModeColorValues = pickState(alertTokens, 'dark');

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, alertTokens, darkModeColorValues)
);

export default expandedTokens;
