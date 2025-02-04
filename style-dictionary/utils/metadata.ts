// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import kebabCase from 'lodash/kebabCase.js';

import { StyleDictionary } from './interfaces.js';
import { TokenName } from './token-names.js';

export function expandMetadata(dictionary: StyleDictionary.MetadataIndex): StyleDictionary.MetadataIndex {
  const entries = Object.entries(dictionary).map(([token, metadata]) => {
    return [
      token,
      {
        ...metadata,
        sassName: metadata.sassName ? metadata.sassName : `$${kebabCase(token)}`,
      },
    ];
  });
  return Object.fromEntries(entries);
}

export function updateDescriptions(
  descriptions: StyleDictionary.TokenIndex<string>,
  baseDictionary: StyleDictionary.MetadataIndex
): StyleDictionary.MetadataIndex {
  const entries = Object.entries(baseDictionary).map(([token, metadata]) => {
    return [
      token,
      {
        ...metadata,
        description: descriptions[token as TokenName] || metadata.description,
      },
    ];
  });
  return Object.fromEntries(entries);
}
