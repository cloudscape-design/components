// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenMapping from './tokens-mapping.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenDict from './tokens-descriptions.json';

export interface Token {
  section: string;
  name: string;
  cssName: string;
  description?: string;
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
        description: getTokenDescription(token.name),
      }))
    ),
  }))
  .filter(({ selector }) => selector.trim()) as { selector: string; tokens: Token[] }[];
