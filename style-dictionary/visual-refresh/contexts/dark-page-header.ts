// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as headerTokens } from './header';
import merge from 'lodash/merge';
import { expandColorDictionary } from '../../utils';

const pageHeaderTokens: StyleDictionary.ColorsDictionary = {
  colorTextPageHeader: '{colorGrey100}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, headerTokens, pageHeaderTokens)
);

export { expandedTokens as tokens };
