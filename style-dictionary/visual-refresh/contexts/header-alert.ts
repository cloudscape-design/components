// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import alertTokens from './alert';
import merge from 'lodash/merge';
import { expandColorDictionary, pickState } from '../../utils';

const darkModeColorValues = pickState(alertTokens, 'dark');

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, alertTokens, darkModeColorValues)
);

export default expandedTokens;
