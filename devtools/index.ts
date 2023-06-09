// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import selectorsToTokens from './selectors-mapping.json';
// @ts-ignore
import tokensToDescriptions from './tokens-descriptions.json';
// @ts-ignore
import tokensToComponents from './components-mapping.json';

export type SelectorsMapping = readonly { selector: string; tokens: readonly TokenMetadata[] }[];

export interface TokenMetadata {
  section: string;
  name: string;
  cssName: string;
  themeable: boolean;
  description?: string;
  components: string[];
}

export function getStylesMapping(isVisualRefresh = true): SelectorsMapping {
  return Object.entries(selectorsToTokens)
    .map(([selector, tokenByState]: any) => ({
      selector,
      tokens: Object.entries(tokenByState).flatMap(([key, tokens]: any) =>
        tokens.map(
          (token: { name: string; cssName: string }) =>
            ({
              section: key,
              name: token.name,
              cssName: token.cssName,
              themeable: getTokenThemeable(token.name, isVisualRefresh),
              description: getTokenDescription(token.name, isVisualRefresh),
              components: tokensToComponents[token.name]?.sort() ?? [],
            } as TokenMetadata)
        )
      ),
    }))
    .filter(({ selector }) => selector.trim());
}

function getTokenThemeable(tokenName: string, isVisualRefresh: boolean): boolean {
  const themeable = tokensToDescriptions[tokenName]?.themeable;
  const vrThemeable = tokensToDescriptions[tokenName]?.vr?.themeable ?? themeable;
  return isVisualRefresh ? !!vrThemeable : !!themeable;
}

function getTokenDescription(tokenName: string, isVisualRefresh: boolean): string {
  const description = tokensToDescriptions[tokenName]?.description;
  const vrDescription = tokensToDescriptions[tokenName]?.vr?.description ?? description;
  return isVisualRefresh ? vrDescription : description;
}
