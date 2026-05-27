// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandDensityDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

const tokens: StyleDictionary.SpacingDictionary = {
  spaceAlertVertical: '8px',
  spaceButtonHorizontal: '12px',
  spaceTabsVertical: '2px',
  spaceTokenVertical: '2px',
  spaceFieldVertical: { comfortable: '4px', compact: '2px' },
  // Note: spaceStatusIndicatorPaddingInline in the JSON maps to spaceStatusIndicatorPaddingHorizontal
  spaceStatusIndicatorPaddingHorizontal: '4px',
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
