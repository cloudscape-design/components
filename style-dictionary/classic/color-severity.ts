// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandColorDictionary } from '../utils';
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/color-severity';

const tokens: StyleDictionary.ColorSeverityDictionary = {
  colorTextNotificationSeverityMedium: { light: '{colorBlack}', dark: '{colorGrey900}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);
export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
