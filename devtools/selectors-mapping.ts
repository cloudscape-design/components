// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import selectorsToTokens from './selectors-mapping.json';
// @ts-ignore
import tokensToDescriptions from './tokens-descriptions.json';
// @ts-ignore
import tokensToComponents from './components-mapping.json';

import { SelectorsMapping, TokenMetadata } from './interfaces';

export const selectorsMapping: SelectorsMapping = Object.entries(selectorsToTokens)
  .map(([selector, tokenByState]: any) => ({
    selector,
    tokens: Object.entries(tokenByState).flatMap(([key, tokens]: any) =>
      tokens.map(
        (token: { name: string; cssName: string }) =>
          ({
            section: key,
            name: token.name,
            cssName: token.cssName,
            themeable: getTokenThemeable(token.name),
            description: getTokenDescription(token.name),
            descriptionVR: getTokenDescriptionVR(token.name),
            components: tokensToComponents[token.name]?.sort() ?? [],
          } as TokenMetadata)
      )
    ),
  }))
  .filter(({ selector }) => selector.trim());

function getTokenThemeable(tokenName: string): boolean {
  const themeable = tokensToDescriptions[tokenName]?.themeable;
  return !!themeable;
}

function getTokenDescription(tokenName: string): string {
  const description = tokensToDescriptions[tokenName]?.description;
  return description;
}

function getTokenDescriptionVR(tokenName: string): string {
  const vrDescription = tokensToDescriptions[tokenName]?.vr?.description ?? getTokenDescription(tokenName);
  return vrDescription;
}
