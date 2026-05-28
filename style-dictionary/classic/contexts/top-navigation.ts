// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens = {
  colorBackgroundContainerContent: '{colorAwsSquidInk}',
  colorBackgroundDropdownItemDefault: '{colorAwsSquidInk}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
