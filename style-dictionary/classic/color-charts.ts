// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/color-charts.js';

const tokens: StyleDictionary.ColorChartsDictionary = {
  colorChartsLineGrid: { dark: '{colorGrey650}' },
  colorChartsLineTick: { dark: '{colorGrey650}' },
  colorChartsLineAxis: { dark: '{colorGrey650}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);
export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
