// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandDensityDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

const tokens: StyleDictionary.SizesDictionary = {
  sizeVerticalInput: { comfortable: '30px', compact: '26px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
