// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenMapping from '../../../lib/components-devtools/selectors-mapping.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenDict from '../../../lib/components-devtools/tokens-descriptions.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokensToComponents from '../../../lib/components-devtools/components-mapping.json';

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

function getTokenThemeable(tokenName: string, vr: boolean): boolean {
  const themeable = tokenDict[tokenName]?.themeable;
  const vrThemeable = tokenDict[tokenName]?.vr?.themeable ?? themeable;
  return vr ? !!vrThemeable : !!themeable;
}

function getTokenDescription(tokenName: string, vr: boolean): string {
  const description = tokenDict[tokenName]?.description;
  const vrDescription = tokenDict[tokenName]?.vr?.description ?? description;
  return vr ? vrDescription : description;
}

export function getStylesMapping(vr: boolean) {
  return Object.entries(tokenMapping)
    .map(([selector, tokenByState]: any) => ({
      selector,
      tokens: Object.entries(tokenByState).flatMap(([key, tokens]: any) =>
        tokens.map((token: { name: string; cssName: string }) => ({
          section: key,
          name: token.name,
          cssName: token.cssName,
          themeable: getTokenThemeable(token.name, vr),
          description: getTokenDescription(token.name, vr),
          components: tokensToComponents[token.name]?.sort() ?? [],
        }))
      ),
    }))
    .filter(({ selector }) => selector.trim()) as { selector: string; tokens: Token[] }[];
}
