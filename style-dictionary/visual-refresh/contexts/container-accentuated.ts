// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

// Nested components read either container token regardless of where they sit (table header rows read the
// header token, segmented controls read the content token), so both map to the content surface.
const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundContainerContent: '{colorBackgroundContainerAccentuatedContent}',
  colorBackgroundContainerHeader: '{colorBackgroundContainerAccentuatedContent}',
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);
export { expandedTokens as tokens };
