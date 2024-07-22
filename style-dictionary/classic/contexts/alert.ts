// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandColorDictionary } from '../../utils';
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../colors';

const alertExpandableSectionTokens: StyleDictionary.ColorsDictionary = {
  colorBorderDividerDefault: '{colorTextButtonNormalDefault}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, alertExpandableSectionTokens)
);

export { expandedTokens as tokens };
