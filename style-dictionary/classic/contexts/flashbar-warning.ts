// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandColorDictionary } from '../../utils';
import { StyleDictionary } from '../../utils/interfaces';
import { sharedTokens } from '../../visual-refresh/contexts/flashbar-warning';
import { tokens as parentTokens } from '../colors';

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, sharedTokens)
);

export { expandedTokens as tokens };
