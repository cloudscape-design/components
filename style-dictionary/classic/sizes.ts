// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/sizes';
import merge from 'lodash/merge';
import { expandDensityDictionary } from '../utils';

const tokens: StyleDictionary.SizesDictionary = {
  sizeCalendarGridWidth: '234px',
  sizeControl: '14px',
  sizeIconMedium: '16px',
  sizeTableSelectionHorizontal: '54px',
  sizeVerticalInput: { comfortable: '32px', compact: '28px' },
  sizeVerticalPanelIconOffset: { comfortable: '15px', compact: '13px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = merge(
  {},
  parentTokens,
  expandDensityDictionary(tokens)
);
export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
