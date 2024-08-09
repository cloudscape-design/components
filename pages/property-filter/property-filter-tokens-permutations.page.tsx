// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import TokenList, { TokenListProps } from '~components/internal/components/token-list';
import FilteringToken, { FilteringTokenProps } from '~components/property-filter/filtering-token';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const token1 = {
  content: 'property1 = value',
  ariaLabel: 'filter property1 = value',
  dismissAriaLabel: 'remove filter property1 = value',
} as const;

const token2 = {
  content: 'property2 = value',
  ariaLabel: 'filter property2 = value',
  dismissAriaLabel: 'remove filter property2 = value',
} as const;

const token3 = {
  content: 'very-long-property-name-3 = very-long-property-value',
  ariaLabel: 'filter very-long-property-name-3 = very-long-property-value',
  dismissAriaLabel: 'remove filter very-long-property-name-3 = very-long-property-value',
} as const;

const tokenProps: FilteringTokenProps = {
  tokens: [],
  operation: 'and',
  groupOperation: 'or',
  showOperation: false,
  andText: 'and',
  orText: 'or',
  groupAriaLabel: 'filter group with 0 tokens',
  groupEditAriaLabel: 'edit token group',
  operationAriaLabel: 'operation',
  onChangeOperation: () => {},
  onChangeGroupOperation: () => {},
  onDismissToken: () => {},
  disabled: false,
  editorContent: 'Token editor content',
  editorHeader: 'Token editor header',
  editorDismissAriaLabel: 'dismiss token editor',
  editorExpandToViewport: false,
  hasGroups: false,
};

const tokenPermutations = createPermutations<Partial<FilteringTokenProps>>([
  // Single token with and show operation
  {
    tokens: [[token1]],
    operation: ['and'],
    showOperation: [false, true],
  },
  // Single token with or disabled
  {
    tokens: [[token1]],
    operation: ['or'],
    showOperation: [true],
    disabled: [false, true],
  },
  // Group token with and show operation
  {
    tokens: [[token1, token2]],
    operation: ['and'],
    groupOperation: ['or'],
    showOperation: [false, true],
    hasGroups: [true],
  },
  // Group token with or disabled
  {
    tokens: [[token1, token2]],
    operation: ['or'],
    groupOperation: ['and'],
    showOperation: [true],
    disabled: [false, true],
    hasGroups: [true],
  },
  // Large token group
  {
    tokens: [
      [token1, token2, token3],
      [token1, token3, token2],
      [token3, token1, token2],
    ],
    operation: ['and'],
    groupOperation: ['or'],
    showOperation: [true],
    hasGroups: [true],
  },
]);

const tokenListProps: TokenListProps<React.ReactNode> = {
  items: [],
  alignment: 'inline',
  renderItem: item => item,
  limit: 3,
  after: null,
  limitShowFewerAriaLabel: 'show more',
  limitShowMoreAriaLabel: 'show fewer',
};

const tokenListPermutations = createPermutations<Partial<TokenListProps<React.ReactNode>>>([
  // List of single tokens with show more
  {
    items: [
      [
        <FilteringToken key="1" {...tokenProps} tokens={[token1]} hasGroups={false} />,
        <FilteringToken key="2" {...tokenProps} showOperation={true} tokens={[token2]} hasGroups={false} />,
        <FilteringToken key="3" {...tokenProps} showOperation={true} tokens={[token3]} hasGroups={false} />,
      ],
    ],
    limit: [3, 2],
  },
  // List of single and grouped tokens
  {
    items: [
      [
        <FilteringToken key="2" {...tokenProps} tokens={[token1, token2]} hasGroups={true} />,
        <FilteringToken key="1" {...tokenProps} showOperation={true} tokens={[token1]} hasGroups={true} />,
        <FilteringToken key="3" {...tokenProps} showOperation={true} tokens={[token2]} hasGroups={true} />,
      ],
      [
        <FilteringToken key="1" {...tokenProps} tokens={[token1]} hasGroups={true} />,
        <FilteringToken key="2" {...tokenProps} showOperation={true} tokens={[token1, token2]} hasGroups={true} />,
        <FilteringToken key="3" {...tokenProps} showOperation={true} tokens={[token2]} hasGroups={true} />,
      ],
      [
        <FilteringToken key="1" {...tokenProps} tokens={[token1]} hasGroups={true} />,
        <FilteringToken key="3" {...tokenProps} showOperation={true} tokens={[token2]} hasGroups={true} />,
        <FilteringToken key="2" {...tokenProps} showOperation={true} tokens={[token1, token2]} hasGroups={true} />,
      ],
    ],
  },
]);

export default function () {
  return (
    <>
      <h1>Property filter tokens permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={tokenPermutations}
          render={permutation => <FilteringToken {...tokenProps} {...permutation} />}
        />

        <br />
        <hr />
        <br />

        <PermutationsView
          permutations={tokenListPermutations}
          render={permutation => <TokenList {...tokenListProps} {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
