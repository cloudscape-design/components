// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { kebabCase } from 'lodash';
import { StyleDictionary } from './interfaces';
import { TokenName } from './token-names';

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

export function updateMetadata(
  descriptions: StyleDictionary.TokenIndex<StyleDictionary.Metadata>,
  baseDictionary: StyleDictionary.MetadataIndex
): StyleDictionary.MetadataIndex {
  const entries = Object.entries(baseDictionary).map(([token, metadata]) => {
    return [
      token,
      {
        ...metadata,
        ...(descriptions[token as TokenName] ?? {}),
      },
    ];
  });
  return Object.fromEntries(entries);
}
