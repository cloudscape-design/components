// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../colors';
import merge from 'lodash/merge';
import { expandColorDictionary } from '../../utils';
import { sharedTokens } from '../../visual-refresh/contexts/flashbar-warning';

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, sharedTokens)
);

export { expandedTokens as tokens };
