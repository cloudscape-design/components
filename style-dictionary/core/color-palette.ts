// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { referenceTokens as vrReferenceTokens } from '../visual-refresh/color-palette.js';
import { paletteTokens } from './palette-values.js';

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(paletteTokens);

export const mode: StyleDictionary.ModeIdentifier = 'color';

export { expandedTokens as tokens };
export { vrReferenceTokens as referenceTokens };
export { paletteTokens };
