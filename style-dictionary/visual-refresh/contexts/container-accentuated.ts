// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

// Nested components read either container token regardless of where they sit (table header rows read the
// header token, buttons read the content token), so each surface maps both to its own colour.
function surfaceTokens(background: string) {
  const tokens: StyleDictionary.ColorsDictionary = {
    colorBackgroundContainerContent: background,
    colorBackgroundContainerHeader: background,
  };
  return expandColorDictionary(tokens);
}

export const contentTokens: StyleDictionary.ExpandedColorScopeDictionary = surfaceTokens(
  '{colorBackgroundContainerAccentuatedContent}'
);

export const headerTokens: StyleDictionary.ExpandedColorScopeDictionary = surfaceTokens(
  '{colorBackgroundContainerAccentuatedHeader}'
);
