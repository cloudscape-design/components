// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const background = { light: '{colorNeutral50}', dark: '{colorNeutral1000}' };

// Content nested in the container (table headers, tokens, chart markers) paints these tokens,
// so overriding them for the whole subtree keeps it on the same surface as the container.
const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundContainerContent: background,
  colorBackgroundContainerHeader: background,
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
