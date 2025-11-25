// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TextFilter, { TextFilterProps } from '~components/text-filter';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const style1 = {
  root: {
    borderColor: {
      default: '#f59e0b',
      hover: '#b45309',
      focus: '#d97706',
      disabled: '#fcd34d',
      readonly: '#fcd34d',
    },
    borderWidth: '2px',
    borderRadius: '16px',
    backgroundColor: {
      default: '#fde68a',
      hover: '#fcd34d',
      focus: '#fcd34d',
      disabled: '#fcd34d',
      readonly: '#fef3c7',
    },
    boxShadow: {
      default: '0 2px 8px rgba(245, 158, 11, 0.15)',
      hover: '0 6px 16px rgba(245, 158, 11, 0.25)',
      focus: '0 0 0 4px rgba(245, 158, 11, 0.25), 0 6px 16px rgba(245, 158, 11, 0.3)',
      disabled: 'none',
      readonly: '0 2px 8px rgba(245, 158, 11, 0.15)',
    },
    color: {
      default: '#78350f',
      hover: '#78350f',
      focus: '#78350f',
      disabled: '#78350f',
      readonly: '#92400e',
    },
  },
};

const permutations = createPermutations<TextFilterProps>([
  {
    disabled: [true, false],
    countText: [undefined, 'N matches'],
    filteringText: ['', 'query'],
    filteringPlaceholder: [undefined, 'Filter instances...'],
    style: [style1],
  },
]);

export default function TextFilterStylePermutations() {
  return (
    <>
      <h1>TextFilter Style permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <TextFilter filteringClearAriaLabel="Clear" filteringAriaLabel="Filter field" {...permutation} />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
