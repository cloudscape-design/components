// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenMapping from '../../../lib/tokens-toolkit/selectors-mapping.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenDict from '../../../lib/tokens-toolkit/tokens-descriptions-visual-refresh.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokensToComponents from '../../../lib/tokens-toolkit/components-mapping.json';

// TODO: merge classic/vr descriptions
// TODO: prepare mappings as TS files
// TODO: move utils to lib/tokens-toolkit

export interface Token {
  section: string;
  name: string;
  cssName: string;
  themeable: boolean;
  description?: string;
  components: string[];
}

function getTokenThemeable(tokenName: string): boolean {
  const themeable = tokenDict[tokenName]?.themeable;
  return !!themeable;
}

function getTokenDescription(tokenName: string): string {
  const description = tokenDict[tokenName]?.description;
  return description;
}

export const stylesMapping = Object.entries(tokenMapping)
  .map(([selector, tokenByState]: any) => ({
    selector,
    tokens: Object.entries(tokenByState).flatMap(([key, tokens]: any) =>
      tokens.map((token: { name: string; cssName: string }) => ({
        section: key,
        name: token.name,
        cssName: token.cssName,
        themeable: getTokenThemeable(token.name),
        description: getTokenDescription(token.name),
        components: tokensToComponents[token.name]?.sort() ?? [],
      }))
    ),
  }))
  .filter(({ selector }) => selector.trim()) as { selector: string; tokens: Token[] }[];
