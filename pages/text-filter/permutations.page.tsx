// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import TextFilter, { TextFilterProps } from '~components/text-filter';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<TextFilterProps>([
  {
    disabled: [true, false],
    countText: [undefined, 'N matches'],
    filteringText: ['', 'query'],
    filteringPlaceholder: [undefined, 'Filter instances...'],
  },
]);

export default function () {
  return (
    <>
      <h1>Text filter permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <TextFilter {...permutation} filteringClearAriaLabel="Clear" filteringAriaLabel="filtering example" />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
