// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandDensityDictionary } from '../utils';
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/sizes';

const tokens: StyleDictionary.SizesDictionary = {
  sizeCalendarGridWidth: '234px',
  sizeControl: '14px',
  sizeIconMedium: '16px',
  sizeTableSelectionHorizontal: '54px',
  sizeVerticalInput: { comfortable: '32px', compact: '28px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = merge(
  {},
  parentTokens,
  expandDensityDictionary(tokens)
);
export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
