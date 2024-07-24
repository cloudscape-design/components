// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandColorDictionary, pickState } from '../../utils';
import { StyleDictionary } from '../../utils/interfaces';
import { expandedColorTokens as alertTokens } from './alert';

const darkModeColorValues = pickState(alertTokens, 'dark');

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, alertTokens, darkModeColorValues)
);

export default expandedTokens;
