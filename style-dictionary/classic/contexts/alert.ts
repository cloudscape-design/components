// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../colors';
import merge from 'lodash/merge';
import { expandColorDictionary } from '../../utils';

const alertExpandableSectionTokens: StyleDictionary.ColorsDictionary = {
  colorBorderDividerDefault: '{colorTextButtonNormalDefault}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, alertExpandableSectionTokens)
);

export { expandedTokens as tokens };
