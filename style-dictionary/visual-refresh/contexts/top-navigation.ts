// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandColorDictionary, pickState } from '../../utils';
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../colors';

const tokens = {
  colorBackgroundContainerContent: '{colorGrey800}',
  colorBackgroundDropdownItemDefault: '{colorGrey800}',
};

const darkModeValues = pickState(parentTokens, 'dark');

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, darkModeValues, tokens)
);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
