// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Popover } from '~components';
import FilteringToken, { FilteringTokenProps } from '~components/property-filter/filtering-token';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const token1 = {
  content: <Popover content="Token editor">property1 = value</Popover>,
  ariaLabel: 'filter property1 = value',
  dismissAriaLabel: 'remove filter property1 = value',
} as const;

const token2 = {
  content: <Popover content="Token editor">property2 = value</Popover>,
  ariaLabel: 'filter property2 = value',
  dismissAriaLabel: 'remove filter property2 = value',
} as const;

const token3 = {
  content: <Popover content="Token editor">very-long-property-name-3 = very-long-property-value</Popover>,
  ariaLabel: 'filter property3 = value',
  dismissAriaLabel: 'remove filter property3 = value',
} as const;

const defaultProps: FilteringTokenProps = {
  tokens: [],
  operation: 'and',
  groupOperation: 'or',
  showOperation: false,
  andText: 'und',
  orText: 'oder',
  groupAriaLabel: 'filter group with 0 tokens',
  operationAriaLabel: 'operation',
  onChangeOperation: () => {},
  onChangeGroupOperation: () => {},
  onDismissToken: () => {},
  disabled: false,
};

const permutations = createPermutations<Partial<FilteringTokenProps>>([
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
  },
  // Group token with or disabled
  {
    tokens: [[token1, token2]],
    operation: ['or'],
    groupOperation: ['and'],
    showOperation: [true],
    disabled: [false, true],
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
  },
]);

export default function () {
  return (
    <>
      <h1>Property filter tokens permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <FilteringToken {...defaultProps} {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
