// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandDensityDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/spacing.js';

// core-update spacing overrides; the full visual-refresh set (parentTokens) is the base.
const tokens: StyleDictionary.SpacingDictionary = {
  spaceAlertVertical: '4px',
  spaceButtonHorizontal: '12px',
  spaceTabsVertical: '2px',
  spaceTokenVertical: '2px',
  spaceFieldVertical: { comfortable: '4px', compact: '2px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = merge(
  {},
  parentTokens,
  expandDensityDictionary(tokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
